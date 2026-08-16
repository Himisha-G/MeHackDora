import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export type HotspotTone = "gold" | "mint" | "lilac" | "rose";

const toneRing: Record<HotspotTone, string> = {
  gold: "bg-village-gold/45",
  mint: "bg-village-mint/45",
  lilac: "bg-village-lilac/45",
  rose: "bg-village-rose/45",
};

const toneChip: Record<HotspotTone, string> = {
  gold: "bg-village-gold/95 text-village-ink",
  mint: "bg-village-mint/95 text-village-ink",
  lilac: "bg-village-lilac/95 text-village-ink",
  rose: "bg-village-rose/95 text-village-ink",
};

const toneText: Record<HotspotTone, string> = {
  gold: "text-village-gold",
  mint: "text-village-mint",
  lilac: "text-village-lilac",
  rose: "text-village-rose",
};

export function Hotspot({
  to,
  label,
  caption,
  icon: Icon,
  tone,
  x,
  y,
  delay = 0,
}: {
  to: string;
  label: string;
  caption: string;
  icon: LucideIcon;
  tone: HotspotTone;
  x: number;
  y: number;
  delay?: number;
}) {
  return (
    <Link
      to={to}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}ms` }}
      aria-label={`${label} — ${caption}`}
    >
      <span className="village-float relative flex flex-col items-center gap-2">
        {/* Whimsical label ribbon floats ABOVE the marker so the cottage stays visible */}
        <span className="flex flex-col items-center">
          <span
            className={`village-sway inline-flex items-center gap-1.5 rounded-full border border-village-cream/60 bg-village-ink/55 px-3 py-1 shadow-[0_6px_20px_-6px_oklch(0.2_0.05_265/0.8)] backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1`}
          >
            <span className={`text-[10px] ${toneText[tone]}`}>✦</span>
            <span className="font-display text-sm font-bold leading-none tracking-wide text-village-cream drop-shadow-[0_1px_6px_oklch(0.2_0.05_265/0.9)] sm:text-base">
              {label}
            </span>
            <span className={`text-[10px] ${toneText[tone]}`}>✦</span>
          </span>
          <span className="max-h-0 overflow-hidden text-center text-[11px] italic leading-snug text-village-cream/90 drop-shadow transition-all duration-300 group-hover:mt-1 group-hover:max-h-10 group-focus-visible:mt-1 group-focus-visible:max-h-10">
            {caption}
          </span>
          <span className="mt-1 h-4 w-px bg-gradient-to-b from-village-cream/70 to-transparent" />
        </span>

        <span className="relative grid place-items-center">
          <span
            className={`absolute size-11 rounded-full ${toneRing[tone]}`}
            style={{ animation: "village-pulse-ring 2.6s ease-out infinite", animationDelay: `${delay}ms` }}
          />
          <span
            className={`absolute size-11 rounded-full ${toneRing[tone]}`}
            style={{ animation: "village-pulse-ring 2.6s ease-out infinite", animationDelay: `${delay + 900}ms` }}
          />
          <span
            className={`relative grid size-11 place-items-center rounded-full ${toneChip[tone]} shadow-[var(--glow-warm)] transition-transform duration-300 group-hover:scale-115 group-focus-visible:scale-115`}
          >
            <Icon className="size-5" strokeWidth={2.4} />
          </span>
        </span>
      </span>
    </Link>
  );
}
