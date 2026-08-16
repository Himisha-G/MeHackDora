import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Brush, Feather, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WorldShell } from "@/components/village/WorldShell";

export const Route = createFileRoute("/activity-zone")({
  head: () => ({
    meta: [
      { title: "ActivityZone — Ananda" },
      {
        name: "description",
        content:
          "A playful island with a library, journaling prompts, doodle challenges, yoga stretches and mindfulness exercises.",
      },
      { property: "og:title", content: "ActivityZone — Ananda" },
      {
        property: "og:description",
        content: "Library, journaling, doodles, yoga and mindfulness — pick what your mind needs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActivityZoneWorld,
});

const ACTIVITIES: { title: string; emoji: string; icon: LucideIcon; text: string }[] = [
  {
    title: "Library",
    emoji: "📚",
    icon: BookOpen,
    text: "Short reads, stories and calming explainers you can finish in one sitting.",
  },
  {
    title: "Writing & Journaling",
    emoji: "✍️",
    icon: Feather,
    text: "Daily prompts and a private page for whatever needs to leave your head.",
  },
  {
    title: "Doodle & Coloring",
    emoji: "🎨",
    icon: Brush,
    text: "Low-pressure creative challenges — colour, scribble, no rules.",
  },
  {
    title: "Yoga & Light Stretches",
    emoji: "🧘",
    icon: Wind,
    text: "Five-minute flows to unknot your shoulders and slow your breath.",
  },
  {
    title: "Mindfulness & Gratitude",
    emoji: "🌬️",
    icon: Wind,
    text: "Breathing timers and small gratitude rituals for the end of the day.",
  },
];

function ActivityZoneWorld() {
  return (
    <WorldShell
      title="The ActivityZone"
      subtitle="The domed house on the blossom terrace, full of small things that make a day lighter."
      accent="lilac"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {ACTIVITIES.map((a, i) => (
          <article
            key={a.title}
            className="village-rise group rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-village-lilac/25 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <a.icon className="size-5 text-village-ink" />
              </span>
              <h2 className="font-display text-xl font-bold text-foreground">
                {a.title} <span aria-hidden>{a.emoji}</span>
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
            <p className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Coming to this world soon
            </p>
          </article>
        ))}
      </div>
    </WorldShell>
  );
}
