# Decisions

Newest first.

## 16 Nov 2026: the bright redesign

1. **Paper, not night.** Warm paper #FFF8EE, ink #15120F, onenept orange #FF6B2C. Cobalt and lemon
   arrive loud, on the cuts and in one solid block each. The dark site is retired.
2. **The door is the logo.** A thick ring with an arched doorway cut through the bottom of the band.
   It reads as the o in onenept and as a way in. Kept over a button and an "ene" ligature: the button
   was generic, and the ligature read as glasses and fell apart at 16 px.
3. **No three.js.** Every 3D object is a raymarched SDF in GLSL, drawn through OGL. A whole engine
   (Babylon, PlayCanvas) was too much for five objects.
4. **One canvas.** Scenes draw into slots on a single fixed canvas, so phones never juggle several
   WebGL contexts.
5. **One number per section.** Track progress drives the scene, the text reveals and the flashes.
6. **Flashes are capped at three a second, in code.** The warning gate is there too, but a warning
   doesn't help someone who already scrolled into it, so the planner enforces the WCAG line however
   many triggers fire. Calm mode replaces every flash with a slow wash.
7. **Symbols, not screenshots.** AD FONTES is islands round a spring (ad fontes: to the sources).
   FUGITIVA is a Bauhaus face with a redaction bar. Melax is a button phone dialling #2580#, then
   lightning (melax is Wolof for lightning). The upstream work is branches merging into a trunk.
8. **The canvas clears to paper colour at zero alpha.** The canvas is drawn below screen resolution;
   clearing to transparent black left a dark hairline round every scene when the browser scaled it up.
9. **Only shadows darken the floor.** Lit paper in the scenes matches the page exactly, so slots have
   no visible edge.
10. **The motion choice is the only thing stored**, in local storage. The privacy page says so.

## Known costs

- Shader compiling runs during the loader. On Lighthouse's slow mobile profile that shows up as
  blocking time (about 0.8 s) and a late largest paint (the headline waits for the loader on purpose).
  Performance scores about 71 there; accessibility, best practices and SEO score 96 to 100.
