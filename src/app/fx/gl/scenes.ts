// One clay scene per section, as rasterised meshes. Shapes are meshed once from distance functions
// (src/lib/mesh.ts); each frame only moves, turns and recolours them. uP-style progress `p` is the
// scroll progress through the scene's track; each scene tells its story along it.
import { Geometry, Transform, type Mesh, type OGLRenderingContext } from "ogl";
import { meshSDF, sd } from "@/lib/mesh";
import { C, Kit, ease, mix, setColour, smooth, stretch, type ClayMesh, type Colour } from "./clay";

export type ClayKey = "hero" | "adfontes" | "fugitiva" | "melax" | "merge";

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

const hash = (n: number) => { const s = Math.sin(n) * 43758.5453; return s - Math.floor(s); };

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

/* AD FONTES ("to the sources"). Small islands rise out of the paper one by one; a cobalt spring wells
   up from the middle one; then trade lines run from the spring to every island. */
const ISLES: [number, number, number, number][] = [
  [0, 0, 0, 0.62], [-1.75, 0.35, -0.7, 0.44], [1.7, 0.22, -0.5, 0.48], [-1.0, -0.35, 1.05, 0.36], [1.05, -0.28, 1.15, 0.4],
];
function adfontes(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const world = new Transform(); world.setParent(root);
  const house = geo(kit.gl, (x, y, z) => sd.roundBox(x, y, z, 0.085, 0.075, 0.085, 0.018), [-0.1, -0.1, -0.1], [0.1, 0.1, 0.1], 0.012);
  const roof = geo(kit.gl, (x, y, z) => sd.roundBox(x, y, z, 0.1, 0.03, 0.1, 0.012), [-0.12, -0.05, -0.12], [0.12, 0.05, 0.12], 0.01);
  const isles = ISLES.map(([, , , r], i) => {
    const g = new Transform(); g.setParent(world);
    const h = r * 0.5;
    add(kit.wrap(geo(kit.gl, (x, y, z) => sd.cyl(x, y, z, r - 0.04, 0.035) - 0.04, [-r - 0.05, -0.1, -r - 0.05], [r + 0.05, 0.1, r + 0.05], 0.02), C.lemon, g));
    add(kit.wrap(geo(kit.gl, (x, y, z) => sd.cappedCone(x, y + 0.06 + h, z, h, r * 0.14, r * 0.9) - 0.02, [-r, -0.12 - 2 * h, -r], [r, 0.0, r], 0.02), C.orange, g));
    if (i > 0) {
      const hs = add(kit.wrap(house, C.cream, g)); hs.position.set(r * 0.32, 0.15, r * 0.12);
      const rf = add(kit.wrap(roof, C.cobalt, g)); rf.position.set(r * 0.32, 0.25, r * 0.12);
    }
    const s = shade(world);
    return { g, s };
  });
  const drops = Array.from({ length: 7 }, () => add(kit.sphere(C.cobalt, world)));
  const lines = Array.from({ length: 4 }, () => add(kit.rod(C.cobalt, world)));

  return {
    root, solids, shadows, clipY: -100,
    cam: (_a, icon) => (icon ? { pos: [0, 2.6, 6.8], target: [0, 0, 0] } : { pos: [0, 2.7, 7.6], target: [0, 0.2, 0] }),
    update(p, t, _intro, icon) {
      const P = icon ? 1 : p;
      world.rotation.y = -(t * 0.05 + (icon ? t * 0.25 : 0));
      const tops: number[][] = [];
      ISLES.forEach(([x, y, z, r], i) => {
        const a = ease(smooth(0.02 + i * 0.07, 0.3 + i * 0.07, P));
        const yy = mix(-4.5, y, a) + 0.06 * Math.sin(t * 0.8 + i * 1.7);
        isles[i].g.position.set(x, yy, z);
        tops.push([x, yy + 0.12, z]);
        isles[i].s.position.set(x, -2.295, z);
        isles[i].s.scale.set(r * 2.6, r * 2.6, 1);
        isles[i].s.program.uniforms.uOpacity.value = 0.22 * a;
      });
      const well = ease(smooth(0.38, 0.55, P));
      const t0 = tops[0];
      drops.forEach((m, k) => {
        const ph = (t * 0.32 + k / 7) % 1;
        m.position.set(t0[0] + 0.06 * Math.sin(k * 2.3 + t), t0[1] + 0.08 + ph * 1.7 * well, t0[2] + 0.06 * Math.cos(k * 1.7));
        const s = 0.15 * (1 - ph * 0.75) * well;
        m.scale.set(s, s, s);
        m.visible = s > 0.001;
      });
      const crown = [t0[0], t0[1] + 1.25 * well, t0[2]];
      lines.forEach((m, j) => {
        const i = j + 1;
        const g = ease(smooth(0.56 + i * 0.05, 0.72 + i * 0.05, P));
        const e = tops[i];
        stretch(m, crown, [mix(crown[0], e[0], g), mix(crown[1], e[1], g), mix(crown[2], e[2], g)], g > 0 ? 0.028 : 0);
      });
    },
  };
}

/* FUGITIVA. A woman's face built from Bauhaus shapes flies together from scattered shards, then a red
   redaction bar slams across the eyes. */
function fugitiva(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const face = new Transform(); face.setParent(root);
  const gl = kit.gl;
  type Piece = { m: ClayMesh; c: [number, number, number] };
  const piece = (g: Geometry, colour: Colour, c: [number, number, number]): Piece => ({ m: add(kit.wrap(g, colour, face)), c });
  const B = (r: number, zh: number): [[number, number, number], [number, number, number]] => [[-r - 0.05, -r - 0.05, -zh - 0.05], [r + 0.05, r + 0.05, zh + 0.05]];
  const pieces: Piece[] = [
    piece(geo(gl, (x, y, z) => sd.slab(sd.halfDisc(x, y, 1.08, 1), z, 0.07), ...B(1.08, 0.07), 0.02), C.ink, [0, 0.18, -0.14]),
    piece(geo(gl, (x, y, z) => sd.slab(Math.hypot(x, y) - 0.9, z, 0.08), ...B(0.9, 0.08), 0.018), C.cobalt, [0, 0.05, 0]),
    piece(geo(gl, (x, y, z) => sd.slab(sd.halfDisc(x, y, 0.17, -1), z, 0.05), ...B(0.17, 0.05), 0.008), C.ink, [-0.33, 0.2, 0.11]),
    piece(geo(gl, (x, y, z) => sd.slab(Math.hypot(x, y) - 0.15, z, 0.05), ...B(0.15, 0.05), 0.008), C.lemon, [0.33, 0.22, 0.11]),
    piece(geo(gl, (x, y, z) => sd.slab(sd.tri(x, y, 0.15), z, 0.05), ...B(0.2, 0.05), 0.008), C.orange, [0, -0.06, 0.11]),
    piece(geo(gl, (x, y, z) => sd.roundBox(x, y, z, 0.3, 0.06, 0.05, 0.03), [-0.35, -0.1, -0.1], [0.35, 0.1, 0.1], 0.01), C.cream, [0, -0.44, 0.11]),
    piece(geo(gl, (x, y, z) => sd.slab(sd.halfDisc(x, y, 1.05, 1), z, 0.09), ...B(1.05, 0.09), 0.02), C.orange, [0, -1.42, -0.06]),
  ];
  const ear = add(kit.sphere(C.lemon, face));
  pieces.push({ m: ear, c: [0.93, -0.28, 0.06] });
  const bar = add(kit.wrap(geo(gl, (x, y, z) => sd.roundBox(x, y, z, 1.45, 0.14, 0.05, 0.025), [-1.5, -0.2, -0.1], [1.5, 0.2, 0.1], 0.015), C.red, face));
  const sh = shade(root);
  sh.position.set(0, -1.415, 0);

  return {
    root, solids, shadows, clipY: -100,
    cam: (_a, icon) => (icon ? { pos: [0, 0.25, 5.4], target: [0, -0.1, 0] } : { pos: [0, 0.4, 7.0], target: [0, -0.2, 0] }),
    update(p, t, _intro, icon) {
      const P = icon ? 1 : p;
      face.rotation.y = 0.18 * Math.sin(t * 0.4);
      pieces.forEach(({ m, c }, fi) => {
        const a = ease(smooth(0.05 + fi * 0.045, 0.34 + fi * 0.045, P));
        m.position.set(c[0] + Math.sin(fi * 3.7) * 3.6 * (1 - a), c[1] + Math.cos(fi * 2.3) * 2.6 * (1 - a), c[2] + Math.sin(fi * 1.9) * 2.4 * (1 - a));
        m.rotation.z = -(1 - a) * (fi * 1.4 + 0.8);
      });
      ear.scale.set(0.09, 0.09, 0.09);
      const slam = ease(smooth(0.7, 0.8, P));
      bar.position.set(mix(-16, 0, slam), 0.22, 0.24);
      bar.rotation.z = 0.06;
      const settle = ease(smooth(0.3, 0.5, P));
      sh.scale.set(2.8, 1.2, 1);
      sh.program.uniforms.uOpacity.value = 0.3 * settle;
    },
  };
}

/* Melax. A button phone spins in, its keys press # 2 5 8 0 # in step with the scroll, its screen lights,
   then a lightning bolt cracks out of the top (melax is Wolof for lightning). */
const bump = (t: number, P: number) => smooth(t - 0.025, t, P) * (1 - smooth(t + 0.02, t + 0.05, P));
const pressOf = (k: number, P: number) =>
  k === 11 ? Math.max(bump(0.34, P), bump(0.665, P)) : k === 1 ? bump(0.405, P) : k === 4 ? bump(0.47, P) : k === 7 ? bump(0.535, P) : k === 10 ? bump(0.6, P) : 0;
/* # 2 5 8 0 #, as key indices (row * 3 + column) */
const DIALS = [11, 1, 4, 7, 10, 11];
function melax(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const phone = new Transform(); phone.setParent(root);
  const gl = kit.gl;
  add(kit.wrap(geo(gl, (x, y, z) => Math.max(sd.roundBox(x, y, z, 0.62, 1.28, 0.14, 0.11), -sd.roundBox(x, y - 0.62, z - 0.14, 0.5, 0.38, 0.05, 0.04)), [-0.68, -1.34, -0.2], [0.68, 1.34, 0.2], 0.02), C.lemon, phone));
  const screen = add(kit.wrap(geo(gl, (x, y, z) => sd.roundBox(x, y, z, 0.47, 0.35, 0.012, 0.01), [-0.5, -0.38, -0.04], [0.5, 0.38, 0.04], 0.012), C.ink, phone));
  screen.position.set(0, 0.62, 0.105);
  const keyG = geo(gl, (x, y, z) => sd.roundBox(x, y, z, 0.12, 0.075, 0.045, 0.03), [-0.14, -0.1, -0.07], [0.14, 0.1, 0.07], 0.01);
  const keys = Array.from({ length: 12 }, () => add(kit.wrap(keyG, C.ink, phone)));
  const bolt = Array.from({ length: 6 }, () => add(kit.rod(C.lemon, root)));
  bolt.forEach((b) => setColour(b, C.lemon, 1));
  const sh = shade(root);

  return {
    root, solids, shadows, clipY: -100,
    cam: (_a, icon) => (icon ? { pos: [0, 0.3, 5], target: [0, -0.05, 0] } : { pos: [0, 0.45, 6.4], target: [0, 0.25, 0] }),
    update(p, t, _intro, icon, frame) {
      const P = icon ? 0.62 : p;
      const fly = frame ? ease(Math.min(1, p / 0.12)) : ease(smooth(0, 0.24, P));
      phone.position.set(mix(3, 0, fly), mix(2.6, 0, fly), mix(-6, 0, fly));
      phone.rotation.set(0.1, -(mix(3.4, 0.42, fly) + (icon ? 0.45 * Math.sin(t * 0.7) : 0.1 * Math.sin(t * 0.6))), 0);
      const lit = frame ? (p > 0.02 ? 1 : 0) : ease(smooth(0.26, 0.32, P));
      setColour(screen, lit > 0.5 ? C.cobalt : C.ink, lit > 0.5 ? 1 : 0);
      keys.forEach((m, k) => {
        const r = Math.floor(k / 3), c = k % 3;
        const press = frame ? (frame.index < 6 && DIALS[frame.index] === k ? 1 : 0) : pressOf(k, P);
        m.position.set(-0.32 + 0.32 * c, 0.02 - 0.27 * r, 0.15 - 0.045 * press);
        setColour(m, press > 0.3 ? C.orange : C.ink);
      });
      const g = frame ? (frame.index >= frame.count ? ease(smooth(0.15, 0.45, frame.rest)) : 0) : ease(smooth(0.8, 0.9, P)) * (1 - smooth(0.97, 1, P));
      let a = [0, 1.45, 0];
      bolt.forEach((m, i) => {
        const b0 = [((i % 2) * 2 - 1) * (0.28 + 0.1 * hash(i + Math.floor(t * 8))), 1.45 + (i + 1) * 0.55, 0];
        const k = Math.min(1, Math.max(0, g * 6 - i));
        const b = [mix(a[0], b0[0], k), mix(a[1], b0[1], k), mix(a[2], b0[2], k)];
        stretch(m, a, b, k > 0 ? 0.06 : 0);
        a = b;
      });
      sh.position.set(phone.position.x, -1.615, phone.position.z);
      sh.scale.set(1.9, 0.8, 1);
      sh.program.uniforms.uOpacity.value = 0.32 * fly;
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

export const BUILDERS: Record<ClayKey, (kit: Kit) => ClayScene> = { hero, adfontes, fugitiva, melax, merge };
export type { Mesh };
