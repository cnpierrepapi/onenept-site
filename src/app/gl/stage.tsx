"use client";

import { useEffect, useRef } from "react";
import type { SceneKey } from "./scenes";

/* A box that gets a WebGL scene once it is on the client. three.js is
   loaded lazily, so the page text never waits for it. */
export default function Stage({
  scene,
  className,
}: {
  scene: SceneKey;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let dispose: (() => void) | undefined;
    let gone = false;
    import("./scenes").then(({ mount }) => {
      if (!gone) dispose = mount(scene, host);
    });
    return () => {
      gone = true;
      dispose?.();
    };
  }, [scene]);

  return <div ref={ref} aria-hidden="true" className={className} />;
}
