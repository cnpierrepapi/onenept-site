# Decisions

Newest first.

## 17 Nov 2026: kinetic type, the whole breadth

14. **Every section is a run of full-screen frames.** Two lines of giant type on opposite edges, the clay
    object in the open band between them, so nothing covers the words. No section puts copy in one
    column and media in the other. The reference was the grammar of a kinetic-type music video: words as
    the picture, the colour changing on the cut. Ours uses our palette, our words and our objects.
15. **The flash is the cut.** Colour only changes when a word arrives. One cut every 340 ms at most,
    counted across the whole page (a per-section count let two sections cut 150 ms apart; the browser
    test caught it). Calm mode cross-fades and changes at most once every 0.9 s.
16. **Each story moves with the cuts.** Islands rise, the face assembles and the phone presses the key
    on screen one frame at a time, easing to each new state.
17. **Phones are their own layout.** Lines stack centred, the object comes closer, details follow the
    scene instead of sitting in columns.

## 16 Nov 2026, evening: meshes, not raymarching

11. **The scenes are rasterised meshes now.** The raymarched version ran at about 2 fps on a laptop with
    Intel Iris Xe graphics; headless tests had said 60 because headless Chrome doesn't wait for the GPU.
    Same shapes, same formulas: each one is meshed once at load, and the frame cost is a few dozen draw
    calls. Measured in a real Chrome on that laptop: every section holds the browser's own frame cap.
12. **The layout fits short windows.** Headline and scene sizes follow the screen's height as well as
    its width; the hero's product row is a compact strip so the door is never covered.
13. **Shorter tracks.** About a third less scrolling, and chapter text arrives as each section enters
    instead of waiting for the scene.

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

- Meshing runs during the loader. The headline waits for the loader on purpose, so Lighthouse's slow
  mobile profile reports a late largest paint.

## 22 Nov 2026: the triad homepage

- Onenept is three parts now: platforms (Warmleads, Folofolo, SYZYGY), real-life games (The Come Up, Spot Her) and
  stories (League of Supernatural Gentlemen). One chapter each. AD FONTES, Hopium Highway and Melax chapters are gone.
- "Real-life games" instead of "ARGs": he asked for a friendlier word.
- Same symbol rule as before. Platforms = three plinths: paper and pencil (Warmleads), an item box (Folofolo), three
  spheres swinging into one line (SYZYGY, which is the word for that). Real-life games = a clay town with a trail of
  stones and a pin dropping where the mission ends. Stories = a hand mirror between two candles that cracks (vanity horror).
- A chapter's kinetic-type frame must never use a plinth's own colour as its background (the orange plinth vanished on
  orange); the platforms frames alternate ink and paper.
- The streets board is wide, so on tall phone frames its camera steps back 1.3x to keep the pin in shot.

