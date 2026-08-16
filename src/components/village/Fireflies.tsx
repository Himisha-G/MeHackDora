const FIREFLIES = Array.from({ length: 54 }, (_, i) => ({
  left: (i * 17.3) % 100,
  top: 20 + ((i * 29) % 78),
  delay: (i * 310) % 11000,
  size: 2 + (i % 4),
  duration: 7 + (i % 7),
  drift: 18 + ((i * 13) % 46),
}));

export function Fireflies() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          className="village-firefly absolute rounded-full bg-village-gold"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}ms`,
            animationDuration: `${f.duration}s`,
            ["--drift-x" as string]: `${f.drift}px`,
            boxShadow: "0 0 10px 3px oklch(0.9 0.15 90 / 0.75)",
          }}
        />
      ))}
    </div>
  );
}
