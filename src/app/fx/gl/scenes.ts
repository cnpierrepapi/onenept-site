// One clay scene per section. Each supplies floorY(), cam() and map(p) -> (distance, material id).
// Material ids are in common.ts: 1 orange, 2 cobalt, 3 lemon, 4 ink, 5 cream, 6 red, 7 screen, 8 lightning.
// uP is the scroll progress through the scene's track; each scene tells its story along it.

// The onenept door: a thick ring with an arched doorway cut through the bottom of the band.
const DOOR = /* glsl */ `
float door2(vec2 p) {
  float r = length(p);
  float d = max(r - 1.0, 0.52 - r);
  vec2 q = p - vec2(0.0, -0.78);
  float hole = min(max(abs(q.x) - 0.18, q.y), length(q) - 0.18);
  return max(d, -hole);
}
`;

/* Hero. A knot of pipes and cables (the plumbing) hangs over the paper. Scroll pulls it down through
   the floor until it is gone, and the orange door rises in its place. */
const hero = /* glsl */ `
${DOOR}
float floorY() { return -1.0; }
void cam(out vec3 ro, out vec3 ta) { ro = vec3(0.0, 1.0, 6.4); ta = vec3(0.0, -0.05, 0.0); }
vec2 map(vec3 p) {
  float sink = ease(smoothstep(0.04, 0.62, uP));
  float drop = -3.6 * sink + (1.0 - ease(uIntro)) * 4.0;
  vec3 q = p - vec3(0.0, 0.45 + drop, 0.0);
  vec2 res = vec2(1e9, 0.0);
  float bound = length(q) - 2.4;
  if (bound > 0.25) res = vec2(bound, 4.0);
  else {
  q.xz = rot(uT * 0.12) * q.xz;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    vec3 r = q + vec3(sin(fi * 2.1) * 0.55, cos(fi * 1.7) * 0.42, sin(fi * 1.3) * 0.45);
    r.yz = rot(fi * 1.13 + uT * 0.18) * r.yz;
    r.xy = rot(fi * 0.71) * r.xy;
    float d = sdTorus(r, vec2(0.62 + 0.18 * sin(fi * 1.9), 0.075 + 0.02 * mod(fi, 2.0)));
    res = U(res, vec2(d, 2.0 + mod(fi, 4.0)));
  }
  // straight runs with elbows, like conduit
  vec3 a = vec3(-1.5, 0.9, 0.2), b = vec3(-0.4, 0.1, 0.5), c = vec3(0.5, 0.75, -0.3), d2 = vec3(1.5, -0.2, 0.2);
  res = U(res, vec2(min(sdCapsule(q, a, b, 0.07), min(sdCapsule(q, b, c, 0.07), sdCapsule(q, c, d2, 0.07))), 4.0));
  res = U(res, vec2(sdCapsule(q, vec3(-1.2, -0.6, -0.4), vec3(1.1, 0.95, 0.6), 0.055), 3.0));
  }
  // the door
  float rise = ease(smoothstep(0.5, 0.92, uP));
  vec3 dp = p - vec3(0.0, mix(-2.3, -0.18, rise), 0.0);
  float db = length(dp) - 1.05;
  if (db > 0.25) return U(res, vec2(db, 1.0));
  dp.xz = rot(0.35 * (1.0 - rise) + 0.12 * sin(uT * 0.5)) * dp.xz;
  res = U(res, vec2(slab(door2(dp.xy / 0.82) * 0.82, dp.z, 0.14), 1.0));
  return res;
}
`;

/* AD FONTES ("to the sources"). Small islands rise out of the paper one by one; a cobalt spring
   wells up from the middle one; then trade lines run from the spring to every island. */
const adfontes = /* glsl */ `
float floorY() { return -2.3; }
void cam(out vec3 ro, out vec3 ta) {
  if (uIcon > 0.5) { ro = vec3(0.0, 2.6, 6.8); ta = vec3(0.0, 0.0, 0.0); return; }
  ro = vec3(0.0, 2.3, 6.4); ta = vec3(0.0, -0.05, 0.0);
}
vec4 isl(int i) { // xyz centre, radius
  if (i == 0) return vec4(0.0, 0.0, 0.0, 0.62);
  if (i == 1) return vec4(-1.75, 0.35, -0.7, 0.44);
  if (i == 2) return vec4(1.7, 0.22, -0.5, 0.48);
  if (i == 3) return vec4(-1.0, -0.35, 1.05, 0.36);
  return vec4(1.05, -0.28, 1.15, 0.4);
}
vec2 map(vec3 p) {
  float P = uIcon > 0.5 ? 1.0 : uP;
  p.xz = rot(uT * 0.05 + (uIcon > 0.5 ? uT * 0.25 : 0.0)) * p.xz;
  vec2 res = vec2(1e9, 0.0);
  vec3 top0 = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec4 c = isl(i);
    float a = ease(smoothstep(0.02 + fi * 0.07, 0.3 + fi * 0.07, P));
    c.y = mix(-4.5, c.y, a) + 0.06 * sin(uT * 0.8 + fi * 1.7);
    vec3 q = p - c.xyz;
    float grass = sdCyl(q, c.w - 0.04, 0.035) - 0.04;
    float h = c.w * 0.5;
    float rock = sdCappedCone(q - vec3(0.0, -0.06 - h, 0.0), h, c.w * 0.14, c.w * 0.9) - 0.02;
    res = U(res, vec2(grass, 3.0));
    res = U(res, vec2(rock, 1.0));
    if (i > 0) {
      vec3 hq = q - vec3(c.w * 0.32, 0.15, c.w * 0.12);
      res = U(res, vec2(sdRoundBox(hq, vec3(0.085, 0.075, 0.085), 0.018), 5.0));
      res = U(res, vec2(sdRoundBox(hq - vec3(0.0, 0.1, 0.0), vec3(0.1, 0.03, 0.1), 0.012), 2.0));
    }
    if (i == 0) top0 = c.xyz + vec3(0.0, 0.11, 0.0);
  }
  // the spring
  float well = ease(smoothstep(0.38, 0.55, P));
  for (int k = 0; k < 7; k++) {
    float ph = fract(uT * 0.32 + float(k) / 7.0);
    vec3 b = top0 + vec3(0.06 * sin(float(k) * 2.3 + uT), 0.08 + ph * 1.7 * well, 0.06 * cos(float(k) * 1.7));
    res = U(res, vec2(length(p - b) - 0.15 * (1.0 - ph * 0.75) * well, 2.0));
  }
  // trade lines from the spring's crown to every island
  vec3 crown = top0 + vec3(0.0, 1.25 * well, 0.0);
  for (int i = 1; i < 5; i++) {
    float fi = float(i);
    float g = ease(smoothstep(0.56 + fi * 0.05, 0.72 + fi * 0.05, P));
    if (g > 0.0) {
      vec4 c = isl(i);
      vec3 end = c.xyz + vec3(0.0, 0.12, 0.0);
      res = U(res, vec2(sdCapsule(p, crown, mix(crown, end, g), 0.028), 2.0));
    }
  }
  return res;
}
`;

/* FUGITIVA. A woman's face built from Bauhaus shapes flies together from scattered shards, then a
   red redaction bar slams across the eyes. */
const fugitiva = /* glsl */ `
float floorY() { return -1.42; }
void cam(out vec3 ro, out vec3 ta) {
  if (uIcon > 0.5) { ro = vec3(0.0, 0.25, 5.4); ta = vec3(0.0, -0.1, 0.0); return; }
  ro = vec3(0.0, 0.35, 5.9); ta = vec3(0.0, -0.12, 0.0);
}
float halfDisc(vec2 q, float r, float side) { return max(length(q) - r, -side * q.y); }
float tri(vec2 q, float s) { // pointing down
  q.y = -q.y; const float k = 1.7320508; q.x = abs(q.x) - s; q.y = q.y + s / k;
  if (q.x + k * q.y > 0.0) q = vec2(q.x - k * q.y, -k * q.x - q.y) / 2.0;
  q.x -= clamp(q.x, -2.0 * s, 0.0); return -length(q) * sign(q.y);
}
// move a piece in from its scattered start; returns the local point
vec3 piece(vec3 p, vec2 c, float z, float fi, float P) {
  float a = ease(smoothstep(0.05 + fi * 0.045, 0.34 + fi * 0.045, P));
  vec3 off = vec3(sin(fi * 3.7) * 3.6, cos(fi * 2.3) * 2.6, sin(fi * 1.9) * 2.4) * (1.0 - a);
  vec3 q = p - vec3(c, z) - off;
  q.xy = rot((1.0 - a) * (fi * 1.4 + 0.8)) * q.xy;
  return q;
}
vec2 map(vec3 p) {
  float P = uIcon > 0.5 ? 1.0 : uP;
  p.xz = rot(0.18 * sin(uT * 0.4)) * p.xz;
  vec2 res = vec2(1e9, 0.0);
  vec3 q;
  q = piece(p, vec2(0.0, 0.18), -0.14, 0.0, P); res = U(res, vec2(slab(halfDisc(q.xy, 1.08, 1.0), q.z, 0.07), 4.0));      // hair
  q = piece(p, vec2(0.0, 0.05), 0.0, 1.0, P);   res = U(res, vec2(slab(length(q.xy) - 0.9, q.z, 0.08), 2.0));             // face
  q = piece(p, vec2(-0.33, 0.2), 0.11, 2.0, P); res = U(res, vec2(slab(halfDisc(q.xy, 0.17, -1.0), q.z, 0.05), 4.0));    // eye
  q = piece(p, vec2(0.33, 0.22), 0.11, 3.0, P); res = U(res, vec2(slab(length(q.xy) - 0.15, q.z, 0.05), 3.0));             // eye
  q = piece(p, vec2(0.0, -0.06), 0.11, 4.0, P); res = U(res, vec2(slab(tri(q.xy, 0.15), q.z, 0.05), 1.0));                 // nose
  q = piece(p, vec2(0.0, -0.44), 0.11, 5.0, P); res = U(res, vec2(sdRoundBox(q, vec3(0.3, 0.06, 0.05), 0.03), 5.0));      // mouth
  q = piece(p, vec2(0.0, -1.42), -0.06, 6.0, P); res = U(res, vec2(slab(halfDisc(q.xy, 1.05, 1.0), q.z, 0.09), 1.0));     // shoulders
  q = piece(p, vec2(0.93, -0.28), 0.06, 7.0, P); res = U(res, vec2(length(q) - 0.09, 3.0));                                // earring
  // the redaction bar
  float slam = ease(smoothstep(0.7, 0.8, P));
  vec3 r = p - vec3(mix(-6.0, 0.0, slam), 0.22, 0.24);
  r.xy = rot(-0.06) * r.xy;
  res = U(res, vec2(sdRoundBox(r, vec3(1.45, 0.14, 0.05), 0.025), 6.0));
  return res;
}
`;

/* Melax. A button phone spins in, its keys press # 2 5 8 0 # in step with the scroll, its screen lights,
   then a lightning bolt cracks out of the top (melax is Wolof for lightning). */
const melax = /* glsl */ `
float floorY() { return -1.62; }
void cam(out vec3 ro, out vec3 ta) {
  if (uIcon > 0.5) { ro = vec3(0.0, 0.3, 5.0); ta = vec3(0.0, -0.05, 0.0); return; }
  ro = vec3(0.0, 0.45, 6.4); ta = vec3(0.0, 0.25, 0.0);
}
float bump(float t, float P) { return smoothstep(t - 0.025, t, P) * (1.0 - smoothstep(t + 0.02, t + 0.05, P)); }
// keys pressed in order: # 2 5 8 0 #  (key index = row * 3 + column)
float pressOf(float k, float P) {
  if (k > 10.5) return max(bump(0.34, P), bump(0.665, P));
  if (abs(k - 1.0) < 0.5) return bump(0.405, P);
  if (abs(k - 4.0) < 0.5) return bump(0.47, P);
  if (abs(k - 7.0) < 0.5) return bump(0.535, P);
  if (abs(k - 10.0) < 0.5) return bump(0.6, P);
  return 0.0;
}
vec2 map(vec3 p) {
  float P = uIcon > 0.5 ? 0.62 : uP;
  float fly = ease(smoothstep(0.0, 0.24, P));
  vec3 q = p - vec3(mix(3.0, 0.0, fly), mix(2.6, 0.0, fly), mix(-6.0, 0.0, fly));
  q.xz = rot(mix(3.4, 0.42, fly) + (uIcon > 0.5 ? 0.45 * sin(uT * 0.7) : 0.1 * sin(uT * 0.6))) * q.xz; // the icon rocks, facing you
  q.yz = rot(-0.1) * q.yz;
  vec2 res = vec2(1e9, 0.0);
  float pb = sdBox(q, vec3(0.75, 1.42, 0.32));
  if (pb > 0.3) res = vec2(pb, 3.0);
  else {
  float body = sdRoundBox(q, vec3(0.62, 1.28, 0.14), 0.11);
  vec3 sq = q - vec3(0.0, 0.62, 0.14);
  body = max(body, -sdRoundBox(sq, vec3(0.5, 0.38, 0.05), 0.04));
  res = U(res, vec2(body, 3.0));
  float lit = ease(smoothstep(0.26, 0.32, P));
  res = U(res, vec2(sdRoundBox(sq + vec3(0.0, 0.0, 0.035), vec3(0.47, 0.35, 0.01), 0.02), mix(4.0, 7.0, step(0.5, lit))));
  if (sdBox(q - vec3(0.0, -0.39, 0.15), vec3(0.5, 0.48, 0.1)) < 0.05) {
  for (int r = 0; r < 4; r++) {
    for (int c = 0; c < 3; c++) {
      float k = float(r * 3 + c);
      float press = pressOf(k, P);
      vec3 kq = q - vec3(-0.32 + 0.32 * float(c), 0.02 - 0.27 * float(r), 0.15 - 0.045 * press);
      res = U(res, vec2(sdRoundBox(kq, vec3(0.12, 0.075, 0.045), 0.03), press > 0.3 ? 1.0 : 4.0));
    }
  }
  }
  }
  // the lightning bolt
  float g = ease(smoothstep(0.8, 0.9, P)) * (1.0 - smoothstep(0.97, 1.0, P));
  if (g > 0.0) {
    vec3 a = vec3(0.0, 1.45, 0.0);
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      vec3 b = vec3((mod(fi, 2.0) * 2.0 - 1.0) * (0.28 + 0.1 * hash(fi + floor(uT * 8.0))), 1.45 + (fi + 1.0) * 0.55, 0.0);
      b = mix(a, b, clamp(g * 6.0 - fi, 0.0, 1.0));
      res = U(res, vec2(sdCapsule(p, a, b, 0.06), 8.0));
      a = b;
    }
  }
  return res;
}
`;

/* Merged upstream. A trunk line with four branches; each one grows out, runs along and merges back in,
   and its merge node turns orange. The DOM cards use the same thresholds (MERGE_AT below). */
const merge = /* glsl */ `
float floorY() { return -0.9; }
void cam(out vec3 ro, out vec3 ta) {
  float back = max(1.0, 2.7 / (uRes.x / uRes.y));
  ta = vec3(0.0, 0.35, 0.0);
  ro = ta + (vec3(0.0, 3.0, 6.6) - ta) * back;
}
vec3 node(int i, int k, float side) {
  float s = -3.3 + float(i) * 1.75, e = s + 1.35;
  float hy = 0.85, z = 0.38 * side;
  if (k == 0) return vec3(s, 0.0, 0.0);
  if (k == 1) return vec3(s + 0.32, hy, z);
  if (k == 2) return vec3(e - 0.32, hy, z);
  return vec3(e, 0.0, 0.0);
}
vec2 map(vec3 p) {
  vec2 res = vec2(sdCapsule(p, vec3(-4.4, 0.0, 0.0), vec3(4.4, 0.0, 0.0), 0.08), 4.0);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float side = mod(fi, 2.0) * 2.0 - 1.0;
    float g = smoothstep(0.08 + fi * 0.2, 0.26 + fi * 0.2, uP);
    float m = fi < 0.5 ? 2.0 : (fi < 1.5 ? 3.0 : (fi < 2.5 ? 1.0 : 2.0));
    if (g > 0.0) {
      for (int k = 0; k < 3; k++) {
        float seg = clamp(g * 3.0 - float(k), 0.0, 1.0);
        if (seg > 0.0) {
          vec3 a = node(i, k, side), b = node(i, k + 1, side);
          res = U(res, vec2(sdCapsule(p, a, mix(a, b, seg), 0.07), m));
        }
      }
    }
    res = U(res, vec2(length(p - node(i, 0, side)) - 0.13, 5.0));
    res = U(res, vec2(length(p - node(i, 3, side)) - 0.15 * (0.6 + 0.4 * step(0.999, g)), g > 0.999 ? 1.0 : 5.0));
  }
  return res;
}
`;

export const SCENES = { hero, adfontes, fugitiva, melax, merge } as const;
export type ClayKey = keyof typeof SCENES;

/** Where each branch finishes merging (uP). The PR cards appear at these points. */
export const MERGE_AT = [0.26, 0.46, 0.66, 0.86];
