import Image from "next/image";
import Link from "next/link";
import GLSlot from "./fx/GLSlot";
import type { Frame } from "./fx/gl/type";
import { MERGE_AT } from "./fx/gl/scenes";
import { Arrow, COMPANY, Footer, Nav } from "./site";

/* The page is a run of full-screen frames, like a title sequence. Each section opens with a burst of
   kinetic type (two lines on opposite edges, the clay object in the open band between them), cut on the
   scroll beat, then lands on one rest frame that uses the whole breadth of the screen. No section puts
   copy in one column and media in the other. Phones get their own stacked layouts. */

/* ---------- small pieces ---------- */

function Visit({ href, children, internal = false, light = false }: { href: string; children: React.ReactNode; internal?: boolean; light?: boolean }) {
  const cls = `group inline-flex items-center gap-2 border-b-2 pb-1 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:text-orange ${light ? "border-paper" : "border-ink"}`;
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

/** The name across the full width of the screen, under the nav. */
function Mast({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`pointer-events-none absolute inset-x-0 top-[72px] whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(16vw,19svh)] font-extrabold leading-[0.8] tracking-[-0.06em] md:top-[78px] ${className}`}>
      {children}
    </h2>
  );
}

/* ---------- content ---------- */

const HERO_FRAMES: Frame[] = [
  { top: "AI", bottom: "PRODUCTS", bg: "cobalt", fg: "paper" },
  { top: "FOR", bottom: "PEOPLE", bg: "lemon", fg: "ink" },
  { top: "WHO", bottom: "NEVER", bg: "orange", fg: "ink" },
  { top: "ASKED", bottom: "FOR AI.", bg: "ink", fg: "lemon" },
];

const ADF_FRAMES: Frame[] = [
  { top: "A WORLD", bottom: "OF NATIONS", bg: "ink", fg: "lemon" },
  { top: "RUN", bottom: "BY AI", bg: "paper", fg: "cobalt" },
  { top: "NO", bottom: "WALLET", bg: "ink", fg: "orange" },
  { top: "JUST AN", bottom: "EMAIL.", bg: "paper", fg: "ink" },
];

const FUG_FRAMES: Frame[] = [
  { top: "SHE", bottom: "DID IT.", bg: "lemon", fg: "ink" },
  { top: "TRAFFICKING.", bottom: "MURDER.", bg: "paper", fg: "red" },
  { top: "CULTS.", bottom: "TERROR.", bg: "lemon", fg: "red" },
  { top: "18", bottom: "WOMEN", bg: "paper", fg: "ink" },
  { top: "EUROPOL'S", bottom: "MOST WANTED", bg: "lemon", fg: "ink" },
];

/* one frame per key press: the phone dials as the glyphs cut */
const MELAX_FRAMES: Frame[] = [
  { glyph: "#", bg: "cobalt", fg: "paper" },
  { glyph: "2", bg: "orange", fg: "ink" },
  { glyph: "5", bg: "ink", fg: "lemon" },
  { glyph: "8", bg: "paper", fg: "orange" },
  { glyph: "0", bg: "cobalt", fg: "lemon" },
  { glyph: "#", bg: "ink", fg: "paper" },
  { top: "NO", bottom: "APP.", bg: "orange", fg: "ink" },
  { top: "NO", bottom: "INTERNET.", bg: "cobalt", fg: "paper" },
];

const NAME_FRAMES: Frame[] = [
  { top: "ONENESS", bottom: "CONCEPT.", bg: "cobalt", fg: "paper" },
  { top: "WE RISE BY", bottom: "LIFTING OTHERS.", bg: "lemon", fg: "ink" },
];

const PRODUCTS: { scene: "adfontes" | "fugitiva" | "melax"; name: string; line: string; href: string }[] = [
  { scene: "adfontes", name: "AD FONTES", line: "a blockchain game you start with an email", href: "#work" },
  { scene: "fugitiva", name: "FUGITIVA", line: "case files on the crimes nobody expects from a woman", href: "#fugitiva" },
  { scene: "melax", name: "Melax", line: "bitcoin on a phone with buttons", href: "#melax" },
];

const FILE: [string, string][] = [
  ["The facts", "flat, each one with its source"],
  ["Open eyes", "did she go in knowing"],
  ["The read", "an opinion, argued from the record"],
  ["Where it stands", "caught, sentenced or still out there"],
  ["Sources", "linked, so you can check us"],
];

const MERGED: { repo: string; pr: string; href: string; what: string; date: string }[] = [
  { repo: "datahub-project/datahub", pr: "#19115", href: "https://github.com/datahub-project/datahub/pull/19115", what: "Incidents on a single column, not only a whole dataset.", date: "20 Aug 2026" },
  { repo: "datahub-project/datahub", pr: "#19405", href: "https://github.com/datahub-project/datahub/pull/19405", what: "Their permission check runs against the parent dataset, where access rules live.", date: "24 Aug 2026" },
  { repo: "CALLE-AI/awesome-phone-call-agents", pr: "#337", href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/337", what: "Reads what really happened to a phone call, not just the status field.", date: "11 Sep 2026" },
  { repo: "google/adk-python", pr: "#6935", href: "https://github.com/google/adk-python/pull/6935", what: "Tools in the wrong half of a custom model's config were quietly dropped. Fixed, with our founder as co-author.", date: "7 Nov 2026" },
];

const QUOTE =
  "The name comes from the oneness concept. I started building because I love bringing new things into existence. The longer I do it, the clearer it gets that the point is other people: what they love doing in their spare time, and what can make them money. We rise by lifting others.";

/* ---------- product detail blocks (rest frames: columns on desktop, a stack on phones) ---------- */

function AdfDetails() {
  return (
    <>
      <div>
        <span className="chip"><span className="live-dot" />Live · NEAR testnet</span>
        <p className="mt-3 font-display text-[min(2.2vw,4svh)] font-bold leading-[1.05] text-cobalt max-md:text-2xl">A blockchain game where you never see the blockchain.</p>
      </div>
      <p className="text-[15px] leading-relaxed">
        A world of small nations run by AI. Their citizens read real research papers, trade what they learn and sometimes go to war. You fund one and become its god. Underneath there are DAOs, agent wallets and a contract that seals every turn. On screen you sign up with an email and give grace.
      </p>
      <div className="flex flex-col items-start gap-4">
        <p className="font-mono text-xs leading-5">email to start · 0 wallet popups · a 3D world map</p>
        <Visit href="https://adfontes.fun">adfontes.fun</Visit>
      </div>
    </>
  );
}

function FugDetails() {
  return (
    <>
      <div>
        <span className="chip"><span className="live-dot" />Live · fugitiva.onenept.com</span>
        <p className="mt-3 font-display text-[min(2.2vw,4svh)] font-bold leading-[1.05] text-red max-md:text-2xl">The crimes nobody expects from a woman.</p>
      </div>
      <p className="text-[15px] leading-relaxed">
        A journal of case files on women behind the crimes people assume men commit. File 01 is the 18 women on Europol&apos;s 2019 most wanted list: what each one did, and where she is now. No glamour.
      </p>
      <div className="flex flex-col items-start gap-4">
        <ol className="space-y-0.5 font-mono text-[11px] leading-5">
          {FILE.map(([n, j]) => (
            <li key={n}><span className="font-medium">{n}</span> <span className="text-mute">{j}</span></li>
          ))}
        </ol>
        <Visit href="https://fugitiva.onenept.com">read file 01</Visit>
      </div>
    </>
  );
}

function MelaxDetails() {
  return (
    <>
      <div>
        <span className="chip">Learning project · not deployed</span>
        <p className="mt-3 font-display text-[min(2.2vw,4svh)] font-bold leading-[1.05] text-orange max-md:text-2xl">Bitcoin for the phone you already have.</p>
      </div>
      <p className="text-[15px] leading-relaxed">
        Dial #2580# and a menu opens, in Wolof, French or English. No app, no internet. Under the menu it&apos;s Lightning and Cashu, and a local agent swaps francs for sats with you. It runs on a test network on one machine, and the repo says so up front.
      </p>
      <div className="flex flex-col items-start gap-4">
        <p className="font-mono text-[11px] leading-5">1 Balance · 2 Send · 3 Receive · 4 Pay a shop · 5 Cash in · 6 Cash out</p>
        <Visit href="https://github.com/cnpierrepapi/melax">the code on GitHub</Visit>
      </div>
    </>
  );
}

/** One product: a burst of frames, then the rest frame with the name across the top and the details
 *  in three columns across the bottom. On phones the details follow the scene as a normal stack. */
function Chapter({ id, scene, frames, restFrom, fit, name, nameClass, details }: {
  id: string; scene: "adfontes" | "fugitiva" | "melax"; frames: Frame[]; restFrom: number; fit: number;
  name: string; nameClass: string; details: React.ReactNode;
}) {
  return (
    <>
      <article id={id} data-track className="relative h-[330vh] scroll-mt-0" aria-label={name}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <GLSlot scene={scene} frames={frames} restFrom={restFrom} fit={fit} className="absolute inset-0" />
          <Mast className={nameClass}>
            <span data-at={String(restFrom + 0.04)} data-cut className="block">{name}</span>
          </Mast>
          <div className="absolute inset-x-0 bottom-0 hidden grid-cols-3 gap-[4vw] px-[3.5vmin] pb-7 md:grid" data-at={String(restFrom + 0.1)}>
            {details}
          </div>
        </div>
      </article>
      <div className="flex flex-col gap-6 px-5 pb-20 pt-4 md:hidden">{details}</div>
    </>
  );
}

/* ---------- the page ---------- */

export default function Home() {
  return (
    <div className="relative">
      <Nav />

      <main className="relative z-10">
        {/* 1. hero: the knot tangles on every cut, then sinks through the paper and the door rises */}
        <section data-track className="relative h-[360vh]" aria-labelledby="hero-title">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <GLSlot scene="hero" frames={HERO_FRAMES} restFrom={0.5} fit={1.65} className="absolute inset-0" />
            <h1 id="hero-title" className="sr-only">AI products for people who never asked for AI.</h1>
            <p className="gl-off-only absolute inset-x-0 top-[24svh] px-[3.5vmin] font-display text-[min(12vw,16svh)] font-extrabold leading-[0.85] tracking-[-0.06em]" aria-hidden="true">
              AI products for people who never asked for AI.
            </p>
            <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity" data-until="0.04" aria-hidden="true">
              scroll
            </p>
            {/* rest frame: WE BUILD along the top edge, THE DOOR. along the bottom, the door between */}
            <p className="pointer-events-none absolute left-0 right-0 top-[72px] whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(15vw,15svh)] font-extrabold leading-[0.8] tracking-[-0.06em] md:top-[78px] md:text-left" data-at="0.6" data-cut aria-hidden="true">
              WE BUILD
            </p>
            <p className="pointer-events-none absolute bottom-[5svh] left-0 right-0 whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(15vw,15svh)] font-extrabold leading-[0.8] tracking-[-0.06em] text-orange md:bottom-6 md:text-right" data-at="0.66" data-cut aria-hidden="true">
              THE DOOR.
            </p>
            <div className="absolute right-[3.5vmin] top-[80px] hidden w-[min(30vw,26rem)] md:block" data-at="0.74">
              <p className="text-[15px] leading-relaxed">
                We hide the plumbing. Models, wallets, tokens and APIs stay under the floor. What&apos;s left on the screen is something you can use in the first thirty seconds.
              </p>
            </div>
            <ul className="absolute bottom-7 left-[3.5vmin] hidden flex-col items-start gap-2 md:flex" aria-label="What we've built" data-at="0.8">
              {PRODUCTS.map((p) => (
                <li key={p.scene}>
                  <a href={p.href} title={p.line} className="group flex items-center gap-2 rounded-full border-2 border-ink py-1 pl-1 pr-4 transition-transform hover:translate-x-1">
                    <GLSlot scene={p.scene} icon className="h-10 w-10 shrink-0 rounded-full" />
                    <span className="font-display text-sm font-extrabold tracking-[-0.02em]">{p.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <div className="px-5 pb-16 md:hidden">
          <p className="text-base leading-relaxed">
            We hide the plumbing. Models, wallets, tokens and APIs stay under the floor. What&apos;s left on the screen is something you can use in the first thirty seconds.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="What we've built">
            {PRODUCTS.map((p) => (
              <li key={p.scene}>
                <a href={p.href} className="flex items-center rounded-full border-2 border-ink px-4 py-2 font-display text-sm font-extrabold">{p.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. the line: one sentence slides across the whole width, then cuts to ink for the turn */}
        <section data-track className="relative h-[300vh]" aria-label="What we do">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(30vw,40svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[24svh]" data-slide="0,0.48">
              Most AI products work.
            </p>
            <div className="absolute inset-0 flex items-center bg-ink text-lemon" data-at="0.5" data-cut>
              <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(30vw,40svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[24svh]" data-slide="0.5,0.9">
                Most people still can&apos;t use them.
              </p>
              <p className="absolute bottom-6 left-[3.5vmin] right-[3.5vmin] max-w-2xl text-base leading-relaxed text-paper md:text-lg" data-at="0.86">
                A blockchain game asks for a wallet before you&apos;ve seen anything. A bitcoin wallet assumes a smartphone and data. The clever part is done, and the person in front of it is stuck at the door. We build the door.
              </p>
            </div>
          </div>
        </section>

        {/* 3. the work: three products, each a burst of frames and one rest frame */}
        <div id="work" className="scroll-mt-0">
          <Chapter id="adfontes" scene="adfontes" frames={ADF_FRAMES} restFrom={0.5} fit={1.7} name="AD FONTES" nameClass="text-ink" details={<AdfDetails />} />
          <Chapter id="fugitiva" scene="fugitiva" frames={FUG_FRAMES} restFrom={0.55} fit={1.9} name="FUGITIVA" nameClass="text-red" details={<FugDetails />} />
          <Chapter id="melax" scene="melax" frames={MELAX_FRAMES} restFrom={0.62} fit={1.9} name="MELAX" nameClass="text-orange" details={<MelaxDetails />} />
        </div>

        {/* 4. merged upstream: the trunk runs edge to edge, each PR number lands as its branch merges */}
        <section id="open-source" data-track className="relative h-[240vh] scroll-mt-0">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <GLSlot scene="merge" className="absolute inset-x-0 top-[24svh] h-[36svh] md:top-[26svh] md:h-[40svh]" />
            <h2 className="pointer-events-none absolute inset-x-0 top-[72px] whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(11vw,15svh)] font-extrabold leading-[0.85] tracking-[-0.06em] md:top-[78px]" data-at="0.01">
              Merged upstream.
            </h2>
            <ol className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-x-[4vw] gap-y-4 px-[3.5vmin] pb-6 md:grid-cols-4">
              {MERGED.map((m, i) => (
                <li key={m.pr + m.repo} data-at={String(MERGE_AT[i])} data-cut>
                  <a href={m.href} target="_blank" rel="noopener noreferrer" className="group block">
                    <p className="font-display text-[min(7vw,10svh)] font-extrabold leading-none tracking-[-0.05em] group-hover:text-orange max-md:text-4xl">{m.pr}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-orange">Merged {m.date}</p>
                    <p className="mt-1 font-mono text-[10px] text-mute">{m.repo}</p>
                    <p className="mt-2 hidden text-sm leading-snug md:block [@media(max-height:720px)]:hidden">{m.what}</p>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. the company: two frames of the founder's line, then the cobalt rest frame */}
        <section id="company" data-track className="relative h-[260vh] scroll-mt-0 text-paper">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <GLSlot scene="type" frames={NAME_FRAMES} restFrom={0.4} restBg="cobalt" className="absolute inset-0" />
            <div className="absolute inset-x-0 top-[80px] px-[3.5vmin]" data-at="0.44">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-lemon">Why onenept</p>
              <blockquote className="mt-4">
                <p className="font-display text-[min(3.6vw,5.4svh)] font-bold leading-[1.08] tracking-[-0.02em] max-md:text-[min(6.4vw,3.6svh)]">{QUOTE}</p>
                <footer className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-lemon">{COMPANY.founder}, founder</footer>
              </blockquote>
            </div>
            <div className="absolute inset-x-0 bottom-0 hidden grid-cols-4 items-end gap-[4vw] px-[3.5vmin] pb-7 font-mono text-sm md:grid" data-at="0.56">
              <p className="font-display text-[min(3vw,5svh)] font-extrabold leading-[0.9] tracking-[-0.04em]">Onenept Studios Inc.</p>
              <p><span className="block text-[10px] uppercase tracking-[0.18em] text-lemon">Entity</span>{COMPANY.kind}</p>
              <p><span className="block text-[10px] uppercase tracking-[0.18em] text-lemon">Address</span>{COMPANY.street}, {COMPANY.city}, {COMPANY.country}</p>
              <Link href="/emmanuel" data-shutter className="group inline-flex items-center gap-3 justify-self-start rounded-full bg-paper py-1.5 pl-1.5 pr-5 font-sans text-ink">
                <Image src="/founder.jpg" alt="" width={44} height={44} sizes="44px" className="h-11 w-11 rounded-full object-cover object-top" />
                <span className="leading-tight"><span className="block font-display font-extrabold">{COMPANY.founder}</span><span className="text-xs">Founder and design engineer</span></span>
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
        <div className="flex flex-col gap-6 bg-cobalt px-5 py-12 text-paper md:hidden">
          <p className="font-mono text-sm">{COMPANY.legal} · {COMPANY.kind}<br />{COMPANY.street}, {COMPANY.city}, {COMPANY.country}</p>
          <Link href="/emmanuel" data-shutter className="inline-flex items-center gap-3 self-start rounded-full bg-paper py-1.5 pl-1.5 pr-5 text-ink">
            <Image src="/founder.jpg" alt="" width={44} height={44} sizes="44px" className="h-11 w-11 rounded-full object-cover object-top" />
            <span className="font-display font-extrabold">{COMPANY.founder}</span>
            <Arrow className="h-4 w-4" />
          </Link>
        </div>

        {/* 6. contact: the address set across the whole width */}
        <section className="relative overflow-hidden">
          <div className="px-[3.5vmin] py-24 md:py-36">
            <p className="font-display text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-5xl" data-fly>
              Got an AI product people keep bouncing off?
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              data-magnetic
              className="mt-8 block whitespace-nowrap font-display text-[11.4vw] font-extrabold leading-none tracking-[-0.065em] max-md:text-[9.4vw] transition-colors hover:text-orange"
            >
              {COMPANY.email}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
