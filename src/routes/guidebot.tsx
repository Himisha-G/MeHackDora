import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Send, Mic, Globe, Leaf, HeartHandshake, BriefcaseMedical, Moon } from "lucide-react";

export const Route = createFileRoute("/guidebot")({
  head: () => ({
    meta: [
      { title: "GuideBot — Ananda" },
      {
        name: "description",
        content: "Talk to GuideBot for grounding steps, coping ideas and gentle guidance whenever you need it.",
      },
      { property: "og:title", content: "GuideBot — Ananda" },
      { property: "og:description", content: "Grounding steps and gentle guidance, one message at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuideBotWorld,
});

type ChatMessage = {
  id: string;
  role: "you" | "them";
  author?: string;
  text: string;
  timestamp: string;
};

// Initial welcome messages based on language
const WELCOME_MESSAGES: Record<string, string> = {
  English: "Hello, I am GuideBot. This is your safe space in the Lantern Cottage. How are you feeling today?",
  Hinglish: "Hello, main hoon GuideBot. Lantern Cottage me aapka swagat hai. Aaj aap kaisa feel kar rahe hain?",
  Hindi: "नमस्ते, मैं गाइडबॉट हूँ। लालटेन कॉटेज (Lantern Cottage) में आपका स्वागत है। आज आप कैसा महसूस कर रहे हैं?",
  Marathi: "नमस्कार, मी गाईडबॉट आहे. लँटर्न कॉटेजमध्ये आपले स्वागत आहे. आज तुम्हाला कसे वाटत आहे?",
  Marwari: "खम्मा घणी, म्हे गाइडबॉट हूँ। थे आज कियां महसूस कर रिया हो?",
};

// Mock audio transcription text based on language
const VOICE_SIMULATION_TEXT: Record<string, string> = {
  English: "I'm feeling a bit overwhelmed and stressed today.",
  Hinglish: "Aaj bohot stress feel ho raha hai aur samajh nahi aa raha kya karu.",
  Hindi: "आज मुझे बहुत तनाव महसूस हो रहा है और कुछ समझ नहीं आ रहा।",
  Marathi: "आज मला खूप तणाव जाणवत आहे आणि काय करावे ते सुचत नाहीये.",
  Marwari: "आज मने घणो तनाव लाग रियो है।",
};

function GuideBotWorld() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom interactive & immersive state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parallax mouse position updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // HTML5 Canvas Starfield Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Template
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVx: number;
      baseVy: number;
      size: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 1.2 + Math.random() * 2.2;
        this.alpha = 0.3 + Math.random() * 0.55;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        
        // Glow hues: cyan (170-195), purple/pink (280-330)
        const hue = Math.random() > 0.5 
          ? 170 + Math.floor(Math.random() * 25) 
          : 280 + Math.floor(Math.random() * 50);
        this.color = `hsla(${hue}, 85%, 65%, `;
      }

      update(mx: number, my: number, reduced: boolean) {
        if (!reduced) {
          // Normal ambient drift
          this.x += this.vx;
          this.y += this.vy;

          // Parallax mouse repulsion
          const dx = this.x - mx;
          const dy = this.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxRepelDist = 120;
          
          if (dist < maxRepelDist && dist > 1) {
            const force = (maxRepelDist - dist) / maxRepelDist;
            const repelStrength = 2.2;
            
            // Push away from mouse
            this.x += (dx / dist) * force * repelStrength;
            this.y += (dy / dist) * force * repelStrength;

            // Decelerate velocities slightly when pushed
            this.vx = this.baseVx + (dx / dist) * force * 0.5;
            this.vy = this.baseVy + (dy / dist) * force * 0.5;
          } else {
            // Restore ambient velocities slowly
            this.vx += (this.baseVx - this.vx) * 0.05;
            this.vy += (this.baseVy - this.vy) * 0.05;
          }

          // Boundary wraps
          if (this.x < 0) this.x = width;
          if (this.x > width) this.x = 0;
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `${this.color}${this.alpha})`;
        c.shadowBlur = 5;
        c.shadowColor = "white";
        c.fill();
        c.shadowBlur = 0; // reset
      }
    }

    const particles: Particle[] = Array.from({ length: 160 }, () => new Particle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse coordinates mapped to canvas bounds
    let currentMx = -1000;
    let currentMy = -1000;

    const onMouseMoveCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      currentMx = e.clientX - rect.left;
      currentMy = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouseMoveCanvas);

    // Render loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Render particles
      particles.forEach((p) => {
        p.update(currentMx, currentMy, prefersReducedMotion);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMoveCanvas);
    };
  }, []);

  // Initialize welcome message when language changes
  useEffect(() => {
    const welcomeText = WELCOME_MESSAGES[selectedLanguage] || WELCOME_MESSAGES["English"];
    setMessages([
      {
        id: "welcome",
        role: "them",
        author: "GuideBot",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [selectedLanguage]);

  // Scroll to bottom when messages update or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isChatOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || draft).trim();
    if (!text || isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "you",
      text,
      timestamp,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    if (!textToSend) setDraft("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat/guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from GuideBot");
      }

      const data = await response.json();
      const botResponseText = data.reply || data.response || data.message || data.text || (typeof data === "string" ? data : "");

      const newBotMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "them",
        author: "GuideBot",
        text: botResponseText || "I couldn't process the response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error communicating with GuideBot:", error);
      const errorBotMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "them",
        author: "GuideBot",
        text: "I'm sorry, I couldn't reach the server. Please make sure the backend is running and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isListening || isLoading) return;
    setIsListening(true);

    // Simulate voice recording/transcription
    setTimeout(() => {
      setIsListening(false);
      const voiceText = VOICE_SIMULATION_TEXT[selectedLanguage] || VOICE_SIMULATION_TEXT["English"];
      setDraft(voiceText);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const suggestionChips = [
    "Grounding exercises",
    "Gentle advice",
    "Coping toolkits"
  ];

  return (
    <main className="min-h-screen w-full bg-slate-950 overflow-hidden relative text-white flex flex-col items-center justify-center p-4">
      {/* Morphing Fluid Floating Keyframe styles */}
      <style>{`
        @keyframes float-1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(-2deg); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(0.5deg); } }
        @keyframes float-4 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-1deg); } }
        .animate-float-1 { animation: float-1 5s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 6.5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7.5s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 5.8s ease-in-out infinite; }
      `}</style>

      {/* HTML5 Interactive Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 size-full pointer-events-none z-0" />

      {/* The Village Connection (Silhouette overlay) */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10 text-slate-950 fill-current select-none" aria-hidden>
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M 0 200 L 0 170 L 40 140 L 45 145 L 80 110 L 85 115 L 120 70 L 130 90 L 160 120 L 200 150 L 250 175 L 300 160 L 320 140 L 330 145 L 370 100 L 390 125 L 430 155 L 500 170 L 520 160 L 530 165 L 560 130 L 600 165 L 650 175 L 700 140 L 720 110 L 730 115 L 760 80 L 780 110 L 820 150 L 880 175 L 940 160 L 980 120 L 1020 80 L 1040 105 L 1080 145 L 1150 170 L 1220 160 L 1240 140 L 1250 145 L 1280 110 L 1320 145 L 1380 170 L 1440 150 L 1440 200 Z" />
          <path d="M 620 175 L 650 140 L 680 175 Z" />
        </svg>
        {/* Glow window representing the cottage lantern */}
        <div className="absolute left-[45.2%] bottom-[12px] w-2.5 h-2.5 rounded-full bg-amber-400 blur-[1px] shadow-[0_0_12px_4px_rgba(251,191,36,0.65)] animate-pulse animate-duration-1000" />
      </div>

      {/* ================= LANDING SCREEN ================= */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 z-20 ${
          isChatOpen ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Header Text */}
        <div className="text-center z-10 pointer-events-none px-4 select-none mb-8">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent opacity-95">
            The Lantern Cottage
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-sm mx-auto">
            A steady companion for the heavier days. Tap a floating bubble to step inside.
          </p>
        </div>

        {/* Floating Glassmorphic-Neumorphic Bubbles Container */}
        <div className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center">
          
          {/* Bubble 1: How are you feeling? (Large, size-40 / w-40 h-40) */}
          <button
            type="button"
            role="button"
            tabIndex={0}
            onClick={() => setIsChatOpen(true)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsChatOpen(true))}
            aria-label="Enter chat: How are you feeling?"
            className="w-40 h-40 absolute rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-white/[0.08] hover:scale-110 active:scale-95 group text-center shadow-[6px_6px_16px_rgba(0,0,0,0.55),-6px_-6px_16px_rgba(255,255,255,0.03),inset_1px_1px_0px_rgba(255,255,255,0.1)] hover:shadow-[10px_10px_22px_rgba(0,0,0,0.65),-10px_-10px_22px_rgba(255,255,255,0.05),inset_2px_2px_0px_rgba(255,255,255,0.15)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] animate-float-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            style={{ left: "10%", top: "15%" }}
          >
            <span className="text-sm font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors px-4">How are you feeling?</span>
            <span className="text-[10px] text-slate-400 mt-1 max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100 overflow-hidden transition-all duration-300">Grounding exercises</span>
          </button>

          {/* Bubble 2: Talk to me 💬 (Medium, w-32 h-32) */}
          <button
            type="button"
            role="button"
            tabIndex={0}
            onClick={() => setIsChatOpen(true)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsChatOpen(true))}
            aria-label="Enter chat: Talk to me"
            className="w-32 h-32 absolute rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-white/[0.08] hover:scale-110 active:scale-95 group text-center shadow-[6px_6px_16px_rgba(0,0,0,0.55),-6px_-6px_16px_rgba(255,255,255,0.03),inset_1px_1px_0px_rgba(255,255,255,0.1)] hover:shadow-[10px_10px_22px_rgba(0,0,0,0.65),-10px_-10px_22px_rgba(255,255,255,0.05),inset_2px_2px_0px_rgba(255,255,255,0.15)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] animate-float-2 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            style={{ right: "12%", top: "20%" }}
          >
            <span className="text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors px-4">Talk to me 💬</span>
            <span className="text-[10px] text-slate-400 mt-1 max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100 overflow-hidden transition-all duration-300">Gentle guidance</span>
          </button>

          {/* Bubble 3: Take a breath 🧘 (Medium, w-36 h-36) */}
          <button
            type="button"
            role="button"
            tabIndex={0}
            onClick={() => setIsChatOpen(true)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsChatOpen(true))}
            aria-label="Enter chat: Take a breath"
            className="w-36 h-36 absolute rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-white/[0.08] hover:scale-110 active:scale-95 group text-center shadow-[6px_6px_16px_rgba(0,0,0,0.55),-6px_-6px_16px_rgba(255,255,255,0.03),inset_1px_1px_0px_rgba(255,255,255,0.1)] hover:shadow-[10px_10px_22px_rgba(0,0,0,0.65),-10px_-10px_22px_rgba(255,255,255,0.05),inset_2px_2px_0px_rgba(255,255,255,0.15)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] animate-float-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            style={{ left: "28%", bottom: "20%" }}
          >
            <span className="text-sm font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors px-4">Take a breath 🧘</span>
            <span className="text-[10px] text-slate-400 mt-1 max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100 overflow-hidden transition-all duration-300">Coping toolkits</span>
          </button>

          {/* Bubble 4: Grounding 🌿 (Small, w-28 h-28) */}
          <button
            type="button"
            role="button"
            tabIndex={0}
            onClick={() => setIsChatOpen(true)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsChatOpen(true))}
            aria-label="Enter chat: Grounding techniques"
            className="w-28 h-28 absolute rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-white/[0.08] hover:scale-110 active:scale-95 group text-center shadow-[6px_6px_16px_rgba(0,0,0,0.55),-6px_-6px_16px_rgba(255,255,255,0.03),inset_1px_1px_0px_rgba(255,255,255,0.1)] hover:shadow-[10px_10px_22px_rgba(0,0,0,0.65),-10px_-10px_22px_rgba(255,255,255,0.05),inset_2px_2px_0px_rgba(255,255,255,0.15)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] animate-float-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            style={{ right: "26%", bottom: "16%" }}
          >
            <span className="text-sm font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors px-4">Grounding 🌿</span>
            <span className="text-[10px] text-slate-400 mt-1 max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100 overflow-hidden transition-all duration-300">Calming exercises</span>
          </button>

        </div>
      </div>

      {/* ================= CHAT SCREEN ================= */}
      <div
        className={`w-full max-w-3xl flex flex-col gap-4 mt-4 px-4 transition-all duration-700 z-20 ${
          isChatOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none absolute"
        }`}
      >
        {/* Back Button with Neumorphic shadow */}
        <button
          type="button"
          onClick={() => setIsChatOpen(false)}
          className="self-start flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.02)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer backdrop-blur-md"
        >
          ← Back to the magic
        </button>

        {/* Small Cottage Header */}
        <div className="text-center select-none">
          <h2 className="font-display text-2xl font-extrabold text-white">The Lantern Cottage</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Grounding steps, gentle reframes, and safe space, whenever you need it.
          </p>
        </div>

        {/* Core Glassmorphic-Neumorphic Chat Window */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-4 shadow-[20px_20px_40px_rgba(0,0,0,0.75),-10px_-10px_30px_rgba(255,255,255,0.02),inset_1px_1px_0px_rgba(255,255,255,0.05)] sm:p-6 flex flex-col gap-4 min-h-[500px]">
          {/* Top Info Bar */}
          <div className="relative z-10 flex justify-between items-center pb-3 border-b border-white/10 bg-white/5 backdrop-blur-md -mx-4 -mt-4 px-4 py-3 rounded-t-3xl sm:-mx-6 sm:-mt-6 sm:px-6 shadow-[inset_0_-1px_0px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-300">Always listening • Safe Space</span>
            </div>

            <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1 border border-white/10 hover:bg-white/10 transition-colors shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
              <Globe className="size-3.5 text-slate-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isLoading}
                className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer disabled:opacity-55"
              >
                <option value="English" className="bg-slate-900 text-white">English</option>
                <option value="Hinglish" className="bg-slate-900 text-white">Hinglish</option>
                <option value="Hindi" className="bg-slate-900 text-white">Hindi (हिंदी)</option>
                <option value="Marathi" className="bg-slate-900 text-white">Marathi (मराठी)</option>
                <option value="Marwari" className="bg-slate-900 text-white">Marwari (मारवाड़ी)</option>
              </select>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="relative z-10 flex-1 min-h-[300px] max-h-[45vh] overflow-y-auto pr-1 flex flex-col gap-4 py-2 scroll-smooth">
            {messages.map((m, i) => (
              <div
                key={m.id}
                className={`village-rise flex flex-col ${m.role === "you" ? "items-end" : "items-start"}`}
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <div className={m.role === "you" ? "max-w-[80%]" : "max-w-[85%]"}>
                  {m.role === "them" && m.author && (
                    <p className="mb-1 text-[11px] font-bold text-emerald-400/90 tracking-wide pl-1">
                      {m.author}
                    </p>
                  )}
                  <div
                    className={
                      m.role === "you"
                        ? "rounded-2xl rounded-br-sm bg-white/10 border border-white/10 px-4 py-2.5 text-sm leading-relaxed text-white shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.02)] backdrop-blur-sm"
                        : "rounded-2xl rounded-bl-sm bg-emerald-950/40 border border-emerald-500/20 px-4 py-2.5 text-sm leading-relaxed text-emerald-50 shadow-[4px_4px_10px_rgba(0,0,0,0.5),inset_1px_1px_0px_rgba(255,255,255,0.05)]"
                    }
                  >
                    <p>{m.text}</p>
                    <p className={`text-[9px] text-right mt-1 font-medium ${m.role === "you" ? "text-slate-300" : "text-emerald-300/80"}`}>
                      {m.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty Chat Cards with Neumorphic Outsets */}
            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-4 mt-6 mb-2">
                <button
                  type="button"
                  onClick={() => setDraft("Grounding exercises")}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all text-left group active:scale-95 shadow-[4px_4px_12px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(255,255,255,0.02)] relative overflow-hidden"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
                    <Leaf className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Grounding exercises</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Find your center</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDraft("Gentle guidance")}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all text-left group active:scale-95 shadow-[4px_4px_12px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(255,255,255,0.02)] relative overflow-hidden"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
                    <HeartHandshake className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Gentle guidance</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Soft reframes</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDraft("Coping toolkits")}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all text-left group active:scale-95 shadow-[4px_4px_12px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(255,255,255,0.02)] relative overflow-hidden"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
                    <BriefcaseMedical className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Coping toolkits</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Practical tools</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDraft("Always awake")}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all text-left group active:scale-95 shadow-[4px_4px_12px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(255,255,255,0.02)] relative overflow-hidden"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
                    <Moon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">Always awake</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Here 24/7</p>
                  </div>
                </button>
              </div>
            )}

            {/* Bouncing Loader */}
            {isLoading && (
              <div className="village-rise flex justify-start">
                <div className="max-w-[85%]">
                  <p className="mb-1 text-[11px] font-bold text-emerald-400/90 tracking-wide pl-1">
                    GuideBot
                  </p>
                  <div className="rounded-2xl rounded-bl-sm bg-emerald-950/40 px-4 py-3 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] border border-emerald-500/20 flex items-center gap-1.5 w-16 justify-center">
                    <span className="size-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="size-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="size-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips with Soft Outsets */}
          <div className="relative z-10 flex flex-wrap gap-2 mt-2">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDraft(chip)}
                disabled={isLoading}
                className="bg-white/5 hover:bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all border border-white/10 shadow-[2px_2px_6px_rgba(0,0,0,0.35),inset_1px_1px_0px_rgba(255,255,255,0.05)] cursor-pointer active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Form Controls with Inset Neumorphism */}
          <form
            className="relative z-10 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <div className="flex-1">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="How are you feeling today?"
                disabled={isListening || isLoading}
                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 disabled:opacity-75 transition-shadow shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.02)]"
              />
            </div>

            <button
              type="button"
              onClick={handleMicClick}
              disabled={isListening || isLoading}
              className={`p-3 rounded-2xl transition-all duration-300 border border-white/10 bg-white/5 shrink-0 flex items-center justify-center shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.02)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.5)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] ${
                isListening
                  ? "text-emerald-400 bg-emerald-500/10 animate-pulse scale-105"
                  : "text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-50"
              }`}
              title="Simulate Voice Input"
            >
              <Mic className="size-4.5" />
            </button>

            <button
              type="submit"
              disabled={!draft.trim() || isListening || isLoading}
              className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-500 shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.02)] hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] transition-all shrink-0 flex items-center justify-center"
              title="Send Message"
            >
              <Send className="size-4" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
