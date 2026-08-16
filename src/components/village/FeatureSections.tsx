import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, HeartHandshake, Sparkle, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Feature = {
  to: string;
  label: string;
  tagline: string;
  blurb: string;
  icon: LucideIcon;
  tone: "gold" | "mint" | "lilac" | "rose";
  items: string[];
};

const FEATURES: Feature[] = [
  {
    to: "/guidebot",
    label: "GuideBot",
    tagline: "The lantern cottage",
    blurb:
      "A steady companion for the heavier days. Ask anything, get grounding steps, gentle reframes and calming guidance whenever you need it.",
    icon: Bot,
    tone: "mint",
    items: ["Grounding exercises", "Gentle advice", "Coping toolkits", "Always awake"],
  },
  {
    to: "/friendbot",
    label: "FriendBot",
    tagline: "The cosy porch",
    blurb:
      "No fixing, no advice — just a warm friend who listens. Vent, ramble, celebrate or sit in silence with someone who is happy you came by.",
    icon: HeartHandshake,
    tone: "rose",
    items: ["Pure listening", "Zero judgement", "Daily check-ins", "Cheerful company"],
  },
  {
    to: "/activity-zone",
    label: "ActivityZone",
    tagline: "The domed workshop",
    blurb:
      "A little village workshop of soothing things to do with your hands, breath and imagination when the mind needs somewhere to go.",
    icon: Sparkle,
    tone: "lilac",
    items: [
      "Library of calm reads",
      "Writing & journaling",
      "Doodle & colouring challenges",
      "Yoga & light stretches",
      "Mindfulness & gratitude",
    ],
  },
  {
    to: "/connect",
    label: "Connect",
    tagline: "The lantern pagoda",
    blurb:
      "Where villagers gather. Share how your day went, read someone else's story and remember that nobody here is doing this alone.",
    icon: Users,
    tone: "gold",
    items: ["Village chat", "Share your day", "Kind replies", "Found company"],
  },
];

const toneBits: Record<Feature["tone"], { glow: string; chip: string; text: string }> = {
  gold: { glow: "from-village-gold/25", chip: "bg-village-gold/90 text-village-ink", text: "text-village-gold" },
  mint: { glow: "from-village-mint/25", chip: "bg-village-mint/90 text-village-ink", text: "text-village-mint" },
  lilac: { glow: "from-village-lilac/25", chip: "bg-village-lilac/90 text-village-ink", text: "text-village-lilac" },
  rose: { glow: "from-village-rose/25", chip: "bg-village-rose/90 text-village-ink", text: "text-village-rose" },
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function FeatureSections() {
  return (
    <section id="features" className="relative bg-village-ink pb-24">
      {/* soft fade from the artwork into the story below */}
      <div className="pointer-events-none h-24 bg-gradient-to-b from-transparent to-village-ink" aria-hidden />

      <div className="mx-auto w-full max-w-5xl px-5">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-village-cream/25 bg-village-cream/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-village-cream/85 uppercase backdrop-blur-sm">
              <Sparkle className="size-3.5" /> Four islands, four kinds of comfort
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-village-cream sm:text-5xl">
              Wander a little further
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-village-cream/75 sm:text-base">
              Every cottage in the village holds something small and kind. Here&apos;s what waits behind each door.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-10">
          {FEATURES.map((f, i) => {
            const bits = toneBits[f.tone];
            return (
              <Reveal key={f.to} delay={i * 60}>
                <Link
                  to={f.to}
                  className="group relative block overflow-hidden rounded-[2rem] border border-village-cream/15 bg-village-cream/[0.06] p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-village-cream/30 hover:bg-village-cream/[0.1] sm:p-9"
                >
                  <div
                    className={`pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-gradient-to-b ${bits.glow} to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-70`}
                    aria-hidden
                  />
                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                    <span
                      className={`village-float grid size-14 shrink-0 place-items-center rounded-2xl ${bits.chip} shadow-[var(--glow-warm)]`}
                    >
                      <f.icon className="size-7" strokeWidth={2.3} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className={`font-display text-xs tracking-[0.2em] uppercase ${bits.text}`}>
                        {f.tagline}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-extrabold text-village-cream sm:text-3xl">
                        {f.label}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-village-cream/75 sm:text-base">
                        {f.blurb}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {f.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-village-cream/20 bg-village-ink/40 px-3 py-1 text-xs text-village-cream/85"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>

                      <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold text-village-cream">
                        Enter {f.label}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-16 text-center text-xs text-village-cream/55">
            A gentle companion, not a replacement for professional care. If you&apos;re in crisis, please reach out to
            a local helpline.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
