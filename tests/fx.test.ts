// Rules behind the motion system. Run: node --test tests/
// 1. Full mode never flashes more than 3 times in any one second (WCAG 2.3.1), however many triggers fire.
// 2. Calm mode never flashes at all.
// 3. The warning gate shows until a choice is stored; reduced motion preselects calm.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createFlashPlanner, MIN_GAP_MS } from "../src/lib/flash.ts";
import { resolveMode, gateDefault, MODE_KEY } from "../src/lib/mode.ts";

const maxInAnySecond = (onsets: number[]) => {
  let worst = 0;
  for (const start of onsets) worst = Math.max(worst, onsets.filter((t) => t >= start && t < start + 1000).length);
  return worst;
};

test("a burst of ten flashes at once is spread out to 3 a second at most", () => {
  const plan = createFlashPlanner("full");
  const onsets = plan.add(10, 0);
  assert.equal(onsets.length, 10);
  assert.ok(maxInAnySecond(onsets) <= 3, `got ${maxInAnySecond(onsets)}`);
});

test("triggers fired close together share one budget", () => {
  const plan = createFlashPlanner("full");
  const all = [...plan.add(2, 0), ...plan.add(2, 50), ...plan.add(3, 400), ...plan.add(1, 900)];
  assert.ok(maxInAnySecond(all) <= 3, `got ${maxInAnySecond(all)}`);
});

test("random scroll storms never break the limit", () => {
  for (let run = 0; run < 200; run++) {
    const plan = createFlashPlanner("full");
    let t = 0, all: number[] = [];
    for (let i = 0; i < 30; i++) { t += Math.random() * 300; all = all.concat(plan.add(1 + Math.floor(Math.random() * 4), t)); }
    assert.ok(maxInAnySecond(all) <= 3);
  }
});

test("the gap between flashes is a third of a second or more", () => {
  assert.ok(MIN_GAP_MS > 1000 / 3);
  const onsets = createFlashPlanner("full").add(4, 0);
  for (let i = 1; i < onsets.length; i++) assert.ok(onsets[i] - onsets[i - 1] >= MIN_GAP_MS);
});

test("flashes far apart are not delayed", () => {
  const plan = createFlashPlanner("full");
  assert.deepEqual(plan.add(1, 0), [0]);
  assert.deepEqual(plan.add(1, 5000), [5000]);
});

test("calm mode plans no flashes", () => {
  assert.deepEqual(createFlashPlanner("calm").add(5, 0), []);
});

test("no stored choice means the gate shows", () => {
  assert.equal(resolveMode(null), null);
  assert.equal(resolveMode("nonsense"), null);
});

test("a stored choice skips the gate", () => {
  assert.equal(resolveMode("full"), "full");
  assert.equal(resolveMode("calm"), "calm");
});

test("reduced motion preselects calm on the gate", () => {
  assert.equal(gateDefault(true), "calm");
  assert.equal(gateDefault(false), "full");
  assert.equal(MODE_KEY, "onenept-motion");
});
