import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Globe, Heart, Shield, MessageSquare, Sparkles, Send, Flame, Smile } from "lucide-react";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect — Ananda" },
      {
        name: "description",
        content: "The lantern-lit pagoda where villagers gather to talk, share small wins and cheer each other on.",
      },
      { property: "og:title", content: "Connect — Ananda" },
      { property: "og:description", content: "Gather in the pagoda and share your day with the village." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnectWorld,
});

type PostReaction = {
  count: number;
  active: boolean;
  emoji: string;
  label: string;
};

type Post = {
  id: string;
  author: string;
  avatar: string;
  mood: "😔 Heavy" | "😊 Light" | "😐 Okay";
  timestamp: string;
  text: string;
  reactions: {
    strength: PostReaction;
    alone: PostReaction;
    sitting: PostReaction;
  };
};

const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    author: "Anonymous",
    avatar: "🕯️",
    mood: "😔 Heavy",
    timestamp: "2 hours ago",
    text: "Feeling really overwhelmed with college work today. Sometimes it feels like I'm running on empty and everyone else is moving so fast. Just taking it one breath at a time.",
    reactions: {
      strength: { count: 8, active: false, emoji: "💛", label: "Sending strength" },
      alone: { count: 12, active: false, emoji: "🤍", label: "You are not alone" },
      sitting: { count: 5, active: false, emoji: "🕯️", label: "Sitting with you" },
    }
  },
  {
    id: "p2",
    author: "Anonymous",
    avatar: "🌙",
    mood: "😐 Okay",
    timestamp: "4 hours ago",
    text: "Spent some quiet time by the great waterfall today. It didn't solve my problems, but the sound of the water helped quiet the noise in my head for a bit. Nature really has a gentle way of grounding us.",
    reactions: {
      strength: { count: 4, active: false, emoji: "💛", label: "Sending strength" },
      alone: { count: 7, active: false, emoji: "🤍", label: "You are not alone" },
      sitting: { count: 3, active: false, emoji: "🕯️", label: "Sitting with you" },
    }
  },
  {
    id: "p3",
    author: "Anonymous",
    avatar: "✨",
    mood: "😊 Light",
    timestamp: "6 hours ago",
    text: "Managed to finish a small project that has been hanging over me for weeks. Taking a moment to appreciate the relief and celebrate a small victory.",
    reactions: {
      strength: { count: 15, active: false, emoji: "💛", label: "Sending strength" },
      alone: { count: 9, active: false, emoji: "🤍", label: "You are not alone" },
      sitting: { count: 2, active: false, emoji: "🕯️", label: "Sitting with you" },
    }
  }
];

function ConnectWorld() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [selectedMood, setSelectedMood] = useState<"😔 Heavy" | "😊 Light" | "😐 Okay">("😐 Okay");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse moves tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // HTML5 Starfield Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

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
        this.size = 1.0 + Math.random() * 2.0;
        this.alpha = 0.25 + Math.random() * 0.5;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.baseVx = this.vx;
        this.baseVy = this.vy;

        const hue = Math.random() > 0.5 
          ? 35 + Math.floor(Math.random() * 15) // Warm amber stars
          : 280 + Math.floor(Math.random() * 40); // Purple/indigo accents
        this.color = `hsla(${hue}, 85%, 65%, `;
      }

      update(mx: number, my: number, reduced: boolean) {
        if (!reduced) {
          this.x += this.vx;
          this.y += this.vy;

          const dx = this.x - mx;
          const dy = this.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxRepelDist = 100;

          if (dist < maxRepelDist && dist > 1) {
            const force = (maxRepelDist - dist) / maxRepelDist;
            this.x += (dx / dist) * force * 1.8;
            this.y += (dy / dist) * force * 1.8;
            this.vx = this.baseVx + (dx / dist) * force * 0.4;
            this.vy = this.baseVy + (dy / dist) * force * 0.4;
          } else {
            this.vx += (this.baseVx - this.vx) * 0.05;
            this.vy += (this.baseVy - this.vy) * 0.05;
          }

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
        c.shadowBlur = 4;
        c.shadowColor = "white";
        c.fill();
        c.shadowBlur = 0;
      }
    }

    const particles: Particle[] = Array.from({ length: 110 }, () => new Particle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let currentMx = -1000;
    let currentMy = -1000;
    const onMouseMoveCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      currentMx = e.clientX - rect.left;
      currentMy = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouseMoveCanvas);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
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

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: crypto.randomUUID(),
      author: isAnonymous ? "Anonymous" : "Villager",
      avatar: selectedMood === "😔 Heavy" ? "🕯️" : selectedMood === "😊 Light" ? "✨" : "🌙",
      mood: selectedMood,
      timestamp: "Just now",
      text: newPostText.trim(),
      reactions: {
        strength: { count: 0, active: false, emoji: "💛", label: "Sending strength" },
        alone: { count: 0, active: false, emoji: "🤍", label: "You are not alone" },
        sitting: { count: 0, active: false, emoji: "🕯️", label: "Sitting with you" },
      }
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
  };

  const handleReactionClick = (postId: string, reactionType: "strength" | "alone" | "sitting") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const currentReaction = post.reactions[reactionType];
        const newActiveState = !currentReaction.active;
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: {
              ...currentReaction,
              active: newActiveState,
              count: newActiveState ? currentReaction.count + 1 : currentReaction.count - 1,
            }
          }
        };
      })
    );
  };

  return (
    <main className="min-h-screen w-full bg-slate-950 overflow-x-hidden relative text-white flex flex-col items-center p-4 pb-16 sm:p-6 sm:pb-24">
      {/* Background Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 size-full pointer-events-none z-0" />

      {/* Silhouette pines and cottage layout */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10 text-slate-950 fill-current select-none opacity-85" aria-hidden>
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M 0 200 L 0 170 L 40 140 L 45 145 L 80 110 L 85 115 L 120 70 L 130 90 L 160 120 L 200 150 L 250 175 L 300 160 L 320 140 L 330 145 L 370 100 L 390 125 L 430 155 L 500 170 L 520 160 L 530 165 L 560 130 L 600 165 L 650 175 L 700 140 L 720 110 L 730 115 L 760 80 L 780 110 L 820 150 L 880 175 L 940 160 L 980 120 L 1020 80 L 1040 105 L 1080 145 L 1150 170 L 1220 160 L 1240 140 L 1250 145 L 1280 110 L 1320 145 L 1380 170 L 1440 150 L 1440 200 Z" />
          <path d="M 620 175 L 650 140 L 680 175 Z" />
        </svg>
        <div className="absolute left-[45.2%] bottom-[12px] w-2.5 h-2.5 rounded-full bg-amber-400 blur-[1px] shadow-[0_0_12px_4px_rgba(251,191,36,0.65)] animate-pulse" />
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.02)] active:scale-95 cursor-pointer backdrop-blur-md"
      >
        ← Back to village
      </Link>

      {/* Header Container */}
      <header className="relative z-10 text-center select-none mt-12 mb-8 max-w-xl">
        <span className="text-[10px] font-bold tracking-[0.25em] text-amber-500 uppercase block mb-1">
          THE LANTERN PAGODA
        </span>
        <h1 className="font-display text-4xl font-extrabold text-white">Connect</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Share your day and remember nobody here is doing this alone.
        </p>
      </header>

      {/* Main Grid Content */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Composer and Feed */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Post Composer Card */}
          <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md p-6 z-10">
            <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
              <div className="w-full">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="How was your day?"
                  className="bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/20 outline-none text-white text-sm p-4 w-full h-24 placeholder-slate-400 transition-all resize-none shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.02)]"
                />
              </div>

              {/* Controls Section */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Mood Chips Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold select-none">Mood:</span>
                  {(["😔 Heavy", "😐 Okay", "😊 Light"] as const).map((mood) => {
                    const isActive = selectedMood === mood;
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all border cursor-pointer active:scale-95 flex items-center gap-1 ${
                          isActive
                            ? "bg-amber-500/20 border-amber-400/40 text-amber-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4)]"
                            : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10 shadow-[2px_2px_6px_rgba(0,0,0,0.35)]"
                        }`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>

                {/* Anonymous Toggle and Submit button */}
                <div className="flex items-center gap-4">
                  {/* Share Anonymously Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                      <Shield className="size-3.5 text-slate-400" />
                      Anonymous
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4.5 rounded-full transition-colors duration-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)] ${
                        isAnonymous ? "bg-amber-600" : "bg-slate-800"
                      }`} />
                      <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform duration-300 shadow-md ${
                        isAnonymous ? "translate-x-3.5" : "translate-x-0"
                      }`} />
                    </div>
                  </label>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!newPostText.trim()}
                    className="bg-amber-600/80 hover:bg-amber-500 text-white font-semibold text-xs px-5 py-2 rounded-full transition-all shadow-[4px_4px_10px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.02)] active:scale-95 active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6)] disabled:opacity-55 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-1 shrink-0"
                  >
                    Share
                    <Send className="size-3" />
                  </button>
                </div>

              </div>
            </form>
          </section>

          {/* Feed Post List */}
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_20px_2px_rgba(245,158,11,0.08),12px_12px_24px_rgba(0,0,0,0.6),inset_1px_1px_0px_rgba(255,255,255,0.05)] flex flex-col gap-4"
              >
                {/* Post Header */}
                <div className="flex justify-between items-center select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-lg bg-white/5 border border-white/10 rounded-full w-8 h-8 flex items-center justify-center shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
                      {post.avatar}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block leading-none">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-semibold inline-block bg-white/5 px-2 py-0.5 rounded-full border border-white/5 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.02)]">
                        {post.mood}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {post.timestamp}
                  </span>
                </div>

                {/* Post Text */}
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap pl-1">
                  {post.text}
                </p>

                {/* Safe Reaction buttons row */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {(Object.keys(post.reactions) as Array<keyof typeof post.reactions>).map((type) => {
                    const reaction = post.reactions[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleReactionClick(post.id, type)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                          reaction.active
                            ? "bg-amber-500/20 border-amber-400/40 text-amber-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]"
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-slate-300 shadow-[2px_2px_6px_rgba(0,0,0,0.35)]"
                        }`}
                      >
                        <span>{reaction.label}</span>
                        <span>{reaction.emoji}</span>
                        <span className={`text-[10px] font-bold ${reaction.active ? "text-amber-300" : "text-slate-500"}`}>
                          {reaction.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

        </div>

        {/* Right Side: Sidebar Widget "Found Company" */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Found Company Widget Card */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-5 shadow-[12px_12px_24px_rgba(0,0,0,0.6),-6px_-6px_20px_rgba(255,255,255,0.02),inset_1px_1px_0px_rgba(255,255,255,0.05)] flex flex-col gap-4 select-none">
            <header className="flex items-center gap-1.5 border-b border-white/5 pb-2.5">
              <Sparkles className="size-4 text-amber-400" />
              <h3 className="text-xs font-bold text-amber-400/90 tracking-wider uppercase">
                Found Company
              </h3>
            </header>

            <div className="flex flex-col gap-4">
              
              {/* Row 1: Heavy mood company */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.02),3px_3px_8px_rgba(0,0,0,0.4)]">
                {/* Overlapping glowing avatar layout */}
                <div className="flex shrink-0">
                  <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-xs flex items-center justify-center shadow-[0_0_10px_2px_rgba(16,185,129,0.3)] select-none">
                    🕯️
                  </span>
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs flex items-center justify-center -ml-3.5 shadow-[0_0_10px_2px_rgba(245,158,11,0.3)] select-none">
                    🕯️
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    2 others feel heavy right now.
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">
                    Sitting quietly in the pagoda.
                  </p>
                </div>
              </div>

              {/* Row 2: Okay/Light mood company */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.02),3px_3px_8px_rgba(0,0,0,0.4)]">
                <div className="flex shrink-0">
                  <span className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-xs flex items-center justify-center shadow-[0_0_10px_2px_rgba(99,102,241,0.3)] select-none">
                    🌙
                  </span>
                  <span className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-400/40 text-xs flex items-center justify-center -ml-3.5 shadow-[0_0_10px_2px_rgba(20,184,166,0.3)] select-none">
                    ✨
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    5 others feel okay right now.
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">
                    Breathing, resting.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Quick Safety Guideline Card */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-5 shadow-[12px_12px_24px_rgba(0,0,0,0.6),-6px_-6px_20px_rgba(255,255,255,0.02),inset_1px_1px_0px_rgba(255,255,255,0.05)] flex flex-col gap-2.5 select-none text-xs text-slate-400 leading-relaxed">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5 leading-none border-b border-white/5 pb-2">
              <Shield className="size-4 text-emerald-400" />
              Lantern Pagoda Rules
            </h4>
            <p>• Everything is anonymous by default. Your safety and peace are protected.</p>
            <p>• No comments or text replies are allowed here to prevent judgment or unsolicited advice.</p>
            <p>• Offer quiet support solely through safe, pre-selected reactions.</p>
          </section>

        </aside>

      </div>
    </main>
  );
}
