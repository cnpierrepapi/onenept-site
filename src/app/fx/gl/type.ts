// Full-frame kinetic type. A sequence is a run of frames: one colour field and either two lines of giant
// type (one along the top edge, one along the bottom, on opposite sides) or one glyph filling the screen.
// The clay object lives in the open band between the lines, so it never covers the words.
// Each frame is painted once into a 2D canvas and used as a texture behind the scene. The cut between
// frames is the flash; the stage allows one cut per 340 ms (three a second, WCAG 2.3.1).
import { Mesh, Program, Texture, Triangle, type OGLRenderingContext } from "ogl";

export type Frame = { top?: string; bottom?: string; glyph?: string; bg: string; fg: string };

export const FIELD: Record<string, string> = {
  paper: "#FFF8EE", ink: "#15120F", orange: "#FF6B2C", cobalt: "#2F5BFF", lemon: "#FFE14D", red: "#E8402B",
};

/** The open band in the middle of a two-line frame, as fractions of the slot height (top, bottom). */
export const BAND = { wide: [0.33, 0.67], tall: [0.3, 0.7] } as const;

function displayFont() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim();
  return v || "'Bricolage Grotesque', sans-serif";
}

type Ctx = CanvasRenderingContext2D & { letterSpacing?: string };

/** Largest size at which `text` fits in w x h (cap height measured, not the em box). */
function fit(x: Ctx, font: string, text: string, w: number, h: number) {
  x.font = `800 100px ${font}`;
  x.letterSpacing = "-5px";
  const m = x.measureText(text);
  const cap = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || 72;
  return Math.min((w / m.width) * 100, (h / cap) * 100);
}

function line(x: Ctx, font: string, text: string, size: number, ax: "left" | "right" | "center", px: number, cy: number) {
  x.font = `800 ${size}px ${font}`;
  x.letterSpacing = `${-0.05 * size}px`;
  x.textAlign = ax;
  x.textBaseline = "alphabetic";
  const m = x.measureText(text);
  const asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
  x.fillText(text, px, cy + (asc - desc) / 2);
}

/** Paint one frame at w x h device pixels. navPx keeps the top line clear of the nav. */
export function paintFrame(c: HTMLCanvasElement, f: Frame, w: number, h: number, navPx = 72) {
  c.width = Math.max(2, Math.round(w));
  c.height = Math.max(2, Math.round(h));
  const x = c.getContext("2d") as Ctx;
  x.fillStyle = FIELD[f.bg] ?? f.bg;
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = FIELD[f.fg] ?? f.fg;
  const font = displayFont();
  const W = c.width, H = c.height;
  const pad = Math.round(Math.min(W, H) * 0.035);
  if (f.glyph) {
    const s = fit(x, font, f.glyph, W * 0.92, H * 0.78);
    line(x, font, f.glyph, s, "center", W / 2, H / 2);
    return;
  }
  const wide = W / H >= 1;
  const [b0, b1] = wide ? BAND.wide : BAND.tall;
  const topBox = [Math.max(navPx, pad), H * b0 - pad];
  const botBox = [H * b1 + pad, H - pad];
  if (f.top) {
    const s = fit(x, font, f.top, W - 2 * pad, topBox[1] - topBox[0]);
    line(x, font, f.top, s, wide ? "left" : "center", wide ? pad : W / 2, (topBox[0] + topBox[1]) / 2);
  }
  if (f.bottom) {
    const s = fit(x, font, f.bottom, W - 2 * pad, botBox[1] - botBox[0]);
    line(x, font, f.bottom, s, wide ? "right" : "center", wide ? W - pad : W / 2, (botBox[0] + botBox[1]) / 2);
  }
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
  cut(f: Frame, i: number, w: number, h: number, now: number, navPx: number, counted = true) {
    // every real cut is a flash: recorded so the browser tests can hold it to three a second
    if (counted) ((window as unknown as { __cuts?: number[] }).__cuts ??= []).push(now);
    [this.ca, this.cb] = [this.cb, this.ca];
    this.a.image = this.ca;
    this.a.needsUpdate = true;
    paintFrame(this.cb, f, w, h, navPx);
    this.b.image = this.cb;
    this.b.needsUpdate = true;
    this.shown = i;
    this.lastCut = now;
    this.fadeFrom = now;
  }
}
