import { useEffect, useRef } from "react";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  rot: number;
  life: number;
};

/** Golden starry sparkle trail that follows the pointer. */
export function StarTrail() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;

    let id = 0;
    let last = 0;
    const stars: Star[] = [];

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 38) return;
      last = now;
      const size = 8 + Math.random() * 12;
      const star: Star = {
        id: id++,
        x: e.clientX + (Math.random() - 0.5) * 14,
        y: e.clientY + (Math.random() - 0.5) * 14,
        size,
        rot: Math.random() * 90,
        life: 900 + Math.random() * 500,
      };
      stars.push(star);

      const el = document.createElement("span");
      el.className = "village-star";
      el.style.left = `${star.x}px`;
      el.style.top = `${star.y}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.setProperty("--star-rot", `${star.rot}deg`);
      el.style.animationDuration = `${star.life}ms`;
      layer.appendChild(el);
      window.setTimeout(() => el.remove(), star.life);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    />
  );
}
