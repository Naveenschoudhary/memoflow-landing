'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A silent, looping product demo.
 *
 * Client-side only to read `prefers-reduced-motion`: a clip that cannot be
 * stopped is exactly what that setting exists to prevent, and there is no way
 * to suppress `autoplay` from CSS. When motion is reduced the clip holds on its
 * poster frame and gains controls, so the demo is still reachable — it just
 * waits to be asked.
 *
 * The <video> element itself is server-rendered, so the poster and the sources
 * are in the initial HTML and the markup is crawlable. Only the autoplay and
 * controls attributes change after mount, which is why the initial state here
 * matches what the server renders.
 */
export default function DemoVideo({
  mp4,
  webm,
  poster,
  width,
  height,
  label,
}: {
  mp4: string;
  webm: string;
  poster: string;
  width: number;
  height: number;
  /** Describes the clip for screen readers, since there is no audio track. */
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setReduceMotion(query.matches);
      if (query.matches) ref.current?.pause();
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return (
    <video
      ref={ref}
      // eslint-disable-next-line jsx-a11y/media-has-caption -- no audio track; described by aria-label and the figure caption
      aria-label={label}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="metadata"
      autoPlay={!reduceMotion}
      controls={reduceMotion}
      className="w-full rounded-2xl border border-[var(--line)] bg-[var(--panel)]"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
