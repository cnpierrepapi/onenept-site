// One clay scene per section, as rasterised meshes. Shapes are meshed once from distance functions
// (src/lib/mesh.ts); each frame only moves, turns and recolours them. uP-style progress `p` is the
// scroll progress through the scene's track; each scene tells its story along it.
import { Geometry, Transform, type Mesh, type OGLRenderingContext } from "ogl";
import { meshSDF, sd } from "@/lib/mesh";
import { C, Kit, ease, mix, setColour, smooth, stretch, type ClayMesh, type Colour } from "./clay";

export type ClayKey = "hero" | "adfontes";

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

/* AD FONTES, season two: a matcha supply chain as five islands in a row, left to right: the tea farm,
   the stone mill, the exporter, the importer, the cafe. They rise out of the paper one by one, the
   trade links between them grow in order, then green packets of tea run down the chain to the cup. */
const LINKS: [number, number, number, number][] = [
  // x, y, z, radius
  [-2.3, 0.18, 0.35, 0.44], [-1.15, -0.1, -0.45, 0.4], [0, 0.16, 0.3, 0.4], [1.15, -0.12, -0.45, 0.4], [2.3, 0.14, 0.35, 0.44],
];
/* on a tall phone screen the same chain zigzags down the page instead, farm at the top, cup at the bottom */
const LINKS_TALL: [number, number, number][] = [[-0.55, 1.75, 0], [0.55, 0.85, -0.2], [-0.55, -0.05, 0.1], [0.55, -0.95, -0.2], [-0.55, -1.85, 0]];
const PACKETS = 9;
function adfontes(kit: Kit): ClayScene {
  const { root, solids, shadows, add, shade } = base(kit);
  const gl = kit.gl;
  const world = new Transform(); world.setParent(root);
  const box = (bx: number, by: number, bz: number, r: number) =>
    geo(gl, (x, y, z) => sd.roundBox(x, y, z, bx, by, bz, r), [-bx - 0.03, -by - 0.03, -bz - 0.03], [bx + 0.03, by + 0.03, bz + 0.03], 0.012);
  const disc = (r: number, h: number) => geo(gl, (x, y, z) => sd.cyl(x, y, z, r - 0.015, h - 0.015) - 0.015, [-r - 0.03, -h - 0.03, -r - 0.03], [r + 0.03, h + 0.03, r + 0.03], 0.012);
  const crate = box(0.09, 0.07, 0.09, 0.016);

  const isles = LINKS.map(([, , , r], i) => {
    const g = new Transform(); g.setParent(world);
    const h = r * 0.5;
    add(kit.wrap(geo(gl, (x, y, z) => sd.cyl(x, y, z, r - 0.04, 0.035) - 0.04, [-r - 0.05, -0.1, -r - 0.05], [r + 0.05, 0.1, r + 0.05], 0.02), C.lemon, g));
    add(kit.wrap(geo(gl, (x, y, z) => sd.cappedCone(x, y + 0.06 + h, z, h, r * 0.14, r * 0.9) - 0.02, [-r, -0.12 - 2 * h, -r], [r, 0.0, r], 0.02), C.orange, g));
    const top = new Transform(); top.setParent(g); top.position.y = 0.075; top.scale.set(1.35, 1.35, 1.35);
    if (i === 0) {
      // the farm: rows of shaded tea bushes
      for (let row = 0; row < 3; row++) for (let k = 0; k < 3; k++) {
        const b = add(kit.sphere(C.matcha, top));
        b.position.set(-0.2 + 0.2 * k, 0.06, -0.18 + 0.18 * row);
        b.scale.set(0.085, 0.065, 0.075);
      }
    } else if (i === 1) {
      // the stone mill: two granite stones and the handle that turns the top one
      add(kit.wrap(disc(0.2, 0.06), C.cream, top)).position.set(0, 0.06, 0);
      const upper = add(kit.wrap(disc(0.17, 0.055), C.cream, top)); upper.position.set(0, 0.18, 0);
      const handle = add(kit.rod(C.ink, top)); stretch(handle, [0.12, 0.2, 0], [0.12, 0.38, 0], 0.025);
    } else if (i === 2) {
      // the exporter: crates stacked for the ship
      for (const [x, y, z] of [[-0.1, 0.07, 0.05], [0.1, 0.07, 0.05], [0, 0.07, -0.13], [0, 0.21, -0.02]]) {
        add(kit.wrap(crate, C.cream, top)).position.set(x, y, z);
      }
    } else if (i === 3) {
      // the importer: a warehouse with a cobalt roof
      add(kit.wrap(box(0.2, 0.1, 0.14, 0.02), C.cream, top)).position.set(0, 0.1, 0);
      add(kit.wrap(box(0.22, 0.03, 0.16, 0.012), C.cobalt, top)).position.set(0, 0.23, 0);
    } else {
      // the cafe: a cup of matcha on its saucer
      add(kit.wrap(disc(0.2, 0.02), C.cream, top)).position.set(0, 0.02, 0);
      add(kit.wrap(geo(gl, (x, y, z) => sd.cappedCone(x, y, z, 0.11, 0.1, 0.15) - 0.012, [-0.18, -0.14, -0.18], [0.18, 0.14, 0.18], 0.012), C.cobalt, top)).position.set(0, 0.15, 0);
      add(kit.wrap(disc(0.14, 0.012), C.matcha, top)).position.set(0, 0.264, 0);
    }
    const s = shade(world);
    return { g, s };
  });
  // the links: an arc of six rods from each island to the next
  const SEGS = 6;
  const links = LINKS.slice(1).map(() => Array.from({ length: SEGS }, () => add(kit.rod(C.cobalt, world))));
  const packets = Array.from({ length: PACKETS }, () => add(kit.sphere(C.matcha, world)));

  let tall = false;
  /** point on the arc from island i to i+1, f in 0..1 */
  const arc = (tops: number[][], i: number, f: number) => {
    // from the rim of one island to the facing rim of the next, bowed upward
    const a = tops[i], b = tops[i + 1];
    const dir = Math.sign(b[0] - a[0]) || 1;
    const ax = a[0] + dir * LINKS[i][3] * 0.8, bx = b[0] - dir * LINKS[i + 1][3] * 0.8;
    return [mix(ax, bx, f), mix(a[1] - 0.06, b[1] - 0.06, f) + 0.34 * Math.sin(Math.PI * f), mix(a[2], b[2], f)];
  };

  return {
    root, solids, shadows, clipY: -100,
    // the chain is wide: a squarer screen steps back; a tall one gets the zigzag (read by the next update)
    cam: (aspect, icon) => {
      if (icon) return { pos: [0, 2.6, 6.2], target: [0, 0.05, 0] };
      tall = aspect < 1;
      return tall ? { pos: [0, 1.4, 6.4], target: [0, -0.05, 0], back: 0.95 } : { pos: [0, 2.2, 5.7], target: [0, 0.15, 0], back: aspect < 1.4 ? 1.45 : 1 };
    },
    update(p, t, _intro, icon) {
      const P = icon ? 1 : p;
      const zig = tall && !icon;
      world.rotation.y = icon ? -t * 0.3 : 0.12 * Math.sin(t * 0.22);
      const tops: number[][] = [];
      LINKS.forEach(([wx, wy, wz, r], i) => {
        const [x, y, z] = zig ? LINKS_TALL[i] : [wx, wy, wz];
        const a = ease(smooth(0.02 + i * 0.07, 0.24 + i * 0.07, P));
        // each island grows up from just under its spot, so it never crosses the type above or below
        const yy = mix(y - 0.8, y, a) + 0.05 * Math.sin(t * 0.8 + i * 1.7);
        isles[i].g.position.set(x, yy, z);
        isles[i].g.scale.set(a, a, a);
        isles[i].g.visible = a > 0.001;
        tops.push([x, yy + 0.16, z]);
        // a faint shadow just under each island, inside the open band, so it never smudges the copy
        isles[i].s.position.set(x, -1.0, z);
        isles[i].s.scale.set(r * 2.2, r * 2.2, 1);
        isles[i].s.program.uniforms.uOpacity.value = zig ? 0 : 0.14 * a;
      });
      // links grow in order, farm to cup
      const grown: number[] = [];
      links.forEach((segs, i) => {
        const g = ease(smooth(0.46 + i * 0.06, 0.6 + i * 0.06, P));
        grown.push(g);
        segs.forEach((m, k) => {
          const f0 = k / SEGS, f1 = Math.min(g, (k + 1) / SEGS);
          if (f1 <= f0) { stretch(m, [0, 0, 0], [0, 0, 0], 0); return; }
          stretch(m, arc(tops, i, f0), arc(tops, i, f1), 0.024);
        });
      });
      // once the chain is whole, packets of tea run down it to the cup
      const flow = ease(smooth(0.68, 0.78, P));
      packets.forEach((m, k) => {
        const u = ((t * 0.09 + k / PACKETS) % 1) * 4;
        const i = Math.min(3, Math.floor(u));
        const q = arc(tops, i, u - i);
        m.position.set(q[0], q[1], q[2]);
        const s = 0.065 * flow * (grown[i] > 0.999 ? 1 : 0);
        m.scale.set(s, s, s);
        m.visible = s > 0.001;
      });
    },
  };
}

export const BUILDERS: Record<ClayKey, (kit: Kit) => ClayScene> = { hero, adfontes };
export type { Mesh };
