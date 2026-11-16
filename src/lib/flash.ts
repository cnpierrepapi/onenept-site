// Flash budget. WCAG 2.3.1: no more than three flashes in any one second. Every full-screen colour frame
// on the site goes through one planner, so the limit holds however many scroll triggers fire at once.
// Tested in tests/fx.test.ts.

export type Mode = "full" | "calm";

/** A third of a second and a bit: any one-second window can hold three onsets at most. */
export const MIN_GAP_MS = 340;

export function createFlashPlanner(mode: Mode) {
  let last = -Infinity;
  return {
    /** Plan `count` flashes asked for at time `now` (ms). Returns when each one may start. */
    add(count: number, now: number): number[] {
      if (mode === "calm") return [];
      const out: number[] = [];
      for (let i = 0; i < count; i++) {
        const at = Math.max(now, last + MIN_GAP_MS);
        out.push(at);
        last = at;
      }
      return out;
    },
  };
}
