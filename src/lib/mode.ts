// Full or calm motion. The warning gate shows until a visitor picks one; the pick is remembered.
// Tested in tests/fx.test.ts.
import type { Mode } from "./flash.ts";

export const MODE_KEY = "onenept-motion";

/** The stored choice, or null when the gate should show. */
export function resolveMode(stored: string | null): Mode | null {
  return stored === "full" || stored === "calm" ? stored : null;
}

/** Which button the gate highlights. Browsers asking for less motion get calm. */
export function gateDefault(reducedMotion: boolean): Mode {
  return reducedMotion ? "calm" : "full";
}
