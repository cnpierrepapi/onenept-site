// One clay scene per section, as rasterised meshes. Shapes are meshed once from distance functions
// (src/lib/mesh.ts); each frame only moves, turns and recolours them. uP-style progress `p` is the
// scroll progress through the scene's track; each scene tells its story along it.
import { Geometry, Transform, type Mesh, type OGLRenderingContext } from "ogl";
import { meshSDF, sd } from "@/lib/mesh";
import { C, Kit, ease, mix, setColour, smooth, stretch, type ClayMesh, type Colour } from "./clay";

export type ClayKey = "hero" | "platforms" | "streets" | "series" | "merge";

export interface Cam { pos: [number, number, number]; target: [number, number, number]; back?: number }
/** which kinetic-type frame is on screen; index === count means the rest frame. rest: 0..1 through it */
export interface FrameInfo { index: number; count: number; bg: string; rest: number }
export interface ClayScene {
  root: Transform;
  solids: ClayMesh[];
  shadows: ClayMesh[];
  clipY: number;
  cam(aspect: number, icon: boolean): Cam;
  update(p: number, t: number, intro: number, icon: boolean, frame?: FrameInfo): void;
}

/** Where each branch finishes merging. The PR cards appear at these points. */
export const MERGE_AT = [0.26, 0.46, 0.66, 0.86];


function geo(gl: OGLRenderingContext, f: (x: number, y: number, z: number) => number, min: [number, number, number], max: [number, number, number], step: number) {
  const d = meshSDF(f, min, max, step);
  return new Geometry(gl, { position: { size: 3, data: d.position }, normal: { size: 3, data: d.normal }, index: { data: d.index } });
}

function base(kit: Kit) {
  const root = new Transform();
  const solids: ClayMesh[] = [], shadows: ClayMesh[] = [];
  const add = (m: ClayMesh) => { solids.push(m); return m; };
  const shade = (parent: Transform = root) => { const s = kit.shadow(parent); shadows.push(s); return s; };
  return { root, solids, shadows, add, shade };
}

/* Hero. A knot of pipes and cables hangs over the paper. Scroll pulls it down through the floor until
   it is gone, and the orange door rises in its place. */
/* knot colours that stand out from each field */
const KNOT: Record<string, Colour[]> = {
  paper: [C.cobalt, C.lemon, C.ink, C.cream],
  cobalt: [C.lemon, C.cream, C.ink, C.orange],
  lemon: [C.cobalt, C.ink, C.cream, C.orange],
  orange: [C.ink, C.cobalt, C.cream, C.lemon],
  ink: [C.lemon, C.cream, C.orange, C.cobalt],
};

function hero(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const knot = new Transform(); knot.setParent(root);
  const cols: Colour[] = [C.cobalt, C.lemon, C.ink, C.cream];
  const tori: ClayMesh[] = [];
  for (let i = 0; i < 7; i++) {
    const m = add(kit.torus(0.62 + 0.18 * Math.sin(i * 1.9), 0.075 + 0.02 * (i % 2), cols[i % 4], knot));
    m.position.set(-Math.sin(i * 2.1) * 0.55, -Math.cos(i * 1.7) * 0.42, -Math.sin(i * 1.3) * 0.45);
    m.rotation.z = i * 0.71;
    tori.push(m);
  }
  const pts = [[-1.5, 0.9, 0.2], [-0.4, 0.1, 0.5], [0.5, 0.75, -0.3], [1.5, -0.2, 0.2]];
  for (let i = 0; i < 3; i++) stretch(add(kit.rod(C.ink, knot)), pts[i], pts[i + 1], 0.07);
  for (const q of pts) { const s = add(kit.sphere(C.ink, knot)); s.position.set(q[0], q[1], q[2]); s.scale.set(0.07, 0.07, 0.07); }
  stretch(add(kit.rod(C.lemon, knot)), [-1.2, -0.6, -0.4], [1.1, 0.95, 0.6], 0.055);

  const door = new Transform(); door.setParent(root);
  add(kit.wrap(geo(kit.gl, (x, y, z) => sd.slab(sd.door(x / 0.82, y / 0.82) * 0.82, z, 0.14), [-0.9, -0.9, -0.2], [0.9, 0.9, 0.2], 0.016), C.orange, door));
  const knotShadow = shade(), doorShadow = shade();
  knotShadow.position.set(0, -0.995, 0);
  doorShadow.position.set(0, -0.995, 0.05);

  return {
    root, solids, shadows, clipY: -1,
    cam: () => ({ pos: [0, 1, 6.4], target: [0, -0.05, 0] }),
    update(p, t, intro, _icon, frame) {
      // with frames: one more loop of cable on every cut, re-posed and recoloured against the field
      const k = frame ? Math.min(frame.index, frame.count) : 6;
      const restP = frame ? frame.rest : p;
      const shown = frame ? Math.min(7, k + 2) : 7;
      const pal = KNOT[frame?.bg ?? "paper"] ?? KNOT.paper;
      tori.forEach((m, i) => {
        m.visible = i < shown;
        m.rotation.x = i * 1.13 + t * 0.18 + k * 0.9;
        setColour(m, pal[i % pal.length]);
      });
      const sink = ease(smooth(0.0, 0.35, restP));
      knot.position.y = 0.12 - 3.6 * sink + (1 - ease(intro)) * 4;
      knot.rotation.y = -t * 0.12 - k * 0.6;
      const rise = ease(smooth(0.2, 0.55, restP));
      door.position.y = mix(-2.3, -0.18, rise);
      door.rotation.y = -(0.35 * (1 - rise) + 0.12 * Math.sin(t * 0.5));
      knotShadow.scale.set(3.4, 2.2, 1);
      knotShadow.program.uniforms.uOpacity.value = 0.26 * (1 - sink) * ease(intro);
      doorShadow.scale.set(2.2, 0.7, 1);
      doorShadow.program.uniforms.uOpacity.value = 0.34 * rise;
    },
  };
}

/* Part 1, the platforms. Three plinths rise one by one. On the first a sheet of paper and a pencil
   (Warmleads: writers and designers). On the second an item box spins (Folofolo: the games). On the third
   three spheres swing round and come into one line (SYZYGY, which is the word for exactly that). */
function platforms(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const gl = kit.gl;
  const world = new Transform(); world.setParent(root);
  const plinthG = geo(gl, (x, y, z) => sd.cyl(x, y, z, 0.5, 0.42) - 0.04, [-0.58, -0.5, -0.58], [0.58, 0.5, 0.58], 0.02);
  const cols: Colour[] = [C.cobalt, C.orange, C.lemon];
  const X = [-1.55, 0, 1.55];
  const plinths = X.map((x, i) => {
    const g = new Transform(); g.setParent(world);
    add(kit.wrap(plinthG, cols[i], g));
    const s = shade(world); s.position.set(x, -0.995, 0); s.scale.set(1.5, 1.1, 1);
    return { g, s };
  });
  // Warmleads: a sheet and a pencil laid across it
  const sheet = add(kit.wrap(geo(gl, (x, y, z) => sd.roundBox(x, y, z, 0.3, 0.012, 0.38, 0.01), [-0.33, -0.03, -0.41], [0.33, 0.03, 0.41], 0.01), C.cream, plinths[0].g));
  sheet.position.set(0, 0.47, 0); sheet.rotation.y = 0.25;
  const pencil = new Transform(); pencil.setParent(plinths[0].g);
  stretch(add(kit.rod(C.orange, pencil)), [-0.32, 0, 0], [0.22, 0, 0], 0.045);
  const tip = add(kit.wrap(geo(gl, (x, y, z) => sd.cappedCone(y, -x, z, 0.06, 0.045, 0.004), [-0.08, -0.06, -0.06], [0.08, 0.06, 0.06], 0.006), C.ink, pencil));
  tip.position.set(0.28, 0, 0);
  // Folofolo: the item box
  const box = add(kit.wrap(geo(gl, (x, y, z) => sd.roundBox(x, y, z, 0.22, 0.22, 0.22, 0.06), [-0.26, -0.26, -0.26], [0.26, 0.26, 0.26], 0.012), C.lemon, plinths[1].g));
  const dotG = geo(gl, (x, y, z) => sd.roundBox(x, y, z, 0.05, 0.05, 0.02, 0.02), [-0.07, -0.07, -0.04], [0.07, 0.07, 0.04], 0.008);
  const dots = [0, 1, 2, 3].map(() => add(kit.wrap(dotG, C.ink, box)));
  dots[0].position.set(0, 0, 0.225); dots[1].position.set(0, 0, -0.225);
  dots[2].position.set(0.225, 0, 0); dots[2].rotation.y = Math.PI / 2;
  dots[3].position.set(-0.225, 0, 0); dots[3].rotation.y = Math.PI / 2;
  // SYZYGY: sun, planet, moon swing into a line
  const sun = add(kit.sphere(C.orange, plinths[2].g));
  const planet = add(kit.sphere(C.cobalt, plinths[2].g));
  const moon = add(kit.sphere(C.cream, plinths[2].g));

  return {
    root, solids, shadows, clipY: -100,
    cam: (_a, icon) => (icon ? { pos: [0, 1.6, 6.6], target: [0, 0.2, 0] } : { pos: [0, 1.7, 7.2], target: [0, 0.25, 0] }),
    update(p, t, _intro, icon) {
      const P = icon ? 1 : p;
      world.rotation.y = 0.05 * Math.sin(t * 0.35) + (icon ? 0.2 * Math.sin(t * 0.5) : 0);
      plinths.forEach(({ g, s }, i) => {
        const a = ease(smooth(0.04 + i * 0.18, 0.24 + i * 0.18, P));
        g.position.set(X[i], mix(-3.2, -0.55, a) + 0.03 * Math.sin(t * 0.9 + i * 2), 0);
        s.program.uniforms.uOpacity.value = 0.24 * a;
      });
      const draw = ease(smooth(0.2, 0.4, P));
      pencil.position.set(mix(0.35, 0.02, draw), 0.53, mix(-0.3, 0.05, draw));
      pencil.rotation.set(0, 0.25 + 0.7 * (1 - draw) + 0.05 * Math.sin(t * 1.3), 0.08);
      box.position.set(0, 0.78 + 0.06 * Math.sin(t * 2), 0);
      box.rotation.set(0.35, t * 1.2, 0.2);
      // orbit angles that all land on 0 (one line) as the rest frame arrives
      const free = 1 - ease(smooth(0.55, 0.78, P));
      const a1 = free * (t * 0.9 + 1.4), a2 = free * (t * 1.7 + 3.1);
      sun.position.set(-0.32, 0.82, 0); sun.scale.set(0.16, 0.16, 0.16);
      planet.position.set(-0.32 + 0.38 * Math.cos(a1), 0.82, 0.38 * Math.sin(a1)); planet.scale.set(0.1, 0.1, 0.1);
      moon.position.set(planet.position.x + 0.2 * Math.cos(a2), 0.82, planet.position.z + 0.2 * Math.sin(a2)); moon.scale.set(0.055, 0.055, 0.055);
    },
  };
}

/* Part 2, real-life games. A small town of clay blocks rises; a trail of orange stones winds through
   the streets as the cuts land, and a pin drops on the spot where the mission ends. */
const BLOCKS: [number, number, number, number][] = [
  [-1.9, -0.9, 0.55, 0], [-0.7, -1.0, 0.85, 1], [0.6, -0.95, 0.45, 2], [1.85, -0.85, 0.7, 0],
  [-1.3, 0.3, 0.4, 2], [0.0, 0.35, 0.65, 0], [1.25, 0.3, 0.5, 1], [-0.6, 1.4, 0.75, 1], [0.7, 1.45, 0.4, 2], [1.95, 1.35, 0.6, 0],
];
const TRAIL_PTS: [number, number][] = [[-2.45, -0.3], [-0.65, -0.3], [-0.65, 0.85], [0.65, 0.85], [0.65, -0.3], [1.9, -0.3], [1.9, 0.85], [2.35, 0.85]];
/* stones laid every ~0.22 along the corners above */
const TRAIL: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; i < TRAIL_PTS.length - 1; i++) {
    const [ax, az] = TRAIL_PTS[i], [bx, bz] = TRAIL_PTS[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, bz - az) / 0.22));
    for (let k = 0; k < n; k++) out.push([ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n]);
  }
  out.push(TRAIL_PTS[TRAIL_PTS.length - 1]);
  return out;
})();
function streets(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const gl = kit.gl;
  const world = new Transform(); world.setParent(root);
  const ground = add(kit.wrap(geo(gl, (x, y, z) => sd.roundBox(x, y, z, 2.7, 0.06, 1.8, 0.05), [-2.75, -0.1, -1.85], [2.75, 0.1, 1.85], 0.03), C.cream, world));
  ground.position.set(0, -0.06, 0);
  const blockG = geo(gl, (x, y, z) => sd.roundBox(x, y, z, 0.26, 0.5, 0.26, 0.05), [-0.3, -0.54, -0.3], [0.3, 0.54, 0.3], 0.02);
  const bcols: Colour[] = [C.cobalt, C.lemon, C.ink];
  const blocks = BLOCKS.map(([, , h, c]) => { const m = add(kit.wrap(blockG, bcols[c], world)); m.scale.set(1, h, 1); return m; });
  const stones = TRAIL.map(() => add(kit.sphere(C.orange, world)));
  const pin = new Transform(); pin.setParent(world);
  const head = add(kit.sphere(C.orange, pin)); head.position.set(0, 0.62, 0); head.scale.set(0.18, 0.18, 0.18);
  add(kit.wrap(geo(gl, (x, y, z) => sd.cappedCone(x, y, z, 0.26, 0.012, 0.13), [-0.15, -0.28, -0.15], [0.15, 0.28, 0.15], 0.01), C.orange, pin)).position.set(0, 0.36, 0);
  const hole = add(kit.sphere(C.cream, pin)); hole.position.set(0, 0.66, 0.13); hole.scale.set(0.06, 0.06, 0.03);
  const sh = shade(world); sh.position.set(0, -0.125, 0); sh.scale.set(7, 4.6, 1);

  return {
    root, solids, shadows, clipY: -100,
    // the board is wide: on a tall phone frame the camera steps back so the pin at the far end stays in shot
    cam: (aspect, icon) => (icon ? { pos: [0, 4.2, 5.2], target: [0, 0, 0.1] } : { pos: [0, 4.0, 6.4], target: [0, -0.1, 0.25], back: aspect < 1 ? 1.3 : 1 }),
    update(p, t, _intro, icon) {
      const P = icon ? 1 : p;
      world.rotation.y = -0.18 + 0.05 * Math.sin(t * 0.3) + (icon ? 0.25 * Math.sin(t * 0.4) : 0);
      sh.program.uniforms.uOpacity.value = 0.18;
      BLOCKS.forEach(([x, z, h], i) => {
        const a = ease(smooth(i * 0.025, 0.2 + i * 0.025, P));
        blocks[i].position.set(x, mix(-1.2, h / 2, a), z);
        blocks[i].visible = a > 0.01;
      });
      const walked = smooth(0.22, 0.66, P) * TRAIL.length;
      TRAIL.forEach(([x, z], i) => {
        const a = ease(Math.min(1, Math.max(0, walked - i)));
        stones[i].position.set(x, 0.06, z);
        const r = 0.065 * a; stones[i].scale.set(r, r * 0.5, r);
        stones[i].visible = a > 0.01;
      });
      const drop = ease(smooth(0.64, 0.74, P));
      const end = TRAIL[TRAIL.length - 1];
      pin.position.set(end[0], mix(3.5, 0, drop) + (drop > 0.99 ? 0.04 * Math.sin(t * 2.2) : 0), end[1]);
      pin.rotation.y = t * 0.8;
      pin.visible = drop > 0.01;
    },
  };
}

/* Part 3, stories. A hand mirror stands on the paper between two candles. The candles light, then a
   crack runs down the glass (vanity horror) and the flames lean towards it. */
const CRACK: number[][] = [[-0.05, 0.55], [0.12, 0.3], [-0.06, 0.08], [0.16, -0.14], [0.02, -0.34], [0.18, -0.55]];
function series(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const gl = kit.gl;
  const mirror = new Transform(); mirror.setParent(root);
  const oval = (x: number, y: number, a: number, b: number) => (Math.hypot(x / a, y / b) - 1) * Math.min(a, b);
  add(kit.wrap(geo(gl, (x, y, z) => sd.slab(Math.max(oval(x, y, 0.62, 0.86), -oval(x, y, 0.5, 0.74)), z, 0.07), [-0.7, -0.95, -0.1], [0.7, 0.95, 0.1], 0.015), C.lemon, mirror));
  const glass = add(kit.wrap(geo(gl, (x, y, z) => sd.slab(oval(x, y, 0.52, 0.76), z, 0.025), [-0.56, -0.8, -0.05], [0.56, 0.8, 0.05], 0.015), C.cobalt, mirror));
  stretch(add(kit.rod(C.lemon, mirror)), [0, -0.86, 0], [0, -1.55, 0], 0.075);
  const knob = add(kit.sphere(C.lemon, mirror)); knob.position.set(0, -1.58, 0); knob.scale.set(0.11, 0.11, 0.11);
  const crack = CRACK.slice(1).map(() => add(kit.rod(C.cream, mirror)));
  crack.forEach((m) => setColour(m, C.cream, 0.6));
  const candles = [-1.45, 1.45].map((x) => {
    const g = new Transform(); g.setParent(root);
    add(kit.wrap(geo(gl, (x2, y, z) => sd.cyl(x2, y, z, 0.13, 0.3) - 0.02, [-0.17, -0.34, -0.17], [0.17, 0.34, 0.17], 0.012), C.cream, g)).position.set(0, 0.3, 0);
    const flame = add(kit.sphere(C.orange, g));
    setColour(flame, C.orange, 1);
    const s = shade(root); s.position.set(x, -0.995, 0.2); s.scale.set(0.8, 0.5, 1);
    g.position.set(x, -1, 0.2);
    return { flame, s };
  });
  const sh = shade(root); sh.position.set(0, -0.995, 0); sh.scale.set(2.4, 0.8, 1);

  return {
    root, solids, shadows, clipY: -100,
    cam: (_a, icon) => (icon ? { pos: [0, 0.2, 5.4], target: [0, -0.15, 0] } : { pos: [0, 0.4, 6.6], target: [0, -0.05, 0] }),
    update(p, t, intro, icon) {
      const P = icon ? 1 : p;
      const rise = ease(smooth(0, 0.18, P));
      mirror.position.set(0, mix(-3, 0.62, rise) + 0.03 * Math.sin(t * 0.7), 0);
      mirror.rotation.set(0, -0.35 * (1 - rise) + 0.18 * Math.sin(t * 0.35) + (icon ? 0.3 * Math.sin(t * 0.6) : 0), 0.04 * Math.sin(t * 0.5));
      sh.program.uniforms.uOpacity.value = 0.3 * rise * ease(intro);
      const lit = ease(smooth(0.18, 0.34, P));
      const cr = smooth(0.4, 0.68, P);
      candles.forEach(({ flame, s }, i) => {
        const fl = 1 + 0.12 * Math.sin(t * 11 + i * 3) + 0.06 * Math.sin(t * 17 + i);
        const r = 0.085 * lit * fl;
        flame.position.set(0.08 * cr * (i === 0 ? 1 : -1), 0.72 + r * 0.6, 0);
        flame.scale.set(r * 0.75, r * 1.5, r * 0.75);
        flame.visible = r > 0.003;
        s.program.uniforms.uOpacity.value = 0.22;
      });
      crack.forEach((m, i) => {
        const k = Math.min(1, Math.max(0, cr * crack.length - i));
        const a = CRACK[i], e = CRACK[i + 1];
        stretch(m, [a[0], a[1], 0.03], [mix(a[0], e[0], k), mix(a[1], e[1], k), 0.03], k > 0 ? 0.018 : 0);
      });
      setColour(glass, cr > 0.95 ? C.ink : C.cobalt);
    },
  };
}

/* Merged upstream. A trunk line with four branches; each grows out, runs along and merges back in, and
   its merge node turns orange. The DOM cards use the same thresholds (MERGE_AT). */
function merge(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  stretch(add(kit.rod(C.ink, root)), [-4.4, 0, 0], [4.4, 0, 0], 0.08);
  for (const x of [-4.4, 4.4]) { const s = add(kit.sphere(C.ink, root)); s.position.set(x, 0, 0); s.scale.set(0.08, 0.08, 0.08); }
  const cols: Colour[] = [C.cobalt, C.lemon, C.orange, C.cobalt];
  const node = (i: number, k: number) => {
    const s = -3.3 + i * 1.75, e = s + 1.35, z = 0.38 * ((i % 2) * 2 - 1);
    return [[s, 0, 0], [s + 0.32, 0.85, z], [e - 0.32, 0.85, z], [e, 0, 0]][k];
  };
  const branches = [0, 1, 2, 3].map((i) => ({
    segs: [0, 1, 2].map(() => add(kit.rod(cols[i], root))),
    joints: [1, 2].map(() => add(kit.sphere(cols[i], root))),
    start: add(kit.sphere(C.cream, root)),
    end: add(kit.sphere(C.cream, root)),
  }));
  const sh = shade(root);
  sh.position.set(0, -0.895, 0);
  sh.scale.set(10, 1.6, 1);
  sh.program.uniforms.uOpacity.value = 0.2;

  return {
    root, solids, shadows, clipY: -100,
    cam: (aspect) => ({ pos: [0, 3, 6.6], target: [0, 0.35, 0], back: Math.max(1, 2.7 / aspect) }),
    update(p) {
      branches.forEach((b, i) => {
        const g = smooth(0.08 + i * 0.2, 0.26 + i * 0.2, p);
        b.segs.forEach((m, k) => {
          const seg = Math.min(1, Math.max(0, g * 3 - k));
          const a = node(i, k), e = node(i, k + 1);
          stretch(m, a, [mix(a[0], e[0], seg), mix(a[1], e[1], seg), mix(a[2], e[2], seg)], seg > 0 ? 0.07 : 0);
        });
        b.joints.forEach((m, k) => {
          const on = g * 3 > k + 1;
          const q = node(i, k + 1);
          m.position.set(q[0], q[1], q[2]);
          m.scale.set(0.07, 0.07, 0.07);
          m.visible = on;
        });
        const s0 = node(i, 0), s3 = node(i, 3);
        b.start.position.set(s0[0], s0[1], s0[2]);
        b.start.scale.set(0.13, 0.13, 0.13);
        const done = g > 0.999;
        b.end.position.set(s3[0], s3[1], s3[2]);
        const r = 0.15 * (done ? 1 : 0.6);
        b.end.scale.set(r, r, r);
        setColour(b.end, done ? C.orange : C.cream);
      });
    },
  };
}

export const BUILDERS: Record<ClayKey, (kit: Kit) => ClayScene> = { hero, platforms, streets, series, merge };
export type { Mesh };
