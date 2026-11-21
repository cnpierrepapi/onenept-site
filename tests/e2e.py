# Browser checks for the motion rules and the fallbacks. Needs a running build:
#   npm run build && npx next start -p 3111     then     python tests/e2e.py [base_url]
# Exits non-zero on any failure.
import asyncio, sys
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3111"
GPU = ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"]
failed = 0

def check(ok, name, detail=""):
    global failed
    print(("PASS " if ok else "FAIL ") + name + (f"  ({detail})" if detail and not ok else ""))
    if not ok:
        failed += 1

# Records the moment either flash layer turns fully on.
WATCH = """() => {
  window.__onsets = [];
  window.__cuts = [];
  for (const sel of ['[data-fx=flash]', '[data-fx=tear]']) {
    const el = document.querySelector(sel);
    new MutationObserver(() => { if (el.style.opacity === '1') window.__onsets.push(performance.now()); })
      .observe(el, { attributes: true, attributeFilter: ['style'] });
  }
}"""

async def storm(pg):
    """Scroll the whole page fast, crossing every flash marker, then back up."""
    H = await pg.evaluate("document.documentElement.scrollHeight - innerHeight")
    for k in range(0, 41):
        await pg.evaluate(f"window.scrollTo(0, {int(H * k / 40)})")
        await pg.wait_for_timeout(60)
    for k in range(40, -1, -2):
        await pg.evaluate(f"window.scrollTo(0, {int(H * k / 40)})")
        await pg.wait_for_timeout(40)
    await pg.wait_for_timeout(3500)  # let queued cuts play out
    return await pg.evaluate("[...window.__onsets, ...(window.__cuts || [])].sort((a, b) => a - b)")

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=GPU)

        # 1. the gate: shows on a first visit, remembers the pick
        ctx = await b.new_context(viewport={"width": 1280, "height": 800})
        pg = await ctx.new_page()
        await pg.goto(BASE + "/", wait_until="networkidle")
        gate = pg.get_by_role("dialog")
        check(await gate.is_visible(), "first visit shows the flashing warning")
        await pg.get_by_role("button", name="Enter calm").click()
        await pg.wait_for_selector(".loader", state="detached", timeout=30000)
        check(await pg.evaluate("localStorage.getItem('onenept-motion')") == "calm", "the calm pick is stored")
        check(await pg.evaluate("document.documentElement.dataset.motion") == "calm", "calm mode is on")

        # 2. calm mode never flashes
        await pg.evaluate(WATCH)
        onsets = await storm(pg)
        gaps = [b - a for a, b in zip(onsets, onsets[1:])]
        check(not gaps or min(gaps) >= 880, "calm mode: changes fade, never faster than one every 0.9 s", f"min gap {min(gaps) if gaps else 0:.0f} ms")
        await pg.reload(wait_until="networkidle")
        check(not await pg.get_by_role("dialog").is_visible(), "second visit skips the warning")
        await ctx.close()

        # 3. full mode: never more than 3 flashes in any second, even on a fast scroll
        ctx = await b.new_context(viewport={"width": 1280, "height": 800})
        await ctx.add_init_script("localStorage.setItem('onenept-motion','full')")
        pg = await ctx.new_page()
        await pg.goto(BASE + "/", wait_until="networkidle")
        await pg.wait_for_selector(".loader", state="detached", timeout=30000)
        await pg.evaluate(WATCH)
        onsets = await storm(pg)
        worst = max([sum(1 for t in onsets if s <= t < s + 1000) for s in onsets] or [0])
        check(len(onsets) > 0, "full mode does flash", "no flashes recorded")
        check(worst <= 3, "full mode: 3 flashes a second at most", f"{worst} in one second, {len(onsets)} total")

        # 4. the page wipe to the founder page
        await pg.evaluate("window.scrollTo(0, 0)")
        await pg.wait_for_timeout(400)
        await pg.locator("header nav a", has_text="Founder").click()
        await pg.wait_for_url("**/emmanuel", timeout=10000)
        await pg.wait_for_timeout(1500)
        vis = await pg.evaluate("getComputedStyle(document.querySelector('[data-fx=shutter]')).visibility")
        check(vis == "hidden", "the shutter opens again on the new page", vis)
        check(await pg.locator("h1").inner_text() != "", "founder page has its heading")
        await ctx.close()

        # 5. no sideways overflow, every page, seven widths
        ctx = await b.new_context()
        await ctx.add_init_script("localStorage.setItem('onenept-motion','calm')")
        pg = await ctx.new_page()
        bad = []
        for path in ["/", "/labs", "/emmanuel", "/privacy"]:
            for w in [320, 390, 768, 1024, 1280, 1440, 1600]:
                await pg.set_viewport_size({"width": w, "height": 900})
                await pg.goto(BASE + path, wait_until="networkidle")
                sw, cw = await pg.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
                if sw > cw:
                    bad.append(f"{path}@{w}:{sw}>{cw}")
        check(not bad, "no sideways overflow at 7 widths on 4 pages", ", ".join(bad))
        await ctx.close()

        # 6. without JavaScript the page still reads (the loader can't trap anyone)
        ctx = await b.new_context(java_script_enabled=False, viewport={"width": 1280, "height": 800})
        pg = await ctx.new_page()
        await pg.goto(BASE + "/", wait_until="load")
        check(not await pg.locator(".loader").is_visible(), "no JavaScript: no loader in the way")
        txt = await pg.locator("main").inner_text()
        check("AD FONTES" in txt and "Bring your agent" in txt and "oneness concept" in txt, "no JavaScript: all the text is there")
        await ctx.close()
        await b.close()

        # 7. without WebGL every scene shows its still
        b = await p.chromium.launch(args=["--disable-3d-apis", "--disable-webgl"])
        ctx = await b.new_context(viewport={"width": 1280, "height": 800})
        await ctx.add_init_script("localStorage.setItem('onenept-motion','full')")
        pg = await ctx.new_page()
        await pg.goto(BASE + "/", wait_until="networkidle")
        await pg.wait_for_selector(".loader", state="detached", timeout=30000)
        check(await pg.evaluate("document.documentElement.classList.contains('gl-off')"), "no WebGL is detected")
        imgs = await pg.evaluate("[...document.querySelectorAll('.gl-slot[data-still]')].map(s => getComputedStyle(s).backgroundImage)")
        check(imgs and all(i.startswith("url(") for i in imgs), "no WebGL: every slot shows a still", str(imgs[:3]))
        missing = []
        for u in set(i[5:-2] for i in imgs if i.startswith("url(")):
            r = await pg.request.get(u)
            if r.status != 200:
                missing.append(u)
        check(not missing, "every still image exists", ", ".join(missing))
        await b.close()

    print("all passed" if not failed else f"{failed} FAILED")
    sys.exit(1 if failed else 0)

asyncio.run(main())
