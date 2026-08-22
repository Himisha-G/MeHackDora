import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Shield, ArrowLeft, LogOut, Wifi, WifiOff, DoorOpen } from "lucide-react";

import knockImage from "../assets/knock.png";
import connectImage from "../assets/connectImg.png";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect — Ananda" },
      {
        name: "description",
        content:
          "Knock on the door and find someone to talk to anonymously.",
      },
      { property: "og:title", content: "Connect — Ananda" },
      {
        property: "og:description",
        content:
          "Knock on the door and find someone to talk to anonymously.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ConnectWorld,
});

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ConnectionState = "connecting" | "waiting" | "matched" | "connected";

type Message = {
  id: string;
  text: string;
  sender: "me" | "partner";
};

type ServerEvent = {
  type: "connected" | "waiting" | "matched" | "message" | "partner_left" | "error";
  message?: string;
  client_id?: string;
};

const WS_URL = "wss://anonymouschat-885z.onrender.com/ws";
const DOOR_OPEN_MS = 900;

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

function ConnectWorld() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [connectionError, setConnectionError] = useState("");

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------------------------------------------------------------------
  // Connect to WebSocket
  // ---------------------------------------------------------------------------
  //
  // FIX: every handler now checks `isCurrent()` — i.e. "is this socket still
  // the one socketRef is pointing at, and have we not been cancelled" — before
  // touching state or acting on a message. This makes the whole thing immune
  // to StrictMode's double-mount (mount -> cleanup -> mount), which previously
  // left a stale, still-connecting socket alive in the background because the
  // old cleanup only closed sockets that were already OPEN.
  // ---------------------------------------------------------------------------

  const connectToServer = useCallback(() => {
    if (cancelledRef.current) return;

    console.log("Connecting to:", WS_URL);

    setConnectionState("connecting");
    setConnectionError("");

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    const isCurrent = () => socketRef.current === socket && !cancelledRef.current;

    socket.onopen = () => {
      if (!isCurrent()) {
        // A newer connection replaced this one (or we were cancelled)
        // before the handshake finished. Don't let this stale socket
        // linger on the backend.
        socket.close(1000, "Stale connection");
        return;
      }
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      if (!isCurrent()) return;

      let data: ServerEvent;
      try {
        data = JSON.parse(String(event.data));
      } catch {
        console.warn("Received non-JSON message, ignoring:", event.data);
        return;
      }

      console.log("📨 Server event:", data);

      switch (data.type) {
        case "connected":
          break;

        case "waiting":
          setConnectionState("waiting");
          break;

        case "matched": {
          setConnectionState("matched");
          setConnectionError("");

          setMessages([
            {
              id: crypto.randomUUID(),
              text: "You are now connected. Say hello 👋",
              sender: "partner",
            },
          ]);

          setTimeout(() => {
            if (isCurrent()) {
              setConnectionState("connected");
            }
          }, DOOR_OPEN_MS);

          break;
        }

        case "message":
          setMessages((previous) => [
            ...previous,
            {
              id: crypto.randomUUID(),
              text: data.message ?? "",
              sender: "partner",
            },
          ]);
          break;

        case "partner_left":
          setConnectionState("waiting");
          setMessages([]);
          setConnectionError(data.message ?? "Your partner left the chat.");
          break;

        case "error":
          setConnectionError(data.message ?? "Something went wrong.");
          break;

        default:
          console.warn("Unknown event type from server:", data);
      }
    };

    socket.onclose = (event) => {
      console.log("🔌 WebSocket closed:", event.code, event.reason);

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      if (cancelledRef.current) return;
      if (socketRef.current !== null) return; // a newer socket already took over

      setConnectionState("waiting");
      setMessages([]);

      if (event.code !== 1000) {
        setConnectionError(
          "The connection was interrupted. Trying to reconnect..."
        );

        setTimeout(() => {
          if (!cancelledRef.current) {
            connectToServer();
          }
        }, 2000);
      }
    };

    socket.onerror = (error) => {
      if (!isCurrent()) return;
      console.error("❌ WebSocket error:", error);
      setConnectionError("Unable to connect to the chat server.");
    };
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    connectToServer();

    return () => {
      cancelledRef.current = true;

      // FIX: close unconditionally (any state except already-closed/closing),
      // not just when OPEN — this is what actually prevents the StrictMode
      // orphan-socket bug.
      const socket = socketRef.current;
      socketRef.current = null;

      if (
        socket &&
        socket.readyState !== WebSocket.CLOSED &&
        socket.readyState !== WebSocket.CLOSING
      ) {
        socket.close(1000, "Leaving Connect page");
      }
    };
  }, [connectToServer]);

  // ---------------------------------------------------------------------------
  // Send Message
  // ---------------------------------------------------------------------------

  const sendMessage = () => {
    const text = messageText.trim();
    if (!text) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (connectionState !== "connected") return;

    socket.send(JSON.stringify({ type: "message", message: text }));

    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), text, sender: "me" },
    ]);

    setMessageText("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ---------------------------------------------------------------------------
  // Leave Chat
  // ---------------------------------------------------------------------------

  const leaveChat = () => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      connectToServer();
      return;
    }

    socket.send(JSON.stringify({ type: "leave" }));

    setMessages([]);
    setMessageText("");
    setConnectionError("");
    setConnectionState("waiting");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const showChatRoom = connectionState === "connected";
  const showDoorOpening = connectionState === "matched";
  const backgroundImage =
    connectionState === "connected" || connectionState === "matched"
      ? connectImage
      : knockImage;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#24170f] text-white">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Only dim the scene before/during matching — once connected, let the
          background art breathe. The chat card below carries its own contrast. */}
      {!showChatRoom && (
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            showDoorOpening ? "bg-black/20" : "bg-black/10"
          }`}
        />
      )}

      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between p-4 sm:p-6">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-black/40 active:scale-95"
        >
          <ArrowLeft className="size-4" />
          Back to village
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-2 text-xs font-semibold backdrop-blur-md">
          {connectionState === "connected" ? (
            <>
              <Wifi className="size-3.5 text-emerald-300" />
              <span className="text-emerald-100">Connected</span>
            </>
          ) : connectionState === "matched" ? (
            <>
              <DoorOpen className="size-3.5 text-emerald-300" />
              <span className="text-emerald-100">Opening the door</span>
            </>
          ) : connectionState === "waiting" ? (
            <>
              <Wifi className="size-3.5 text-amber-300" />
              <span className="text-amber-100">Waiting</span>
            </>
          ) : (
            <>
              <WifiOff className="size-3.5 text-white/70" />
              <span className="text-white/80">Connecting</span>
            </>
          )}
        </div>
      </div>

      {!showChatRoom && (
        <section className="relative z-20 flex min-h-screen items-end justify-center px-4 pb-10 pt-24 sm:pb-14">
          <div className="w-full max-w-md text-center">
            <div className="rounded-3xl border border-white/20 bg-black/20 p-5 shadow-2xl backdrop-blur-md sm:p-6">
              {connectionState === "connecting" ? (
                <>
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/20">
                    <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">
                    Finding the door...
                  </h1>
                  <p className="mt-2 text-sm text-white/75">
                    Connecting you to the village.
                  </p>
                </>
              ) : connectionState === "matched" ? (
                <>
                  <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-100/10">
                    <DoorOpen className="size-6 animate-pulse text-emerald-200" />
                  </div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    The door opens...
                  </h1>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/75">
                    Someone's here. Stepping inside.
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-3 flex items-center justify-center">
                    <div className="animate-pulse rounded-full border border-amber-200/30 bg-amber-100/10 px-5 py-2 text-sm font-semibold text-amber-50 backdrop-blur-sm">
                      Knock... Knock...
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    Waiting for someone
                  </h1>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/75">
                    Someone else is looking for a quiet conversation too.
                    Stay here and we'll open the door when they arrive.
                  </p>

                  {connectionError && (
                    <p className="mt-3 text-xs text-red-200">
                      {connectionError}
                    </p>
                  )}
                </>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/60">
                <Shield className="size-3.5" />
                Anonymous conversation
              </div>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- */}
      {/* CHAT ROOM — now a compact floating card, not a full-bleed panel */}
      {/* so the background art stays the star of the screen.            */}
      {/* -------------------------------------------------------------- */}

      {showChatRoom && (
        <section className="absolute inset-0 z-20 flex items-end justify-center p-4 sm:items-center sm:justify-end sm:p-8">
          <div className="flex h-[75vh] max-h-[560px] w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#2b1b13]/85 shadow-2xl backdrop-blur-lg">
            <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/10 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
                  A quiet room
                </p>
                <h1 className="mt-1 text-base font-bold text-white">
                  You found someone
                </h1>
              </div>

              <button
                type="button"
                onClick={leaveChat}
                className="flex items-center gap-1.5 rounded-full border border-red-200/20 bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-100 transition-all hover:bg-red-900/30 active:scale-95"
              >
                <LogOut className="size-3.5" />
                Leave
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
              <div className="flex flex-col gap-2.5">
                {messages.map((message) => {
                  const isMine = message.sender === "me";
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-lg ${
                          isMine
                            ? "rounded-br-md bg-amber-600/90 text-white"
                            : "rounded-bl-md border border-white/10 bg-white/10 text-white/90"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-black/10 p-2.5 sm:p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
                <textarea
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Write something..."
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2.5 py-1.5 text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white transition-all hover:bg-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] text-white/40">
                <Shield className="size-3" />
                Your identity stays anonymous
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}