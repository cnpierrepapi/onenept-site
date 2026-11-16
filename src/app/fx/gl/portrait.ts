// The founder portrait: founder.jpg sampled into a grid of dots in three clay colours (ink for the
// shadows, orange for the mid-tones, lemon for the light). Dots start scattered and gather into the face
// as the intro plays and the page scrolls.

export const PORTRAIT_VERT = /* glsl */ `
attribute vec3 position;   // xy target in -1..1 (image space), z = tone 0..1
attribute vec3 scatter;    // where the dot starts
attribute float seed;
uniform float uGather;     // 0 scattered .. 1 assembled
uniform float uT;
uniform vec2 uAspect;      // fit the image into the slot
uniform float uSize;
varying float vTone;
void main() {
  float g = clamp(uGather * 1.25 - seed * 0.25, 0.0, 1.0);
  g = g * g * (3.0 - 2.0 * g);
  vec2 target = position.xy + vec2(sin(uT * 0.9 + seed * 40.0), cos(uT * 0.8 + seed * 31.0)) * 0.004;
  vec2 p = mix(scatter.xy, target, g);
  vTone = position.z;
  gl_Position = vec4(p * uAspect, 0.0, 1.0);
  gl_PointSize = uSize * mix(1.0, 0.72, position.z) * mix(1.6, 1.0, g);
}
`;

export const PORTRAIT_FRAG = /* glsl */ `
precision highp float;
varying float vTone;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  vec3 ink = vec3(0.082, 0.071, 0.059), orange = vec3(1.0, 0.42, 0.17), lemon = vec3(1.0, 0.88, 0.30);
  vec3 col = vTone < 0.16 ? ink : (vTone < 0.6 ? orange : lemon);
  // a little clay shading on each dot
  col *= 1.0 - 0.35 * smoothstep(0.1, 0.5, length(c + vec2(0.15, -0.15)));
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Sample the photo into dot data. The grey studio backdrop is dropped (low saturation, mid brightness);
 *  the white shirt and the dark hair stay. Only the top 78% (head and shoulders) is used. */
export async function samplePortrait(src: string, cols = 96, crop = 0.78) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const rows = Math.round((cols * img.height * crop) / img.width);
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.drawImage(img, 0, 0, img.width, img.height * crop, 0, 0, cols, rows);
  const px = x.getImageData(0, 0, cols, rows).data;
  const pos: number[] = [], scatter: number[] = [], seed: number[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 4;
      const R = px[k] / 255, G = px[k + 1] / 255, B = px[k + 2] / 255;
      const lum = 0.2126 * R + 0.7152 * G + 0.0722 * B;
      const mx = Math.max(R, G, B), sat = mx > 0 ? (mx - Math.min(R, G, B)) / mx : 0;
      if (sat < 0.12 && lum > 0.42 && lum < 0.86) continue; // the grey backdrop
      const u = (i / (cols - 1)) * 2 - 1, v = 1 - (j / (rows - 1)) * 2;
      pos.push(u, v, lum);
      const a = Math.random() * Math.PI * 2, rr = 1.4 + Math.random() * 1.8;
      scatter.push(Math.cos(a) * rr, Math.sin(a) * rr, 0);
      seed.push(Math.random());
    }
  }
  return { pos: new Float32Array(pos), scatter: new Float32Array(scatter), seed: new Float32Array(seed), aspect: cols / rows, cols };
}
