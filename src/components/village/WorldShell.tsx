import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function WorldShell({
  title,
  subtitle,
  accent = "gold",
  children,
}: {
  title: string;
  subtitle: string;
  accent?: "gold" | "mint" | "lilac" | "rose";
  children: ReactNode;
}) {
  const glow: Record<string, string> = {
    gold: "from-village-gold/30",
    mint: "from-village-mint/30",
    lilac: "from-village-lilac/30",
    rose: "from-village-rose/30",
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className={`pointer-events-none absolute inset-x-0 -top-40 h-96 bg-gradient-to-b ${glow[accent]} to-transparent blur-2xl`}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-4xl px-5 py-8">
        <Link
          to="/"
          className="village-rise inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-x-0.5"
        >
          <ArrowLeft className="size-4" />
          Back to the village
        </Link>

        <header className="village-rise mt-7" style={{ animationDelay: "80ms" }}>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>
        </header>

        <div className="village-rise mt-8" style={{ animationDelay: "160ms" }}>
          {children}
        </div>
      </div>
    </main>
  );
}
