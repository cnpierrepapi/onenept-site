// Shared GLSL for every clay scene. A scene supplies map(), floorY() and cam(); this file supplies the
// palette, the SDF helpers, the raymarcher and the clay lighting on warm paper.
// GLSL ES 1.00 so it runs on WebGL1 and WebGL2.

export const VERT = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

export const HEAD = /* glsl */ `
precision highp float;
uniform vec2 uRes;      // slot size in device pixels
uniform float uP;       // scroll progress through the scene's track, 0..1
uniform float uT;       // seconds
uniform float uIntro;   // 0..1 once the loader opens
uniform float uIcon;    // 1 = small icon framing in the hero cards
uniform float uShift;   // move the subject sideways (uv units) to make room for text
uniform float uQ;       // quality 0.5..1, fewer steps when the device is slow

// palette in linear light (sRGB hex in the comments)
const vec3 C_PAPER = vec3(1.0, 0.940, 0.859);   // #FFF8EE
const vec3 C_ORANGE = vec3(1.0, 0.147, 0.025);  // #FF6B2C
const vec3 C_COBALT = vec3(0.024, 0.104, 1.0);  // #2F5BFF
const vec3 C_LEMON = vec3(1.0, 0.759, 0.072);   // #FFE14D
const vec3 C_INK = vec3(0.022, 0.018, 0.015);   // #15120F, lifted a touch so clay still shows form
const vec3 C_CREAM = vec3(0.90, 0.82, 0.70);    // a sculpting-clay white
const vec3 C_RED = vec3(0.807, 0.048, 0.020);   // #E8402B

vec3 matCol(float id) {
  if (id < 1.5) return C_ORANGE;
  if (id < 2.5) return C_COBALT;
  if (id < 3.5) return C_LEMON;
  if (id < 4.5) return C_INK;
  if (id < 5.5) return C_CREAM;
  if (id < 6.5) return C_RED;
  if (id < 7.5) return C_COBALT; // 7: a lit screen
  return C_LEMON;                // 8: lightning
}
// 7 and 8 glow on their own
float emissive(float id) { return id > 6.5 ? 1.0 : 0.0; }

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdBox(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
float sdRoundBox(vec3 p, vec3 b, float r) { return sdBox(p, b - r) - r; }
float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdCyl(vec3 p, float r, float h) { vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)); }
float sdRoundCone(vec3 p, float r1, float r2, float h) {
  vec2 q = vec2(length(p.xz), p.y); float b = (r1 - r2) / h; float a = sqrt(1.0 - b * b); float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1; if (k > a * h) return length(q - vec2(0.0, h)) - r2; return dot(q, vec2(a, b)) - r1;
}
float sdCappedCone(vec3 p, float h, float r1, float r2) { // r1 at -h, r2 at +h
  vec2 q = vec2(length(p.xz), p.y);
  vec2 k1 = vec2(r2, h), k2 = vec2(r2 - r1, 2.0 * h);
  vec2 ca = vec2(q.x - min(q.x, (q.y < 0.0) ? r1 : r2), abs(q.y) - h);
  vec2 cb = q - k1 + k2 * clamp(dot(k1 - q, k2) / dot(k2, k2), 0.0, 1.0);
  float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
  return s * sqrt(min(dot(ca, ca), dot(cb, cb)));
}
float extrude(float d2, float z, float h) { vec2 w = vec2(d2, abs(z) - h); return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)); }
// a slab of a 2D shape, rounded at the edges like pressed clay
float slab(float d2, float z, float h) { return extrude(d2 + 0.035, z, h - 0.035) - 0.035; }
float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
vec2 U(vec2 a, vec2 b) { return a.x < b.x ? a : b; }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
float hash(float n) { return fract(sin(n) * 43758.5453); }
`;

export const MAIN = /* glsl */ `
vec2 world(vec3 p) {
  vec2 o = map(p);
  float f = p.y - floorY();
  return f < o.x ? vec2(f, 0.0) : o;
}
vec3 nrm(vec3 p) {
  const vec2 k = vec2(1.0, -1.0); const float e = 0.0015;
  return normalize(k.xyy * world(p + k.xyy * e).x + k.yyx * world(p + k.yyx * e).x + k.yxy * world(p + k.yxy * e).x + k.xxx * world(p + k.xxx * e).x);
}
float shadow(vec3 ro, vec3 rd) {
  float res = 1.0, t = 0.03;
  for (int i = 0; i < 28; i++) {
    if (float(i) > 28.0 * uQ) break;
    float h = map(ro + rd * t).x;
    res = min(res, 8.0 * h / t);
    t += clamp(h, 0.03, 0.3);
    if (res < 0.003 || t > 8.0) break;
  }
  return clamp(res, 0.0, 1.0);
}
float occl(vec3 p, vec3 n) {
  float o = 0.0, s = 1.0;
  for (int i = 1; i <= 3; i++) { float h = 0.06 * float(i); o += (h - world(p + n * h).x) * s; s *= 0.7; }
  return clamp(1.0 - 2.0 * o, 0.0, 1.0);
}
void main() {
  vec2 frag = vUv * uRes;
  float scale = min(uRes.y, uRes.x / 1.25);
  vec2 uv = (frag - 0.5 * uRes) / scale;
  uv.x -= uShift;
  vec3 ro, ta; cam(ro, ta);
  vec3 ww = normalize(ta - ro), uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0))), vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.9 * ww);
  vec3 L = normalize(vec3(-0.55, 0.9, 0.6));
  float t = 0.0; vec2 h = vec2(0.0); bool hit = false;
  for (int i = 0; i < 90; i++) {
    if (float(i) > 90.0 * uQ) break;
    h = world(ro + rd * t);
    if (h.x < 0.0012 * (1.0 + t * 0.15)) { hit = true; break; }
    t += h.x;
    if (t > 40.0) break;
  }
  vec3 col = C_PAPER;
  if (hit) {
    vec3 p = ro + rd * t, n = nrm(p);
    float dif = clamp(dot(n, L) * 0.6 + 0.4, 0.0, 1.0);
    float sh = shadow(p + n * 0.006, L);
    float ao = occl(p, n);
    if (h.y > 0.5) {
      vec3 base = matCol(h.y);
      float fre = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);
      col = base * (0.40 * ao + 0.80 * dif * mix(0.35, 1.0, sh)) + vec3(1.0, 0.82, 0.68) * fre * 0.10;
      col += vec3(1.0, 0.92, 0.82) * pow(clamp(dot(reflect(-L, n), -rd), 0.0, 1.0), 18.0) * 0.07 * sh;
      col = mix(col, base * 1.25 + 0.08, emissive(h.y));
    } else {
      float fade = smoothstep(11.0, 3.5, length(p.xz));
      // only real shadow and contact darken the paper, so the floor matches the page at the slot edge
      vec3 lit = C_PAPER * mix(0.72, 1.0, sh) * mix(0.84, 1.0, ao);
      col = mix(C_PAPER, lit, fade);
    }
  }
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}
`;
