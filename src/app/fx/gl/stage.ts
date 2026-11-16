// One WebGL canvas for the whole site. Sections put a <GLSlot> where a scene should appear; every frame
// the stage finds the slots on screen and draws each scene into its slot's rectangle (viewport +
// scissor), so there is one GL context however many scenes the page has. Behind the content, never
// in the way of the pointer. No WebGL: html gets .gl-off and every slot shows a still instead.
import { Renderer, Program, Mesh, Triangle, Geometry } from "ogl";
import { HEAD, MAIN, VERT } from "./common";
import { SCENES, type ClayKey } from "./scenes";
import { PORTRAIT_FRAG, PORTRAIT_VERT, samplePortrait } from "./portrait";

export type SceneKey = ClayKey | "portrait";

type Slot = { el: HTMLElement; key: SceneKey; icon: boolean; shift: number; shiftNarrow: number };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Scroll progress through the nearest [data-track]: 0 as its top reaches the top of the screen,
 *  1 once its bottom reaches the bottom. Sticky scenes live inside tracks. */
export function trackProgress(el: Element): number {
  const track = el.closest<HTMLElement>("[data-track]");
  if (!track) return 1;
  const r = track.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span <= 0 ? 1 : clamp01(-r.top / span);
}

class Stage {
  renderer: Renderer | null = null;
  gl: Renderer["gl"] | null = null;
  slots = new Set<Slot>();
  clay = new Map<ClayKey, Mesh>();
  portrait: { mesh: Mesh; aspect: number; gather: number } | null = null;
  private portraitLoading = false;
  intro = 0;
  quality = 1;
  /** false behind the gate and loader: nothing is drawn until the iris opens */
  active = false;
  frameMs = 0;
  ok = false;
  private slow = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;

  init(canvas: HTMLCanvasElement) {
    if (this.renderer) return this.ok;
    // 16 Nov: the raymarched scenes ran at ~2 fps on a real laptop GPU. Live 3D stays off (stills show
    // instead) until the rasterised rebuild lands. ?live3d turns it on for testing.
    if (!location.search.includes("live3d")) {
      this.ok = false;
      document.documentElement.classList.add("gl-off");
      return false;
    }
    try {
      // Clay is soft and all text is HTML, so the 3D draws below screen resolution.
      this.dpr = matchMedia("(pointer: coarse)").matches ? 0.7 : 0.8;
      this.renderer = new Renderer({ canvas, dpr: this.dpr, alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "high-performance", preserveDrawingBuffer: location.search.includes("stills") });
      this.gl = this.renderer.gl;
      this.ok = !!this.gl;
    } catch {
      this.ok = false;
    }
    if (!this.ok) document.documentElement.classList.add("gl-off");
    return this.ok;
  }

  /** Build every clay program now, one per animation frame, reporting progress (the loader uses this). */
  async compileAll(onStep: (done: number, total: number) => void) {
    const keys = Object.keys(SCENES) as ClayKey[];
    for (let i = 0; i < keys.length; i++) {
      if (this.ok) this.mesh(keys[i]);
      onStep(i + 1, keys.length);
      await new Promise((r) => requestAnimationFrame(r));
    }
  }

  private mesh(key: ClayKey) {
    let m = this.clay.get(key);
    if (m || !this.gl) return m;
    const gl = this.gl;
    const program = new Program(gl, {
      vertex: VERT,
      fragment: `${HEAD}\nvarying vec2 vUv;\n${SCENES[key]}\n${MAIN}`,
      uniforms: { uRes: { value: [1, 1] }, uP: { value: 0 }, uT: { value: 0 }, uIntro: { value: 0 }, uIcon: { value: 0 }, uShift: { value: 0 }, uQ: { value: 1 } },
      depthTest: false,
      depthWrite: false,
    });
    m = new Mesh(gl, { geometry: new Triangle(gl), program });
    this.clay.set(key, m);
    return m;
  }

  async loadPortrait(src: string) {
    if (!this.gl || this.portrait || this.portraitLoading) return;
    this.portraitLoading = true;
    const gl = this.gl;
    const d = await samplePortrait(src);
    const geometry = new Geometry(gl, {
      position: { size: 3, data: d.pos },
      scatter: { size: 3, data: d.scatter },
      seed: { size: 1, data: d.seed },
    });
    const program = new Program(gl, {
      vertex: PORTRAIT_VERT,
      fragment: PORTRAIT_FRAG,
      uniforms: { uGather: { value: 0 }, uT: { value: 0 }, uAspect: { value: [1, 1] }, uSize: { value: 4 } },
      depthTest: false,
      depthWrite: false,
    });
    this.portrait = { mesh: new Mesh(gl, { geometry, program, mode: gl.POINTS }), aspect: d.aspect, gather: 0 };
  }

  add(el: HTMLElement, key: SceneKey, opts: { icon?: boolean; shift?: number; shiftNarrow?: number } = {}) {
    const s: Slot = { el, key, icon: !!opts.icon, shift: opts.shift ?? 0, shiftNarrow: opts.shiftNarrow ?? 0 };
    this.slots.add(s);
    return () => { this.slots.delete(s); };
  }

  /** Called every frame from the GSAP ticker, after Lenis has moved the page. */
  render(time: number, dt: number) {
    const r = this.renderer, gl = this.gl;
    if (!r || !gl) return;
    this.frameMs += (dt - this.frameMs) * 0.05;
    (window as unknown as { __glms: number }).__glms = this.frameMs;
    const W = window.innerWidth, H = window.innerHeight;
    if (W !== this.w || H !== this.h) {
      this.w = W;
      this.h = H;
      r.dpr = this.dpr * this.quality;
      r.setSize(W, H);
    }
    // Slow device: step the resolution down (never up mid-visit, so it doesn't flicker).
    if (dt > 26) this.slow += dt; else this.slow = Math.max(0, this.slow - dt * 0.5);
    if (this.slow > 900 && this.quality > 0.55) {
      this.quality = Math.max(0.55, this.quality - 0.15);
      this.slow = 0;
      r.dpr = this.dpr * this.quality;
      r.setSize(W, H);
    }
    const D = r.dpr;
    gl.disable(gl.SCISSOR_TEST);
    // paper colour at zero alpha: when the browser scales the canvas up, slot edges blend
    // toward paper instead of toward black (that drew a dark hairline round every scene)
    gl.clearColor(1, 0.973, 0.933, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.active) return;
    gl.enable(gl.SCISSOR_TEST);
    for (const s of this.slots) {
      const b = s.el.getBoundingClientRect();
      if (b.bottom <= 0 || b.top >= H || b.width < 2 || b.height < 2) continue;
      const x = b.left * D, y = (H - b.bottom) * D, w = b.width * D, h = b.height * D;
      const cx = Math.max(0, b.left) * D, cy = Math.max(0, H - b.bottom) * D;
      const cw = (Math.min(W, b.right) - Math.max(0, b.left)) * D, ch = (Math.min(H, b.bottom) - Math.max(0, b.top)) * D;
      gl.viewport(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
      gl.scissor(Math.round(cx), Math.round(cy), Math.ceil(cw), Math.ceil(ch));
      const p = s.icon ? 1 : trackProgress(s.el);
      if (s.key === "portrait") {
        if (!this.portrait) { void this.loadPortrait("/founder.jpg"); continue; }
        gl.clearColor(1, 0.973, 0.933, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const u = this.portrait.mesh.program.uniforms;
        const slotAspect = b.width / b.height, imgAspect = this.portrait.aspect;
        const fit = 0.92;
        u.uAspect.value = slotAspect > imgAspect ? [(imgAspect / slotAspect) * fit, fit] : [fit, (slotAspect / imgAspect) * fit];
        this.portrait.gather += (Math.min(1, this.intro * 0.6 + p * 1.6) - this.portrait.gather) * 0.08;
        u.uGather.value = this.portrait.gather;
        u.uT.value = time;
        u.uSize.value = Math.max(2, ((b.height * D) / 132) * 1.05);
        this.portrait.mesh.draw();
        continue;
      }
      const m = this.mesh(s.key);
      if (!m) continue;
      const u = m.program.uniforms;
      u.uRes.value = [w, h];
      u.uP.value = p;
      u.uT.value = time;
      u.uIntro.value = this.intro;
      u.uIcon.value = s.icon ? 1 : 0;
      // side-by-side layouts start at the md breakpoint; below it the subject stays centred
      u.uShift.value = W >= 768 ? s.shift : s.shiftNarrow;
      u.uQ.value = s.icon ? 0.6 : this.quality;
      m.draw();
    }
    gl.disable(gl.SCISSOR_TEST);
  }
}

export const stage = new Stage();
