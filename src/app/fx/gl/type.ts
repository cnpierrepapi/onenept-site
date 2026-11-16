// Full-frame kinetic type. A sequence is a run of frames: one colour field, one or two giant words.
// Each frame is drawn once into a 2D canvas and used as a texture behind the clay scene, so the 3D object
// passes in front of the letters. The cut between frames is the flash; the stage allows one cut per
// 340 ms at most (three a second, WCAG 2.3.1), so a fast scroll plays the cuts out on the beat instead.
import { Mesh, Program, Texture, Triangle, type OGLRenderingContext } from "ogl";

export type Frame = { word: string; bg: string; fg: string };

export const FIELD: Record<string, string> = {
  paper: "#FFF8EE", ink: "#15120F", orange: "#FF6B2C", cobalt: "#2F5BFF", lemon: "#FFE14D", red: "#E8402B",
};

function displayFont() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim();
  return v || "'Bricolage Grotesque', sans-serif";
}

/** Paint one frame: the field, then the word as large as it fits (one line, or stacked on narrow screens). */
export function paintFrame(c: HTMLCanvasElement, f: Frame, w: number, h: number) {
  c.width = Math.max(2, Math.round(w));
  c.height = Math.max(2, Math.round(h));
  const x = c.getContext("2d")!;
  x.fillStyle = FIELD[f.bg] ?? f.bg;
  x.fillRect(0, 0, c.width, c.height);
  if (!f.word) return;
  const font = displayFont();
  const words = f.word.split(" ");
  const lines = c.width / c.height < 1.1 && words.length > 1 ? words : [f.word];
  x.font = `800 100px ${font}`;
  const widest = Math.max(...lines.map((l) => x.measureText(l).width));
  const lineH = 0.86;
  let size = (c.width * 0.9) / widest * 100;
  size = Math.min(size, (c.height * 0.72) / (lines.length * lineH));
  x.font = `800 ${size}px ${font}`;
  x.fillStyle = FIELD[f.fg] ?? f.fg;
  x.textAlign = "center";
  x.textBaseline = "middle";
  // tight tracking, like the display type on the rest of the site
  try { (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-0.05 * size}px`; } catch {}
  const total = lines.length * size * lineH;
  lines.forEach((l, i) => x.fillText(l, c.width / 2, c.height / 2 - total / 2 + size * lineH * (i + 0.5)));
}

const VERT = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;
const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tA;
uniform sampler2D tB;
uniform float uMix;
varying vec2 vUv;
void main() { gl_FragColor = mix(texture2D(tA, vUv), texture2D(tB, vUv), uMix); }
`;

/** Two textures and a quad: the frame on screen, and the one before it for calm-mode fades. */
export class TypeLayer {
  mesh: Mesh;
  a: Texture;
  b: Texture;
  private ca = document.createElement("canvas");
  private cb = document.createElement("canvas");
  shown = -1;
  lastCut = -1e9;
  fadeFrom = 0;
  key = "";
  constructor(gl: OGLRenderingContext) {
    const opts = { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR, flipY: true };
    this.a = new Texture(gl, opts);
    this.b = new Texture(gl, opts);
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: { tA: { value: this.a }, tB: { value: this.b }, uMix: { value: 1 } }, depthTest: false, depthWrite: false, cullFace: false });
    this.mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  }
  /** Cut to frame f (index i). The old frame stays in texture A for a fade. */
  cut(f: Frame, i: number, w: number, h: number, now: number) {
    [this.ca, this.cb] = [this.cb, this.ca];
    this.a.image = this.ca;
    this.a.needsUpdate = true;
    paintFrame(this.cb, f, w, h);
    this.b.image = this.cb;
    this.b.needsUpdate = true;
    this.shown = i;
    this.lastCut = now;
    this.fadeFrom = now;
  }
}
