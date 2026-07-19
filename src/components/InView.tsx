"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Adds `is-inview` once the element scrolls into view (one-shot) — CSS keyed
 * off that class runs the frame's reveal choreography. No-op for markup:
 * a plain div wrapper.
 */
export default function InView({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${seen ? "is-inview" : ""}`.trim()}>
      {children}
    </div>
  );
}
