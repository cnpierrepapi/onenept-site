# How onenept.com works

A static Next.js 16 site. Two pages that matter (`/` and `/emmanuel`), plus `/privacy`. Everything that
moves lives in one client component mounted once in the root layout, so it survives page changes.

## The pieces

| File | What it does |
| --- | --- |
| `src/app/fx/Experience.tsx` | The motion layer: warning gate, loader and iris, Lenis smooth scroll, the frame loop, scroll reveals, the flash layer, the cursor, the shutter wipe between pages. |
| `src/app/fx/gl/stage.ts` | One WebGL canvas for the whole site, fixed behind the content. Each frame it finds the scene slots on screen and draws each scene into its slot's rectangle (viewport plus scissor). |
| `src/lib/mesh.ts` | Turns a distance function into a triangle mesh (surface nets), once, at load. |
| `src/app/fx/gl/clay.ts` | The clay material (one cheap shader for every object) and soft blob shadows on the paper. |
| `src/app/fx/gl/scenes.ts` | The five clay scenes as meshes: hero, adfontes, fugitiva, melax, merge. |
| `src/app/fx/gl/portrait.ts` | The founder portrait: the photo sampled into dots that gather into the face. |
| `src/app/fx/GLSlot.tsx` | Marks where a scene goes on the page. Decoration only, hidden from screen readers. |
| `src/app/fx/flashbus.ts` | Every full-screen flash goes through here. |
| `src/lib/flash.ts` | The flash planner: never more than three flashes in any second (WCAG 2.3.1). |
| `src/lib/mode.ts` | Full or calm motion, and when the gate shows. |
| `src/app/brand.tsx` | The door logo as one SVG path. Icons and the OG image use the same path. |
| `src/app/chrome.tsx` | Nav, the mobile menu, the footer and its motion switch. |
| `public/stills/` | One still per scene, shown when a device has no WebGL. |

## How a scene tells its story

A section that animates is a track: a tall `[data-track]` block with a sticky, screen-high box inside.
`trackProgress()` turns the scroll position into 0..1 through the track. The scene gets it as `uP`; DOM
elements inside the track appear at a set point with `data-at="0.4"`; a flash fires as the track passes
`data-flash-at`. One number drives the 3D, the text and the cuts, so they can't drift apart.

Every shape starts as a signed distance function (the same formulas the first version raymarched) and
is meshed once at load by `meshSDF`. After that each frame is ordinary rasterising: move, turn and recolour
a few dozen meshes, with wrapped diffuse light, a hemisphere fill, a rim and blob shadows on the paper. No
model files. The canvas draws at the screen's own sharpness (up to 2x) with anti-aliasing; if frames run
slow for about a second, the resolution steps down.

## Order on load

1. The gate shows if no motion choice is stored (reduced-motion browsers get calm preselected).
2. The loader counts against real work: each scene's shader compiles, then fonts.
3. The iris opens, the stage starts drawing, the headline words fly in.

Nothing is drawn behind the gate or the loader.

## Checks

- `npm test`: the flash planner, the motion rules and the mesher.
- Frame rate: measure in a real, visible Chrome (`window.__glms`, or count requestAnimationFrame calls).
  Headless Chrome doesn't wait for the GPU, so its numbers are too good to trust.
- `python tests/e2e.py` against a running build (`npm run build && npx next start -p 3111`): the gate,
  calm mode never flashing, full mode staying at three a second or fewer during a fast scroll, the
  shutter, no sideways overflow at seven widths, the page with JavaScript off, the stills with WebGL off.
