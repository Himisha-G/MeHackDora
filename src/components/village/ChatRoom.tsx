import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

export type ChatMessage = { id: string; role: "you" | "them"; author?: string; text: string };

export function ChatRoom({
  seed,
  placeholder,
  note,
}: {
  seed: ChatMessage[];
  placeholder: string;
  note: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "you", text }]);
    setDraft("");
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-lg sm:p-6">
      <div className="flex max-h-[52vh] min-h-72 flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={m.id}
            className={`village-rise flex ${m.role === "you" ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
          >
            <div className={m.role === "you" ? "max-w-[80%]" : "max-w-[85%]"}>
              {m.role === "them" && m.author ? (
                <p className="mb-1 text-xs font-semibold text-muted-foreground">{m.author}</p>
              ) : null}
              <p
                className={
                  m.role === "you"
                    ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
                    : "rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-sm leading-relaxed text-secondary-foreground"
                }
              >
                {m.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="mt-4 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder={placeholder}
          className="min-h-12 flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          <Send className="size-4" />
        </button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </section>
  );
}
