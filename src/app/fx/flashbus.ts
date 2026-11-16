// Every full-screen colour frame on the site goes through here, so the 3-a-second limit in
// src/lib/flash.ts holds for all of them together. Calm mode turns flashes into one slow wash.
import { createFlashPlanner, type Mode } from "@/lib/flash";

export type FlashKind = "flash" | "tear" | "wash";
type Listener = (color: string, kind: FlashKind) => void;

const COLORS: Record<string, string> = { cobalt: "#2F5BFF", lemon: "#FFE14D", orange: "#FF6B2C", ink: "#15120F", red: "#E8402B" };

let mode: Mode = "full";
let planner = createFlashPlanner(mode);
const listeners = new Set<Listener>();

export function setFlashMode(m: Mode) {
  mode = m;
  planner = createFlashPlanner(m);
}

export function onFlash(l: Listener) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** Ask for flash frames, e.g. flash(["cobalt", "lemon"]). Spaced out by the planner. */
export function flash(colors: string[], kind: FlashKind = "flash") {
  if (mode === "calm") {
    listeners.forEach((l) => l(COLORS[colors[0]] ?? colors[0], "wash"));
    return;
  }
  const now = performance.now();
  planner.add(colors.length, now).forEach((at, i) => {
    const c = COLORS[colors[i]] ?? colors[i];
    window.setTimeout(() => listeners.forEach((l) => l(c, kind)), at - now);
  });
}
