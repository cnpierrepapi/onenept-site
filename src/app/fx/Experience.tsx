"use client";

/* The motion layer, mounted once in the root layout so it survives page changes:
   the warning gate, the loader and its iris, smooth scroll, the WebGL stage, scroll-driven reveals,
   the flash layer, the cursor and the shutter wipe between pages. */
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import Lenis from "lenis";
import { stage, trackProgress } from "./gl/stage";
import { flash, onFlash, setFlashMode, type FlashKind } from "./flashbus";
import { gateDefault, MODE_KEY, resolveMode } from "@/lib/mode";
import type { Mode } from "@/lib/flash";
import { DOOR_PATH } from "../brand";

type Phase = "boot" | "gate" | "load" | "done";

/* Scroll-driven bits, found once per page and read every frame. Module scope on purpose:
   Experience is mounted once, and this state never needs to re-render anything. */
let litEls: { el: HTMLElement; words: HTMLElement[] }[] = [];
let atEls: HTMLElement[] = [];
let untilEls: HTMLElement[] = [];
let flashAtEls: { el: HTMLElement; past: boolean }[] = [];

function scan() {
  litEls = Array.from(document.querySelectorAll<HTMLElement>("[data-lit]")).map((el) => ({ el, words: Array.from(el.querySelectorAll<HTMLElement>(".lit-word")) }));
  atEls = Array.from(document.querySelectorAll<HTMLElement>("[data-at]"));
  untilEls = Array.from(document.querySelectorAll<HTMLElement>("[data-until]"));
  flashAtEls = Array.from(document.querySelectorAll<HTMLElement>("[data-flash-at]")).map((el) => ({ el, past: trackProgress(el) >= Number(el.dataset.flashAt) }));
}

function drive() {
  for (const { el, words } of litEls) {
    const p = trackProgress(el);
    const n = words.length;
    words.forEach((w, i) => w.classList.toggle("on", p * 1.25 > (i + 1) / n));
  }
  for (const el of atEls) el.classList.toggle("in", trackProgress(el) >= Number(el.dataset.at));
  for (const el of untilEls) el.style.opacity = trackProgress(el) >= Number(el.dataset.until) ? "0" : "";
  for (const f of flashAtEls) {
    const past = trackProgress(f.el) >= Number(f.el.dataset.flashAt);
    if (past && !f.past) flash((f.el.dataset.flash || "cobalt").split(","), (f.el.dataset.kind as FlashKind) || "flash");
    f.past = past;
  }
}

export default function Experience() {
  const pathname = usePathname();
  const router = useRouter();
  const canvas = useRef<HTMLCanvasElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const doorFill = useRef<SVGPathElement>(null);
  const flashEl = useRef<HTMLDivElement>(null);
  const tearEl = useRef<HTMLDivElement>(null);
  const shutter = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const wiping = useRef(false);
  const [phase, setPhase] = useState<Phase>("boot");
  const [mode, setMode] = useState<Mode>("full");
  const [pick, setPick] = useState<Mode>("full");

  const applyMode = useCallback((m: Mode) => {
    setMode(m);
    setFlashMode(m);
    document.documentElement.dataset.motion = m;
    if (lenis.current) lenis.current.options.lerp = m === "calm" ? 0.16 : 0.09;
  }, []);

  // 1. boot: stored choice or the gate
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(MODE_KEY); } catch {}
    const m = resolveMode(stored);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = requestAnimationFrame(() => {
      setPick(gateDefault(reduced));
      if (m) { applyMode(m); setPhase("load"); } else setPhase("gate");
    });
    return () => cancelAnimationFrame(id);
  }, [applyMode]);

  // switching later, from the footer
  useEffect(() => {
    const on = (e: Event) => {
      const m = (e as CustomEvent<Mode>).detail;
      try { localStorage.setItem(MODE_KEY, m); } catch {}
      applyMode(m);
    };
    window.addEventListener("onenept:motion", on);
    return () => window.removeEventListener("onenept:motion", on);
  }, [applyMode]);

  const choose = (m: Mode) => {
    try { localStorage.setItem(MODE_KEY, m); } catch {}
    applyMode(m);
    setPhase("load");
  };

  // 2. smooth scroll + the one ticker that drives everything
  useEffect(() => {
    if (canvas.current) stage.init(canvas.current);
    const l = new Lenis({ autoRaf: false, lerp: 0.09, anchors: { offset: -72 } });
    lenis.current = l;
    l.stop();
    let last = performance.now();
    const tick = (time: number) => {
      const now = performance.now(), dt = now - last;
      last = now;
      l.raf(time * 1000);
      stage.render(time, dt);
      drive();
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); l.destroy(); lenis.current = null; };
  }, []);

  const open = () => {
    const el = loader.current;
    const done = () => {
      setPhase("done");
      lenis.current?.start();
    };
    document.documentElement.classList.add("ready");
    stage.active = true;
    gsap.to(stage, { intro: 1, duration: 2.4, ease: "power3.out" });
    if (!el) return done();
    if (mode === "calm") {
      gsap.to(el, { opacity: 0, duration: 0.6, ease: "power2.out", onComplete: done });
      return;
    }
    flash(["orange"]);
    const iris = { r: 0 };
    gsap.to(iris, {
      r: Math.hypot(window.innerWidth, window.innerHeight) * 0.6,
      duration: 1.15,
      ease: "expo.inOut",
      onUpdate: () => {
        const m = `radial-gradient(circle at 50% 46%, transparent ${iris.r}px, #000 ${iris.r + 1}px)`;
        el.style.maskImage = m;
        el.style.webkitMaskImage = m;
      },
      onComplete: done,
    });
  };

  // 3. the loader: count to 100 against real work (shaders, fonts), then open the iris
  useEffect(() => {
    if (phase !== "load") return;
    let alive = true;
    const shown = { v: 0 };
    let target = 0;
    const len = ring.current?.getTotalLength() ?? 1000;
    if (ring.current) { ring.current.style.strokeDasharray = `${len}`; ring.current.style.strokeDashoffset = `${len}`; }
    const paint = () => {
      shown.v += (target - shown.v) * 0.12;
      const v = Math.min(100, Math.round(shown.v));
      if (count.current) count.current.textContent = String(v).padStart(3, "0");
      if (ring.current) ring.current.style.strokeDashoffset = `${len * (1 - shown.v / 100)}`;
      if (doorFill.current) doorFill.current.style.opacity = shown.v > 97 ? "1" : "0";
    };
    gsap.ticker.add(paint);
    const t0 = performance.now();
    (async () => {
      const fonts = document.fonts?.ready ?? Promise.resolve();
      await stage.compileAll((d, n) => { target = Math.max(target, (d / n) * 70); });
      await fonts;
      target = 85;
      const minMs = mode === "calm" ? 600 : 1200;
      await new Promise((r) => setTimeout(r, Math.max(0, minMs - (performance.now() - t0))));
      target = 100;
      await new Promise((r) => setTimeout(r, 420));
      if (!alive) return;
      gsap.ticker.remove(paint);
      if (count.current) count.current.textContent = "100";
      open();
    })();
    return () => { alive = false; gsap.ticker.remove(paint); };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // on every page: rescan, fly-ins, flashes at section edges
  useEffect(() => {
    const id = window.setTimeout(scan, 30);
    const fly = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); fly.unobserve(e.target); } }),
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-fly]").forEach((el) => fly.observe(el));
    const edges = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting && document.documentElement.classList.contains("ready")) flash((el.dataset.flash || "cobalt").split(","), (el.dataset.kind as FlashKind) || "flash");
      }),
      { rootMargin: "-48% 0px -48% 0px" },
    );
    document.querySelectorAll("[data-flash]:not([data-flash-at])").forEach((el) => edges.observe(el));
    return () => { clearTimeout(id); fly.disconnect(); edges.disconnect(); };
  }, [pathname]);

  // 5. the flash layer
  useEffect(() => onFlash((color, kind) => {
    if (kind === "wash") {
      const el = flashEl.current;
      if (!el) return;
      gsap.fromTo(el, { backgroundColor: color, opacity: 0 }, { opacity: 0.35, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" });
      return;
    }
    if (kind === "tear") {
      const el = tearEl.current;
      if (!el) return;
      const cols = ["#2F5BFF", "#FFE14D", "#FF6B2C", "#15120F"];
      Array.from(el.children).forEach((s, i) => {
        const h = s as HTMLElement;
        h.style.background = i % 3 === 0 ? color : cols[(i * 7) % cols.length];
        h.style.transform = `translateX(${(Math.random() * 2 - 1) * 30}vw)`;
      });
      el.style.opacity = "1";
      window.setTimeout(() => { el.style.opacity = "0"; }, 150);
      return;
    }
    const el = flashEl.current;
    if (!el) return;
    el.style.backgroundColor = color;
    el.style.opacity = "1";
    window.setTimeout(() => { el.style.opacity = "0"; }, 95);
  }), []);

  // 6. the cursor (fine pointers only) and magnetic targets
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || !dot.current || !halo.current) return;
    document.documentElement.classList.add("cursor-on");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 }), dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const hx = gsap.quickTo(halo.current, "x", { duration: 0.45, ease: "power3" }), hy = gsap.quickTo(halo.current, "y", { duration: 0.45, ease: "power3" });
    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) { seen = true; gsap.set([dot.current, halo.current], { x: e.clientX, y: e.clientY, opacity: 1 }); }
      dx(e.clientX); dy(e.clientY); hx(e.clientX); hy(e.clientY);
      const t = (e.target as HTMLElement).closest?.("a,button,[data-magnetic]");
      halo.current?.classList.toggle("big", !!t);
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);
        const pull = d < Math.max(r.width, r.height) * 0.75 ? 0.22 : 0;
        gsap.to(m, { x: (e.clientX - cx) * pull, y: (e.clientY - cy) * pull, duration: 0.6, ease: "power3.out" });
      });
    };
    window.addEventListener("pointermove", move);
    return () => { window.removeEventListener("pointermove", move); document.documentElement.classList.remove("cursor-on"); };
  }, []);

  // 7. the shutter between pages
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[data-shutter]") as HTMLAnchorElement | null;
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      const el = shutter.current;
      if (!el) return router.push(url.pathname + url.hash);
      wiping.current = true;
      el.style.visibility = "visible";
      const bars = Array.from(el.children);
      const calm = document.documentElement.dataset.motion === "calm";
      const go = () => { router.push(url.pathname + url.hash); };
      if (calm) gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35, onComplete: go });
      else gsap.fromTo(bars, { yPercent: 100 }, { yPercent: 0, duration: 0.5, stagger: 0.05, ease: "expo.inOut", onComplete: go });
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, [router]);
  useEffect(() => {
    if (!wiping.current) return;
    lenis.current?.scrollTo(0, { immediate: true });
    const el = shutter.current;
    if (!el) return;
    const calm = document.documentElement.dataset.motion === "calm";
    const end = () => { el.style.visibility = "hidden"; wiping.current = false; };
    window.setTimeout(() => {
      if (calm) gsap.to(el, { opacity: 0, duration: 0.4, onComplete: end });
      else gsap.to(Array.from(el.children), { yPercent: -100, duration: 0.55, stagger: 0.05, ease: "expo.inOut", onComplete: end });
    }, 120);
  }, [pathname]);

  return (
    <>
      <canvas ref={canvas} className="gl-canvas" aria-hidden="true" />

      {/* flash + tear layers */}
      <div ref={flashEl} data-fx="flash" className="pointer-events-none fixed inset-0 z-[85] opacity-0" aria-hidden="true" />
      <div ref={tearEl} data-fx="tear" className="pointer-events-none fixed inset-0 z-[86] flex flex-col opacity-0" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (<div key={i} className="flex-1" />))}
      </div>

      {/* shutter */}
      <div ref={shutter} data-fx="shutter" className="pointer-events-none fixed inset-0 z-[88] flex" style={{ visibility: "hidden" }} aria-hidden="true">
        {["#FF6B2C", "#2F5BFF", "#FFE14D", "#FF6B2C", "#15120F"].map((c, i) => (
          <div key={i} className="h-full flex-1" style={{ background: c, transform: "translateY(100%)" }} />
        ))}
      </div>

      {/* cursor */}
      <div ref={halo} style={{ opacity: 0 }} className="cursor-halo pointer-events-none fixed left-0 top-0 z-[95] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-ink transition-[width,height,background-color] duration-300 [.cursor-on_&]:block" aria-hidden="true" />
      <div ref={dot} style={{ opacity: 0 }} className="pointer-events-none fixed left-0 top-0 z-[96] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange [.cursor-on_&]:block" aria-hidden="true" />

      {/* loader */}
      {phase !== "done" ? (
        <div ref={loader} className="loader fixed inset-0 z-[80] flex flex-col justify-between bg-paper p-5 text-ink sm:p-8" role="status" aria-label="Loading">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.24em] text-mute">
            <span>onenept studios</span>
            <span>{mode === "calm" ? "calm mode" : "full mode"}</span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <svg viewBox="-60 -60 120 120" className="h-[38vmin] w-[38vmin]" aria-hidden="true">
              <circle ref={ring} r="50" fill="none" stroke="#FF6B2C" strokeWidth="3" transform="rotate(90)" />
              <path ref={doorFill} d={DOOR_PATH} fill="#FF6B2C" fillRule="evenodd" style={{ opacity: 0, transition: "opacity 0.35s" }} />
            </svg>
          </div>
          <div className="flex items-end justify-between">
            <span ref={count} className="font-display text-[22vw] font-extrabold leading-[0.8] tracking-[-0.06em] sm:text-[14vw]">000</span>
            <span className="mb-3 max-w-[12rem] text-right font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-mute">AI products for people who never asked for AI</span>
          </div>
        </div>
      ) : null}

      {/* the warning gate */}
      {phase === "gate" ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-lemon p-5" role="dialog" aria-modal="true" aria-labelledby="gate-title">
          <div className="w-full max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em]">Before you go in</p>
            <h2 id="gate-title" className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-7xl">
              Heads up. This site flashes.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed">
              Fast colour flashes and hard cuts, never more than three a second. If flashing light affects you, take the calm version. Same site, no flashes.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button autoFocus={pick === "full"} onClick={() => choose("full")} className="rounded-full bg-ink px-7 py-3.5 font-semibold text-paper transition-transform hover:-translate-y-0.5">
                Enter
              </button>
              <button autoFocus={pick === "calm"} onClick={() => choose("calm")} className="rounded-full border-2 border-ink px-7 py-3.5 font-semibold transition-transform hover:-translate-y-0.5">
                Enter calm
              </button>
            </div>
            <p className="mt-6 font-mono text-[11px] text-ink/70">You can switch at the bottom of any page.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
