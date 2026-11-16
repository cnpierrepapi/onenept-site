// The SDF mesher (src/lib/mesh.ts) turns a distance function into triangles once, at load.
// Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { meshSDF, sd } from "../src/lib/mesh.ts";

const sphere = (x: number, y: number, z: number) => Math.hypot(x, y, z) - 1;

test("a meshed sphere has its vertices on the surface", () => {
  const m = meshSDF(sphere, [-1.2, -1.2, -1.2], [1.2, 1.2, 1.2], 0.05);
  assert.ok(m.index.length > 300, `only ${m.index.length / 3} triangles`);
  for (let i = 0; i < m.position.length; i += 3) {
    const r = Math.hypot(m.position[i], m.position[i + 1], m.position[i + 2]);
    assert.ok(Math.abs(r - 1) < 0.05, `vertex at radius ${r}`);
  }
});

test("normals point outward and are unit length", () => {
  const m = meshSDF(sphere, [-1.2, -1.2, -1.2], [1.2, 1.2, 1.2], 0.05);
  for (let i = 0; i < m.normal.length; i += 3) {
    const [nx, ny, nz] = [m.normal[i], m.normal[i + 1], m.normal[i + 2]];
    const [px, py, pz] = [m.position[i], m.position[i + 1], m.position[i + 2]];
    assert.ok(Math.abs(Math.hypot(nx, ny, nz) - 1) < 1e-3);
    assert.ok(nx * px + ny * py + nz * pz > 0.9, "normal points inward");
  }
});

test("every triangle index is a real vertex", () => {
  const m = meshSDF(sphere, [-1.2, -1.2, -1.2], [1.2, 1.2, 1.2], 0.1);
  const n = m.position.length / 3;
  for (const k of m.index) assert.ok(k >= 0 && k < n);
});

test("a shape outside the box gives an empty mesh, not a crash", () => {
  const m = meshSDF(sphere, [5, 5, 5], [6, 6, 6], 0.1);
  assert.equal(m.index.length, 0);
});

test("the door has a hole and a doorway", () => {
  // centre of the ring: outside the solid; middle of the band at the top: inside; the doorway: outside
  assert.ok(sd.door(0, 0) > 0);
  assert.ok(sd.door(0, 0.76) < 0);
  assert.ok(sd.door(0, -0.9) > 0);
  assert.ok(sd.door(0.6, -0.5) < 0);
});

test("rounded box and slab are solid in the middle", () => {
  assert.ok(sd.roundBox(0, 0, 0, 1, 1, 1, 0.2) < 0);
  assert.ok(sd.roundBox(1.1, 0, 0, 1, 1, 1, 0.2) > 0);
  assert.ok(sd.slab(-0.5, 0, 0.1) < 0);
  assert.ok(sd.slab(-0.5, 0.2, 0.1) > 0);
});
