import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import GLSlot from "./fx/GLSlot";
import type { Frame } from "./fx/gl/type";
import { MERGE_AT } from "./fx/gl/scenes";
import { Arrow, COMPANY, Footer, Nav } from "./site";

/* ---------- small pieces ---------- */

/** Words that light up one by one as the track scrolls. */
function Lit({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="lit-word">
          {w}{" "}
        </span>
      ))}
    </>
  );
}

function Visit({ href, children, internal = false }: { href: string; children: React.ReactNode; internal?: boolean }) {
  const cls = "group inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:border-orange hover:text-orange";
  const inner = (
    <>
      {children}
      <Arrow className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  );
  return internal ? (
    <Link href={href} data-shutter className={cls}>{inner}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  );
}

/* ---------- content ---------- */

const HERO_FRAMES: Frame[] = [
  { word: "AI", bg: "cobalt", fg: "paper" },
  { word: "PRODUCTS", bg: "lemon", fg: "ink" },
  { word: "FOR PEOPLE", bg: "orange", fg: "ink" },
  { word: "WHO NEVER", bg: "ink", fg: "lemon" },
  { word: "ASKED", bg: "cobalt", fg: "lemon" },
  { word: "FOR AI.", bg: "lemon", fg: "ink" },
];

const PRODUCTS: { scene: "adfontes" | "fugitiva" | "melax"; name: string; line: string; href: string }[] = [
  { scene: "adfontes", name: "AD FONTES", line: "a blockchain game you start with an email", href: "#adfontes" },
  { scene: "fugitiva", name: "FUGITIVA", line: "case files on the crimes nobody expects from a woman", href: "#fugitiva" },
  { scene: "melax", name: "Melax", line: "bitcoin on a phone with buttons", href: "#melax" },
];

const FILE: [string, string][] = [
  ["The facts", "flat, each one with its source"],
  ["Open eyes", "did she go in knowing what she was doing"],
  ["The read", "an opinion, argued from the record"],
  ["Where it stands", "caught, sentenced or still out there"],
  ["Sources", "linked, so you can check us"],
];

const DIAL = ["#", "2", "5", "8", "0", "#"];
const DIAL_AT = [0.34, 0.405, 0.47, 0.535, 0.6, 0.665];

const MERGED: { repo: string; pr: string; href: string; what: string; date: string; sha: string; shaHref: string }[] = [
  {
    repo: "datahub-project/datahub",
    pr: "#19115",
    href: "https://github.com/datahub-project/datahub/pull/19115",
    what: "You can raise an incident on a single column now, not only on a whole dataset.",
    date: "20 Aug 2026",
    sha: "8c823661e6",
    shaHref: "https://github.com/datahub-project/datahub/commit/8c823661e6",
  },
  {
    repo: "datahub-project/datahub",
    pr: "#19405",
    href: "https://github.com/datahub-project/datahub/pull/19405",
    what: "The permission check for those column incidents runs against the parent dataset, where the access rules actually live.",
    date: "24 Aug 2026",
    sha: "1eeb440e65",
    shaHref: "https://github.com/datahub-project/datahub/commit/1eeb440e65",
  },
  {
    repo: "CALLE-AI/awesome-phone-call-agents",
    pr: "#337",
    href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/337",
    what: "A reconciler that reads what really happened to a phone call, because the status field alone can say done on a voicemail.",
    date: "11 Sep 2026",
    sha: "fc43128f2c",
    shaHref: "https://github.com/CALLE-AI/awesome-phone-call-agents/commit/fc43128f2c",
  },
  {
    repo: "google/adk-python",
    pr: "#6935",
    href: "https://github.com/google/adk-python/pull/6935",
    what: "Putting tools in the wrong half of a custom model's config quietly dropped them. Google's team took the fix in with our founder as co-author.",
    date: "7 Nov 2026",
    sha: "9be86308a1",
    shaHref: "https://github.com/google/adk-python/commit/9be86308a1a1af769541165c9ff57d0ec095c68c",
  },
];

/* ---------- the page ---------- */

export default function Home() {
  return (
    <div className="relative">
      <Nav />

      <main className="relative z-10">
        {/* 1. hero: kinetic type. One word a frame, cut on the scroll beat; the knot tangles on every cut.
            Then the rest frame: paper, the knot sinks through the floor, the door rises. */}
        <section data-track className="relative h-[360vh]" aria-labelledby="hero-title">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <GLSlot scene="hero" frames={HERO_FRAMES} restFrom={0.5} className="absolute inset-0" />
            <h1 id="hero-title" className="sr-only">AI products for people who never asked for AI.</h1>
            <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink/70 transition-opacity" data-until="0.06" aria-hidden="true">
              scroll
            </p>
            <p className="pointer-events-none absolute inset-x-0 top-[13svh] px-5 text-center font-display text-[min(11vw,10svh)] font-extrabold leading-[0.9] tracking-[-0.05em]" data-at="0.66">
              We build the door.
            </p>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-5 pb-6 text-center md:pb-8" data-at="0.76">
              <p className="max-w-xl text-base leading-relaxed [@media(min-height:720px)]:text-lg">
                We hide the plumbing. Models, wallets, tokens and APIs stay under the floor. What&apos;s left on the screen is something you can use in the first thirty seconds.
              </p>
              <ul className="flex flex-wrap justify-center gap-2" aria-label="What we've built">
                {PRODUCTS.map((p) => (
                  <li key={p.scene}>
                    <a href={p.href} title={p.line} className="group flex items-center gap-2 rounded-full border-2 border-ink py-1 pl-1 pr-4 transition-transform hover:-translate-y-0.5">
                      <GLSlot scene={p.scene} icon className="h-11 w-11 shrink-0 rounded-full" />
                      <span className="font-display text-sm font-extrabold tracking-[-0.02em]">{p.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2. the line */}
        <section data-track className="relative h-[150vh]" aria-label="What we do">
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-5 sm:px-8">
            <div className="mx-auto w-full max-w-[1500px]" data-lit>
              <p className="max-w-[16ch] font-display text-[12vw] font-extrabold leading-[0.9] tracking-[-0.05em] md:text-[7.4vw]">
                <Lit text="Most AI products work. Most people still can't use them." />
              </p>
              <p className="mt-10 max-w-xl text-lg leading-relaxed sm:text-xl" data-at="0.78">
                A blockchain game asks for a wallet before you&apos;ve seen anything. A bitcoin wallet assumes a smartphone and data. The clever part is done, and the person in front of it is stuck at the door. We build the door.
              </p>
            </div>
          </div>
        </section>

        {/* 3. the work */}
        <section id="work" className="relative scroll-mt-0">
          <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-6 px-5 pt-10 sm:px-8">
            <h2 className="font-display text-[26vw] font-extrabold leading-[0.78] tracking-[-0.07em] md:text-[19vw]" data-fly>
              Built<span className="text-orange">.</span>
            </h2>
            <p className="pb-4 text-right font-mono text-[11px] uppercase leading-6 tracking-[0.2em]" data-fly style={{ "--fly-delay": "0.2s" } as React.CSSProperties}>
              3 products
              <br />2 live
            </p>
          </div>

          {/* 01 AD FONTES */}
          <article id="adfontes" data-track className="relative h-[230vh] scroll-mt-0">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <GLSlot scene="adfontes" shift={0.3} shiftNarrow={0} className="absolute inset-x-0 top-0 h-[50svh] md:inset-y-0 md:left-[34%] md:right-0 md:h-full" />
              <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-8 sm:px-8 md:justify-center md:pb-0">
                <div className="max-w-md">
                  <div className="flex items-center gap-3" data-fly>
                    <span className="font-mono text-xs">01</span>
                    <span className="chip"><span className="live-dot" />Live · NEAR testnet</span>
                  </div>
                  <h3 className="mt-4 font-display text-[13vw] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-7xl" data-fly>AD FONTES</h3>
                  <p className="mt-3 font-display text-xl font-bold leading-snug text-cobalt sm:text-2xl" data-fly>
                    A blockchain game where you never see the blockchain.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed sm:text-base" data-fly>
                    A world of small nations run by AI. Their citizens read real research papers, trade what they learn and sometimes go to war. You fund one and become its god. Underneath there are DAOs, agent wallets and a contract that seals every turn. On screen you sign up with an email and give grace.
                  </p>
                  <dl className="mt-6 hidden max-w-sm grid-cols-3 gap-4 border-t-2 border-ink pt-4 md:grid [@media(max-height:700px)]:hidden" data-fly>
                    {[["email", "to start"], ["0", "wallet popups"], ["3D", "world map"]].map(([v, k]) => (
                      <div key={k}>
                        <dt className="font-display text-3xl font-extrabold">{v}</dt>
                        <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{k}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6" data-fly>
                    <Visit href="https://adfontes.fun">adfontes.fun</Visit>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 right-6 hidden w-72 rotate-[-3deg] rounded-3xl border-2 border-ink bg-paper p-5 shadow-[8px_8px_0_#15120F] md:block" data-at="0.72" style={{ "--fly-rot": "-12deg" } as React.CSSProperties}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">How you start</p>
                <p className="mt-3 rounded-xl border-2 border-ink/20 px-3 py-2 font-mono text-[12px] text-mute">you@email.com</p>
                <p className="mt-3 rounded-full bg-orange px-4 py-2.5 text-center text-sm font-bold">Play with email</p>
                <p className="mt-3 font-mono text-[11px] leading-5">A funded account gets made for you. No wallet, no seed phrase, no popups.</p>
              </div>
            </div>
          </article>

          {/* 02 FUGITIVA */}
          <article id="fugitiva" data-track className="relative h-[230vh] scroll-mt-0">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <GLSlot scene="fugitiva" shift={-0.24} shiftNarrow={0} className="absolute inset-x-0 top-0 h-[48svh] md:inset-y-0 md:left-0 md:right-[38%] md:h-full" />
              <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-8 sm:px-8 md:items-end md:justify-center md:pb-0">
                <div className="max-w-md">
                  <div className="flex items-center gap-3" data-fly>
                    <span className="font-mono text-xs">02</span>
                    <span className="chip"><span className="live-dot" />Live · fugitiva.onenept.com</span>
                  </div>
                  <h3 className="mt-4 font-display text-[13vw] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-7xl" data-fly>FUGITIVA</h3>
                  <p className="mt-3 font-display text-xl font-bold leading-snug text-red sm:text-2xl" data-fly>
                    The crimes nobody expects from a woman.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed sm:text-base" data-fly>
                    A journal of case files on women behind the crimes people assume men commit. File 01 is the 18 women on Europol&apos;s 2019 most wanted list: what each one did, and where she is now.
                  </p>
                  <ol className="mt-5 hidden space-y-1.5 border-l-2 border-ink pl-5 md:block" data-fly>
                    {FILE.map(([name, job], k) => (
                      <li key={name} className="text-sm" data-fly style={{ "--fly-delay": `${0.15 + k * 0.06}s` } as React.CSSProperties}>
                        <span className="font-mono font-medium">{name}</span> <span className="text-mute">{job}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6" data-fly>
                    <Visit href="https://fugitiva.onenept.com">read file 01</Visit>
                  </div>
                </div>
              </div>
              <p className="absolute bottom-6 left-6 hidden font-mono text-[11px] uppercase tracking-[0.2em] md:block" data-at="0.8">
                No glamour. Every file runs in the same order.
              </p>
            </div>
          </article>

          {/* 03 Melax */}
          <article id="melax" data-track className="relative h-[250vh] scroll-mt-0">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <GLSlot scene="melax" shift={0.4} shiftNarrow={0} className="absolute inset-x-0 top-0 h-[50svh] md:inset-y-0 md:left-[30%] md:right-0 md:h-full" />
              <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-8 sm:px-8 md:justify-center md:pb-0">
                <div className="max-w-md">
                  <div className="flex items-center gap-3" data-fly>
                    <span className="font-mono text-xs">03</span>
                    <span className="chip">Learning project · not deployed</span>
                  </div>
                  <h3 className="mt-4 font-display text-[13vw] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-7xl" data-fly>Melax</h3>
                  <p className="mt-3 font-display text-xl font-bold leading-snug text-orange sm:text-2xl" data-fly>
                    Bitcoin for the phone you already have.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed sm:text-base" data-fly>
                    Dial a short code and a menu opens, in Wolof, French or English. No app, no internet. Under the menu it&apos;s Lightning and Cashu, and a local agent swaps francs for sats with you. It runs on a test network on one machine, and the repo says so up front.
                  </p>
                  <p className="mt-5 font-display text-5xl font-extrabold tracking-[-0.02em]" aria-label="Dial #2580#">
                    {DIAL.map((c, i) => (
                      <span key={i} className="char" data-at={String(DIAL_AT[i])}>{c}</span>
                    ))}
                  </p>
                  <div className="mt-6" data-fly>
                    <Visit href="https://github.com/cnpierrepapi/melax">the code on GitHub</Visit>
                  </div>
                </div>
              </div>
              <div className="absolute left-[40%] top-1/3 hidden w-56 rotate-[4deg] rounded-3xl border-2 border-ink bg-cobalt p-5 font-mono text-[13px] leading-6 text-paper shadow-[8px_8px_0_#15120F] md:block" data-at="0.68" style={{ "--fly-rot": "10deg" } as React.CSSProperties}>
                <p className="text-[10px] uppercase tracking-[0.18em] text-lemon">What opens</p>
                <p className="mt-2">Melax</p>
                <p>1 Balance</p>
                <p>2 Send</p>
                <p>3 Receive</p>
                <p>4 Pay a shop</p>
                <p>5 Cash in</p>
                <p>6 Cash out</p>
                <p className="mt-2 text-[10px] text-paper/70">In Wolof, 1 is Sa xaalis.</p>
              </div>
            </div>
          </article>
        </section>

        {/* 4. merged upstream: branches merge into the trunk, each PR lands as its branch does */}
        <section id="open-source" data-track className="relative h-[220vh] scroll-mt-0">
          <div className="sticky top-0 flex h-[100svh] flex-col pt-20">
            <h2 className="mx-auto w-full max-w-[1500px] px-5 font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] sm:px-8 md:text-7xl" data-at="0.01">
              Merged upstream.
            </h2>
            <div className="relative min-h-[34svh] flex-1">
              <GLSlot scene="merge" className="absolute inset-0" />
            </div>
            <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 content-start gap-2 px-5 sm:px-8 md:grid-cols-4 md:gap-4">
              {MERGED.map((m, i) => (
                <a
                  key={m.pr + m.repo}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-at={String(MERGE_AT[i])}
                  style={{ "--fly-rot": `${i % 2 ? 6 : -6}deg` } as React.CSSProperties}
                  className="group flex items-baseline justify-between gap-3 rounded-2xl border-2 border-ink bg-paper px-4 py-2.5 md:block md:p-5"
                >
                  <div>
                    <p className="font-mono text-[10px] text-mute">{m.repo}</p>
                    <p className="font-display text-2xl font-extrabold group-hover:text-orange md:mt-1 md:text-4xl">{m.pr}</p>
                  </div>
                  <p className="mt-2 hidden text-sm leading-snug md:block [@media(max-height:700px)]:hidden">{m.what}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-orange md:mt-3">Merged {m.date}</p>
                </a>
              ))}
            </div>
            <p className="mx-auto mb-6 mt-2 w-full max-w-[1500px] px-5 text-sm sm:px-8" data-at="0.9">
              Some of the work happens in other people&apos;s code. All four reviewed and merged by the teams who own the projects.
            </p>
          </div>
        </section>

        {/* 5. the company: the one solid cobalt block */}
        <section id="company" className="relative scroll-mt-0 bg-cobalt text-paper">
          <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-lemon" data-fly>Why onenept</p>
              <blockquote className="mt-6" data-fly style={{ "--fly-delay": "0.1s" } as React.CSSProperties}>
                <p className="font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] sm:text-5xl">
                  The name comes from the oneness concept. I started building because I love bringing new things into existence. The longer I do it, the clearer it gets that the point is other people: what they love doing in their spare time, and what can make them money. We rise by lifting others.
                </p>
                <footer className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-lemon">
                  {COMPANY.founder}, founder
                </footer>
              </blockquote>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:pt-10">
              <h2 className="font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.05em]" data-fly>
                Onenept
                <br />
                Studios Inc.
              </h2>
              <p className="mt-5 leading-relaxed text-paper/85" data-fly>
                An applied AI company. We build for the person who has never heard of the tech underneath, and we test on the live thing, on a phone.
              </p>
              <dl className="mt-8 divide-y divide-paper/25 border-y border-paper/25 font-mono text-sm" data-fly>
                <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-lemon">Entity</dt>
                  <dd>{COMPANY.legal}<br /><span className="text-paper/70">{COMPANY.kind}</span></dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-lemon">Address</dt>
                  <dd>{COMPANY.street}<br />{COMPANY.city}<br />{COMPANY.country}</dd>
                </div>
              </dl>
              <Link href="/emmanuel" data-shutter className="group mt-8 inline-flex items-center gap-4 rounded-full bg-paper py-2 pl-2 pr-6 text-ink" data-fly>
                <Image src="/founder.jpg" alt="" width={48} height={48} sizes="48px" className="h-12 w-12 rounded-full object-cover object-top" />
                <span>
                  <span className="block font-display text-lg font-extrabold leading-tight">{COMPANY.founder}</span>
                  <span className="block text-sm">Founder and design engineer</span>
                </span>
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. contact */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-[1500px] px-5 py-28 sm:px-8 sm:py-40">
            <p className="max-w-xl font-display text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl" data-fly>
              Got an AI product people keep bouncing off?
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              data-magnetic
              className="group mt-10 inline-flex max-w-full items-center gap-3 whitespace-nowrap font-display text-[7.6vw] font-extrabold leading-none tracking-[-0.055em] transition-colors hover:text-orange md:text-[7vw]"
            >
              <span className="min-w-0">{COMPANY.email}</span>
              <Arrow className="h-[0.6em] w-[0.6em] shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
