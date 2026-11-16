// Turns a signed distance function into a triangle mesh with surface nets: one vertex per grid cell the
// surface passes through (the average of its edge crossings), one quad per grid edge the surface crosses.
// Normals come from the distance field's gradient, so they point outward without caring about winding.
// Runs once per shape at load; every frame after that is plain rasterising. Tested in tests/mesh.test.ts.

export type SDF = (x: number, y: number, z: number) => number;
export type MeshData = { position: Float32Array; normal: Float32Array; index: Uint32Array | Uint16Array };

const CORNERS = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
  [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
];
const EDGES = [
  [0, 1], [2, 3], [4, 5], [6, 7],
  [0, 2], [1, 3], [4, 6], [5, 7],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

export function meshSDF(f: SDF, min: [number, number, number], max: [number, number, number], step: number): MeshData {
  const nx = Math.max(2, Math.ceil((max[0] - min[0]) / step) + 1);
  const ny = Math.max(2, Math.ceil((max[1] - min[1]) / step) + 1);
  const nz = Math.max(2, Math.ceil((max[2] - min[2]) / step) + 1);
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  const v = new Float32Array(nx * ny * nz);
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) v[at(i, j, k)] = f(min[0] + i * step, min[1] + j * step, min[2] + k * step);

  const cx = nx - 1, cy = ny - 1, cz = nz - 1;
  const cell = new Int32Array(cx * cy * cz).fill(-1);
  const cat = (i: number, j: number, k: number) => i + cx * (j + cy * k);
  const pos: number[] = [], nor: number[] = [];
  const h = step * 0.5;
  const corner = new Float32Array(8);

  for (let k = 0; k < cz; k++)
    for (let j = 0; j < cy; j++)
      for (let i = 0; i < cx; i++) {
        let inside = 0;
        for (let c = 0; c < 8; c++) {
          const o = CORNERS[c];
          corner[c] = v[at(i + o[0], j + o[1], k + o[2])];
          if (corner[c] < 0) inside++;
        }
        if (inside === 0 || inside === 8) continue;
        let sx = 0, sy = 0, sz = 0, n = 0;
        for (const [a, b] of EDGES) {
          const va = corner[a], vb = corner[b];
          if (va < 0 === vb < 0) continue;
          const t = va / (va - vb);
          const A = CORNERS[a], B = CORNERS[b];
          sx += A[0] + (B[0] - A[0]) * t;
          sy += A[1] + (B[1] - A[1]) * t;
          sz += A[2] + (B[2] - A[2]) * t;
          n++;
        }
        const px = min[0] + (i + sx / n) * step, py = min[1] + (j + sy / n) * step, pz = min[2] + (k + sz / n) * step;
        let gx = f(px + h, py, pz) - f(px - h, py, pz);
        let gy = f(px, py + h, pz) - f(px, py - h, pz);
        let gz = f(px, py, pz + h) - f(px, py, pz - h);
        const gl = Math.hypot(gx, gy, gz) || 1;
        gx /= gl; gy /= gl; gz /= gl;
        cell[cat(i, j, k)] = pos.length / 3;
        pos.push(px, py, pz);
        nor.push(gx, gy, gz);
      }

  const idx: number[] = [];
  const quad = (a: number, b: number, c: number, d: number) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    idx.push(a, b, c, a, c, d);
  };
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const s = v[at(i, j, k)] < 0;
        if (i < cx && j > 0 && k > 0 && s !== v[at(i + 1, j, k)] < 0)
          quad(cell[cat(i, j - 1, k - 1)], cell[cat(i, j, k - 1)], cell[cat(i, j, k)], cell[cat(i, j - 1, k)]);
        if (j < cy && i > 0 && k > 0 && s !== v[at(i, j + 1, k)] < 0)
          quad(cell[cat(i - 1, j, k - 1)], cell[cat(i, j, k - 1)], cell[cat(i, j, k)], cell[cat(i - 1, j, k)]);
        if (k < cz && i > 0 && j > 0 && s !== v[at(i, j, k + 1)] < 0)
          quad(cell[cat(i - 1, j - 1, k)], cell[cat(i, j - 1, k)], cell[cat(i, j, k)], cell[cat(i - 1, j, k)]);
      }

  const nv = pos.length / 3;
  return {
    position: new Float32Array(pos),
    normal: new Float32Array(nor),
    index: nv > 65535 ? new Uint32Array(idx) : new Uint16Array(idx),
  };
}

/* Distance helpers, the same shapes the clay scenes were first written with. */
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
export const sd = {
  box(x: number, y: number, z: number, bx: number, by: number, bz: number) {
    const qx = Math.abs(x) - bx, qy = Math.abs(y) - by, qz = Math.abs(z) - bz;
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0);
  },
  roundBox(x: number, y: number, z: number, bx: number, by: number, bz: number, r: number) {
    return sd.box(x, y, z, bx - r, by - r, bz - r) - r;
  },
  /** a 2D shape (distance d2) pressed into a slab of half-thickness h with rounded edges */
  slab(d2: number, z: number, h: number) {
    const r = Math.min(0.035, h * 0.6);
    const wx = d2 + r, wy = Math.abs(z) - (h - r);
    return Math.min(Math.max(wx, wy), 0) + Math.hypot(Math.max(wx, 0), Math.max(wy, 0)) - r;
  },
  halfDisc(x: number, y: number, r: number, side: 1 | -1) {
    return Math.max(Math.hypot(x, y) - r, -side * y);
  },
  /** equilateral triangle pointing down */
  tri(x: number, y: number, s: number) {
    const k = Math.sqrt(3);
    let px = Math.abs(x) - s, py = -y + s / k;
    if (px + k * py > 0) { const nx = (px - k * py) / 2, ny = (-k * px - py) / 2; px = nx; py = ny; }
    px -= clamp(px, -2 * s, 0);
    return -Math.hypot(px, py) * Math.sign(py);
  },
  /** the onenept door: ring 0.52..1.0 with an arched doorway through the bottom of the band */
  door(x: number, y: number) {
    const r = Math.hypot(x, y);
    const ring = Math.max(r - 1, 0.52 - r);
    const qx = x, qy = y + 0.78;
    const hole = Math.min(Math.max(Math.abs(qx) - 0.18, qy), Math.hypot(qx, qy) - 0.18);
    return Math.max(ring, -hole);
  },
  cyl(x: number, y: number, z: number, r: number, h: number) {
    const dx = Math.hypot(x, z) - r, dy = Math.abs(y) - h;
    return Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  },
  /** cone along y: radius r1 at -h, r2 at +h */
  cappedCone(x: number, y: number, z: number, h: number, r1: number, r2: number) {
    const qx = Math.hypot(x, z), qy = y;
    const k1x = r2, k1y = h, k2x = r2 - r1, k2y = 2 * h;
    const cax = qx - Math.min(qx, qy < 0 ? r1 : r2), cay = Math.abs(qy) - h;
    const t = clamp(((k1x - qx) * k2x + (k1y - qy) * k2y) / (k2x * k2x + k2y * k2y), 0, 1);
    const cbx = qx - k1x + k2x * t, cby = qy - k1y + k2y * t;
    const s = cbx < 0 && cay < 0 ? -1 : 1;
    return s * Math.sqrt(Math.min(cax * cax + cay * cay, cbx * cbx + cby * cby));
  },
};
