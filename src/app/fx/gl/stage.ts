// One WebGL canvas for the whole site. Sections put a <GLSlot> where a scene should appear; every frame
// the stage finds the slots on screen and draws each scene into its slot's rectangle (viewport +
// scissor), so there is one GL context however many scenes the page has. Behind the content, never
// in the way of the pointer. No WebGL: html gets .gl-off and every slot shows a still instead.
//
// 16 Nov 2026: scenes are rasterised clay meshes (clay.ts, scenes.ts). The first version raymarched every
// pixel and ran at about 2 fps on a laptop GPU.
import { Renderer, Program, Mesh, Geometry, Camera } from "ogl";
import { Kit } from "./clay";
import { BUILDERS, type ClayKey, type ClayScene } from "./scenes";
import { PORTRAIT_FRAG, PORTRAIT_VERT, samplePortrait } from "./portrait";
import { TypeLayer, type Frame } from "./type";

/** "type" is a kinetic-type sequence with no 3D object */
export type SceneKey = ClayKey | "portrait" | "type";
export type { Frame };

type Slot = {
  el: HTMLElement; key: SceneKey; icon: boolean; shift: number; shiftNarrow: number;
  /** kinetic-type sequence: frames cut on the scroll beat, then a rest frame from restFrom on */
  frames?: Frame[]; restFrom: number; type?: TypeLayer; restBg: string;
  /** how far the camera steps back so the object fits the open band between the lines */
  fit: number;
  /** the scene's story position, eased toward where the frames say it should be */
  story: number;
  /** the [data-at] block it lives in, if any: not drawn until that block is in */
  gate: HTMLElement | null;
};

/** one cut per 340 ms at most: three a second, the WCAG flash line */
export const CUT_MS = 340;
/** calm mode: a slow cross-fade, never more than about one a second, so nothing strobes */
export const CALM_CUT_MS = 900;


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

/** Lens: vertical field of view so the scene keeps its framing on wide and narrow slots alike. */
const FOCAL = 1.7;
function fovFor(aspect: number) {
  const half = aspect >= 1.25 ? 0.5 / FOCAL : (0.5 * 1.25) / aspect / FOCAL;
  return (2 * Math.atan(half) * 180) / Math.PI;
}

class Stage {
  renderer: Renderer | null = null;
  gl: Renderer["gl"] | null = null;
  slots = new Set<Slot>();
  scenes = new Map<ClayKey, ClayScene>();
  kit: Kit | null = null;
  camera: Camera | null = null;
  portrait: { mesh: Mesh; aspect: number; gather: number } | null = null;
  private portraitLoading = false;
  intro = 0;
  quality = 1;
  /** the last cut anywhere on the page: the three-a-second limit is page-wide, not per section */
  private lastCut = -1e9;
  /** false behind the gate and loader: nothing is drawn until the iris opens */
  active = false;
  frameMs = 16;
  ok = false;
  private slow = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;

  init(canvas: HTMLCanvasElement) {
    if (this.renderer) return this.ok;
    try {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.renderer = new Renderer({
        canvas, dpr: this.dpr, alpha: true, depth: true, antialias: true, premultipliedAlpha: false,
        powerPreference: "high-performance", preserveDrawingBuffer: location.search.includes("stills"),
      });
      this.gl = this.renderer.gl;
      this.ok = !!this.gl;
      if (this.ok) {
        this.kit = new Kit(this.gl);
        this.camera = new Camera(this.gl, { fov: 30, near: 0.1, far: 80 });
      }
    } catch {
      this.ok = false;
    }
    if (!this.ok) document.documentElement.classList.add("gl-off");
    return this.ok;
  }

  /** Build every scene's meshes now, one per animation frame, reporting progress (the loader uses this). */
  async compileAll(onStep: (done: number, total: number) => void) {
    const keys = Object.keys(BUILDERS) as ClayKey[];
    for (let i = 0; i < keys.length; i++) {
      if (this.ok) this.scene(keys[i]);
      onStep(i + 1, keys.length);
      await new Promise((r) => requestAnimationFrame(r));
    }
  }

  private scene(key: ClayKey) {
    let s = this.scenes.get(key);
    if (s || !this.kit) return s;
    s = BUILDERS[key](this.kit);
    for (const m of s.solids) m.program.uniforms.uClipY.value = s.clipY;
    this.scenes.set(key, s);
    return s;
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

  add(el: HTMLElement, key: SceneKey, opts: { icon?: boolean; shift?: number; shiftNarrow?: number; frames?: Frame[]; restFrom?: number; restBg?: string; fit?: number } = {}) {
    const s: Slot = {
      el, key, icon: !!opts.icon, shift: opts.shift ?? 0, shiftNarrow: opts.shiftNarrow ?? 0, frames: opts.frames,
      restFrom: opts.restFrom ?? 1, restBg: opts.restBg ?? "paper", fit: opts.fit ?? 1, gate: el.closest<HTMLElement>("[data-at]"), story: 0,
    };
    this.slots.add(s);
    return () => { this.slots.delete(s); };
  }

  /** Called every frame from the GSAP ticker, after Lenis has moved the page. */
  render(time: number, dt: number) {
    const r = this.renderer, gl = this.gl, cam = this.camera;
    if (!r || !gl || !cam) return;
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
    if (this.active && dt > 26) this.slow += dt; else this.slow = Math.max(0, this.slow - dt * 0.5);
    if (this.slow > 900 && this.quality > 0.5) {
      this.quality = Math.max(0.5, this.quality - 0.2);
      this.slow = 0;
      r.dpr = this.dpr * this.quality;
      r.setSize(W, H);
    }
    const D = r.dpr;
    gl.disable(gl.SCISSOR_TEST);
    // paper colour at zero alpha: when the browser scales the canvas, slot edges blend toward paper
    gl.clearColor(1, 0.973, 0.933, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!this.active) return;
    gl.enable(gl.SCISSOR_TEST);
    for (const s of this.slots) {
      const b = s.el.getBoundingClientRect();
      if (b.bottom <= 0 || b.top >= H || b.width < 2 || b.height < 2) continue;
      if (s.gate && !s.gate.classList.contains("in")) continue;
      const x = b.left * D, y = (H - b.bottom) * D, w = b.width * D, h = b.height * D;
      const cx = Math.max(0, b.left) * D, cy = Math.max(0, H - b.bottom) * D;
      const cw = (Math.min(W, b.right) - Math.max(0, b.left)) * D, ch = (Math.min(H, b.bottom) - Math.max(0, b.top)) * D;
      gl.viewport(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
      gl.scissor(Math.round(cx), Math.round(cy), Math.ceil(cw), Math.ceil(ch));
      const p = s.icon ? 1 : trackProgress(s.el);
      // kinetic type: the frame behind the scene, cut on the beat
      let frame: { index: number; count: number; bg: string; rest: number } | undefined;
      if (s.frames && s.frames.length) {
        const N = s.frames.length;
        const target = p >= s.restFrom ? N : Math.min(N - 1, Math.floor((p / s.restFrom) * N));
        const now = performance.now();
        if (!s.type) s.type = new TypeLayer(gl);
        const t = s.type, key = `${Math.round(w)}x${Math.round(h)}`;
        const at = (i: number): Frame => (i >= N ? { bg: s.restBg, fg: "ink" } : s.frames![i]);
        const navPx = 76 * D;
        const calm = document.documentElement.dataset.motion === "calm";
        if (t.key !== key) { t.key = key; const i0 = t.shown < 0 ? target : t.shown; t.cut(at(i0), i0, w, h, now - 1e4, navPx, false); }
        else if (target !== t.shown && now - this.lastCut >= (calm ? CALM_CUT_MS : CUT_MS)) {
          const next = t.shown + Math.sign(target - t.shown);
          t.cut(at(next), next, w, h, now, navPx);
          this.lastCut = now;
        }
        t.mesh.program.uniforms.uMix.value = calm ? Math.min(1, (now - t.fadeFrom) / 600) : 1;
        gl.clear(gl.DEPTH_BUFFER_BIT);
        t.mesh.draw();
        frame = { index: t.shown, count: N, bg: at(t.shown).bg, rest: Math.min(1, Math.max(0, (p - s.restFrom) / (1 - s.restFrom || 1))) };
      } else {
        gl.clearColor(1, 0.973, 0.933, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }
      if (s.key === "portrait") {
        if (!this.portrait) { void this.loadPortrait("/founder.jpg"); continue; }
        const u = this.portrait.mesh.program.uniforms;
        const slotAspect = b.width / b.height, imgAspect = this.portrait.aspect;
        const fit = 0.92;
        u.uAspect.value = slotAspect > imgAspect ? [(imgAspect / slotAspect) * fit, fit] : [fit, (slotAspect / imgAspect) * fit];
        // the face forms as the page opens (16 Nov: half-gathered dots crowded the name until you scrolled)
        this.portrait.gather += (Math.min(1, this.intro + p) - this.portrait.gather) * 0.06;
        u.uGather.value = this.portrait.gather;
        u.uT.value = time;
        u.uSize.value = Math.max(2, ((b.height * D) / 132) * 1.05);
        this.portrait.mesh.draw();
        continue;
      }
      if (s.key === "type") continue;
      const sc = this.scene(s.key);
      if (!sc) continue;
      // with frames, the story moves one cut at a time and eases to each new state (0..0.7 over the
      // frames, 0.7..1 through the rest frame); without, it follows the scroll directly
      let story = p;
      if (frame) {
        const goal = frame.index < frame.count ? ((frame.index + 1) / frame.count) * 0.7 : 0.7 + 0.3 * frame.rest;
        s.story += (goal - s.story) * Math.min(1, dt / 140);
        story = s.story;
      }
      sc.update(story, time, this.intro, s.icon, frame);
      const aspect = b.width / b.height;
      const c = sc.cam(aspect, s.icon);
      // in a sequence the object steps back to fit the open band; tall phone frames have more room
      // between the lines, so it comes closer there
      const back = (c.back ?? 1) * (s.frames ? s.fit * (aspect < 1 ? 0.6 : 1) : 1);
      cam.perspective({ fov: fovFor(aspect), aspect, near: 0.1, far: 80 });
      cam.position.set(
        c.target[0] + (c.pos[0] - c.target[0]) * back,
        c.target[1] + (c.pos[1] - c.target[1]) * back,
        c.target[2] + (c.pos[2] - c.target[2]) * back,
      );
      cam.lookAt(c.target);
      // lens shift: move the subject sideways to make room for text (wide layouts only)
      const shift = s.icon ? 0 : W >= 768 ? s.shift : s.shiftNarrow;
      const scale = Math.min(b.height, b.width / 1.25);
      cam.projectionMatrix[8] = -((shift * 2 * scale) / b.width);
      cam.updateMatrixWorld();
      sc.root.updateMatrixWorld();
      for (const m of sc.shadows) if (m.visible && m.program.uniforms.uOpacity.value > 0.001) m.draw({ camera: cam });
      for (const m of sc.solids) if (m.visible && m.parent?.visible !== false) m.draw({ camera: cam });
    }
    gl.disable(gl.SCISSOR_TEST);
  }
}

export const stage = new Stage();
