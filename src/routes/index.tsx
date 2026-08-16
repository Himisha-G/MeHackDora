import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, HeartHandshake, Sparkle, Users } from "lucide-react";
import villageAsset from "@/assets/village.png";
import { Hotspot } from "@/components/village/Hotspot";
import { Fireflies } from "@/components/village/Fireflies";
import { StarTrail } from "@/components/village/StarTrail";
import { FeatureSections } from "@/components/village/FeatureSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ananda — A calm world for your mind" },
      {
        name: "description",
        content:
          "Explore a gentle village of four islands: GuideBot, FriendBot, ActivityZone and Connect — chat, journal, stretch and share.",
      },
      { property: "og:title", content: "Ananda" },
      {
        property: "og:description",
        content: "Four islands for calmer days: GuideBot, FriendBot, ActivityZone and Connect.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VillageHome,
});

function VillageHome() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: px, y: py });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <main className="min-h-screen bg-village-ink">
      <StarTrail />

      <section
        ref={frameRef}
        className="relative isolate grid min-h-screen w-full place-items-center overflow-hidden"
      >
        {/* Stage keeps the artwork's 3:2 ratio so each hotspot stays on its island */}
        <div
          className="absolute transition-transform duration-500 ease-out will-change-transform"
          style={{
            width: "max(100vw, 150vh)",
            height: "max(66.67vw, 100vh)",
            transform: `scale(1.05) translate3d(${tilt.x * -20}px, ${tilt.y * -14}px, 0)`,
          }}
        >
          <img
            src={villageAsset}
            alt="Illustrated village of floating islands with cottages, a great tree, waterfalls and a lantern-lit pagoda at sunset"
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-village-ink/45 via-transparent to-village-ink/45"
            aria-hidden
          />
          <Fireflies />

          <div className="absolute inset-0 z-10">
            <Hotspot
              to="/guidebot"
              label="GuideBot"
              caption="Guidance, grounding & gentle advice"
              icon={Bot}
              tone="mint"
              x={23}
              y={34}
              delay={0}
            />
            <Hotspot
              to="/connect"
              label="Connect"
              caption="Share your day with the village"
              icon={Users}
              tone="gold"
              x={73.5}
              y={23}
              delay={400}
            />
            <Hotspot
              to="/friendbot"
              label="FriendBot"
              caption="A warm friend who just listens"
              icon={HeartHandshake}
              tone="rose"
              x={26}
              y={66}
              delay={800}
            />
            <Hotspot
              to="/activity-zone"
              label="ActivityZone"
              caption="Read, journal, doodle, stretch, breathe"
              icon={Sparkle}
              tone="lilac"
              x={73}
              y={65}
              delay={1200}
            />
          </div>
        </div>

        <header className="village-rise absolute inset-x-0 top-0 z-20 flex flex-col items-center px-4 pt-7 text-center sm:pt-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-village-cream/85 px-4 py-1.5 text-xs font-semibold tracking-wide text-village-ink uppercase">
            <Sparkle className="size-3.5" /> A gentle place to land
          </span>
          <h1 className="village-shimmer font-display text-4xl font-extrabold tracking-tight text-village-cream drop-shadow-[0_3px_14px_oklch(0.2_0.05_265/0.85)] sm:text-6xl lg:text-7xl">
            Ananda
          </h1>
          <p className="mt-3 max-w-xl text-sm text-village-cream/90 drop-shadow sm:text-base">
            Wander the islands. Tap a home to open its world.
          </p>
        </header>

        <a
          href="#features"
          className="village-rise absolute inset-x-0 bottom-6 z-20 mx-auto flex w-fit flex-col items-center gap-1.5 rounded-full border border-village-cream/25 bg-village-ink/45 px-5 py-2.5 text-village-cream backdrop-blur-md transition-colors hover:bg-village-ink/70"
          style={{ animationDelay: "1400ms" }}
        >
          <span className="font-display text-xs font-bold tracking-[0.18em] uppercase">
            Scroll to explore
          </span>
          <ChevronDown className="village-bob size-4 text-village-gold" />
        </a>
      </section>

      <FeatureSections />
    </main>
  );
}
