"use client";

import { useEffect, useRef } from "react";
import { stage, type Frame, type SceneKey } from "./gl/stage";

/** A place on the page where a WebGL scene is drawn. Decoration only: hidden from screen readers.
 *  shift moves the subject sideways on wide slots (uv units) to make room for text. */
export default function GLSlot({
  scene,
  icon = false,
  shift = 0,
  shiftNarrow = 0,
  frames,
  restFrom,
  restBg,
  fit,
  className = "",
}: {
  scene: SceneKey;
  icon?: boolean;
  shift?: number;
  shiftNarrow?: number;
  frames?: Frame[];
  restFrom?: number;
  restBg?: string;
  fit?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return stage.add(ref.current, scene, { icon, shift, shiftNarrow, frames, restFrom, restBg, fit });
  }, [scene, icon, shift, shiftNarrow, frames, restFrom, restBg, fit]);
  // a type-only sequence has no object, so no still: without WebGL its section's own text carries it
  const still = scene === "type" ? undefined : `url(/stills/${scene}${icon ? "-icon" : ""}.jpg)`;
  return <div ref={ref} aria-hidden="true" data-still={still ? "" : undefined} data-scene={scene + (icon ? "-icon" : "")} className={`gl-slot ${className}`} style={still ? ({ "--still": still } as React.CSSProperties) : undefined} />;
}
