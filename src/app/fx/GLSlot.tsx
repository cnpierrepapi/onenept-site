"use client";

import { useEffect, useRef } from "react";
import { stage, type SceneKey } from "./gl/stage";

/** A place on the page where a WebGL scene is drawn. Decoration only: hidden from screen readers.
 *  shift moves the subject sideways on wide slots (uv units) to make room for text. */
export default function GLSlot({
  scene,
  icon = false,
  shift = 0,
  shiftNarrow = 0,
  className = "",
}: {
  scene: SceneKey;
  icon?: boolean;
  shift?: number;
  shiftNarrow?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return stage.add(ref.current, scene, { icon, shift, shiftNarrow });
  }, [scene, icon, shift, shiftNarrow]);
  const still = `url(/stills/${scene}${icon ? "-icon" : ""}.jpg)`;
  return <div ref={ref} aria-hidden="true" data-still data-scene={scene + (icon ? "-icon" : "")} className={`gl-slot ${className}`} style={{ "--still": still } as React.CSSProperties} />;
}
