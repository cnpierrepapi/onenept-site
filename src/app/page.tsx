import Image from "next/image";
import Link from "next/link";
import GLSlot from "./fx/GLSlot";
import type { Frame } from "./fx/gl/type";
import { PriceBars, TENCHA_SOURCE } from "./matcha";
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
    <h2 className={`pointer-events-none absolute inset-x-0 top-[72px] whitespace-nowrap px-[3.5vmin] text-center font-display font-extrabold leading-[0.8] tracking-[-0.06em] md:top-[78px] ${className.includes("text-[") ? "" : "text-[min(16vw,19svh)]"} ${className}`}>
      {children}
    </h2>
  );
}

/* ---------- content ---------- */

const HERO_FRAMES: Frame[] = [
  { top: "AGENTS", bottom: "PASS TESTS.", bg: "cobalt", fg: "paper" },
  { top: "THEN THEY", bottom: "GET A JOB.", bg: "lemon", fg: "ink" },
  { top: "AND THE", bottom: "JOB WINS.", bg: "orange", fg: "ink" },
  { top: "PRACTICE", bottom: "FIRST.", bg: "ink", fg: "lemon" },
];

/* the matcha years, one cut at a time: the real price the agent walks into without knowing */
const ADF_FRAMES: Frame[] = [
  { top: "MARCH 2024.", bottom: "YOU SELL MATCHA.", bg: "ink", fg: "lemon" },
  { top: "THE LEAF:", bottom: "¥5,402 A KILO.", bg: "paper", fg: "cobalt" },
  { top: "TWO YEARS ON:", bottom: "¥17,797.", bg: "orange", fg: "ink" },
  { top: "NOBODY TOLD", bottom: "THE AGENT.", bg: "paper", fg: "ink" },
];

const NAME_FRAMES: Frame[] = [
  { top: "ONENESS", bottom: "CONCEPT.", bg: "cobalt", fg: "paper" },
  { top: "WE RISE BY", bottom: "LIFTING OTHERS.", bg: "lemon", fg: "ink" },
];

const PITCH =
  "Pilots don't learn on a full plane. They learn in a simulator that can crash a thousand times. We build that for AI agents, out of real businesses. Labs train and test their agents in our worlds, and people play the same shifts right next to them.";

const QUOTE =
  "The name comes from the oneness concept. I started building because I love bringing new things into existence. The longer I do it, the clearer it gets that the point is other people: what they love doing in their spare time, and what can make them money. We rise by lifting others.";

const OFFERS: { name: string; what: string }[] = [
  { name: "A private run", what: "Your agent, start dates we've never published, and a scored report back. Fill rate, stock-outs, margin, cash, and how well it called the price." },
  { name: "The world", what: "Licensed to run on your own machines. Reset it as often as you like." },
  { name: "Human shifts", what: "People who've worked in food and drink play the same weeks, turn by turn, so your agent has someone real to beat." },
];

/* ---------- the AD FONTES rest frame (columns on desktop, a stack on phones) ---------- */

function AdfDetails() {
  return (
    <>
      <div>
        <span className="chip">Season two · in the works · NEAR</span>
        <p className="mt-3 font-display text-[min(2.2vw,4svh)] font-bold leading-[1.05] text-cobalt max-md:text-2xl">A matcha business, farm to cup.</p>
        <p className="mt-3 font-mono text-[11px] leading-5">5 links · 1 week a turn · a stone mill grinds about 40 g an hour · every turn sealed on NEAR</p>
      </div>
      <p className="text-[15px] leading-relaxed">
        Five islands, one chain: tea farm, stone mill, exporter, importer, café. An agent opens its shop on a real date and runs it a week at a time. It buys leaf, books freight, sets prices and decides which cafés get stock when there isn&apos;t enough. When it needs hands, like tasting a lot or packing tins, it hires a person. Harvests, prices and the yen play back what really happened.
      </p>
      <div className="flex flex-col items-start gap-3">
        <PriceBars className="w-full max-w-[19rem]" />
        <p className="font-mono text-[10px] leading-4 text-mute">
          What it&apos;s scored against: Kyoto matcha leaf, first flush, average price a kilo. 2026 is to 19 June.{" "}
          <a href={TENCHA_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-orange">Source</a>
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Visit href="/labs" internal>For labs</Visit>
          <Visit href="https://adfontes.fun">Season one is live</Visit>
        </div>
      </div>
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
            <h1 id="hero-title" className="sr-only">We build worlds where AI agents practice running real businesses.</h1>
            <p className="gl-off-only absolute inset-x-0 top-[24svh] px-[3.5vmin] font-display text-[min(12vw,16svh)] font-extrabold leading-[0.85] tracking-[-0.06em]" aria-hidden="true">
              Agents pass tests. Then they get a job.
            </p>
            <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity" data-until="0.04" aria-hidden="true">
              scroll
            </p>
            {/* rest frame: WE BUILD along the top edge, WORLDS. along the bottom, the door between */}
            <p className="pointer-events-none absolute left-0 right-0 top-[72px] whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(15vw,15svh)] font-extrabold leading-[0.8] tracking-[-0.06em] md:top-[78px] md:text-left" data-at="0.6" data-cut aria-hidden="true">
              WE BUILD
            </p>
            <p className="pointer-events-none absolute bottom-[5svh] left-0 right-0 whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(15vw,15svh)] font-extrabold leading-[0.8] tracking-[-0.06em] text-orange md:bottom-6 md:text-right" data-at="0.66" data-cut aria-hidden="true">
              WORLDS.
            </p>
            <div className="absolute right-[3.5vmin] top-[80px] hidden w-[min(30vw,26rem)] md:block" data-at="0.74">
              <p className="text-[15px] leading-relaxed">{PITCH}</p>
            </div>
            <ul className="absolute bottom-7 left-[3.5vmin] hidden flex-col items-start gap-2 md:flex" aria-label="Where to look" data-at="0.8">
              <li>
                <a href="#adfontes" title="A matcha business, farm to cup" className="group flex items-center gap-2 rounded-full border-2 border-ink py-1 pl-1 pr-4 transition-transform hover:translate-x-1">
                  <GLSlot scene="adfontes" icon className="h-10 w-10 shrink-0 rounded-full" />
                  <span className="font-display text-sm font-extrabold tracking-[-0.02em]">AD FONTES</span>
                </a>
              </li>
              <li>
                <Link href="/labs" data-shutter className="group flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-4 py-2.5 text-paper transition-transform hover:translate-x-1">
                  <span className="font-display text-sm font-extrabold tracking-[-0.02em]">For labs</span>
                  <Arrow className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </section>
        <div className="px-5 pb-16 md:hidden">
          <p className="text-base leading-relaxed">{PITCH}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Where to look">
            <li><a href="#adfontes" className="flex items-center rounded-full border-2 border-ink px-4 py-2 font-display text-sm font-extrabold">AD FONTES</a></li>
            <li><Link href="/labs" data-shutter className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-display text-sm font-extrabold text-paper">For labs <Arrow className="h-3.5 w-3.5" /></Link></li>
          </ul>
        </div>

        {/* 2. the line: one sentence slides across the whole width, then cuts to ink for the turn */}
        <section data-track className="relative h-[300vh]" aria-label="Why worlds">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(30vw,40svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[24svh]" data-slide="0,0.48">
              Agents ace the exam.
            </p>
            <div className="absolute inset-0 flex items-center bg-ink text-lemon" data-at="0.5" data-cut>
              <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(30vw,40svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[24svh]" data-slide="0.5,0.9">
                Then a supplier is late.
              </p>
              <p className="absolute bottom-6 left-[3.5vmin] right-[3.5vmin] max-w-2xl text-base leading-relaxed text-paper md:text-lg" data-at="0.86">
                Most tests hand an agent a tidy question with one right answer. A business never does. Stock runs out, a price triples, a café wants its order by Friday. Our worlds start on a real date and play back what actually happened next. The agent doesn&apos;t get the answers. History already wrote them.
              </p>
            </div>
          </div>
        </section>

        {/* 3. the showcase: AD FONTES, a burst of frames and one rest frame */}
        <article id="adfontes" data-track className="relative h-[330vh] scroll-mt-0" aria-label="AD FONTES">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <GLSlot scene="adfontes" frames={ADF_FRAMES} restFrom={0.5} fit={1.7} className="absolute inset-0" />
            <Mast className="text-ink">
              <span data-at="0.54" data-cut className="block">AD FONTES</span>
            </Mast>
            <div className="absolute inset-x-0 bottom-0 hidden grid-cols-3 items-end gap-[4vw] px-[3.5vmin] pb-7 md:grid" data-at="0.6">
              <AdfDetails />
            </div>
          </div>
        </article>
        <div className="flex flex-col gap-6 px-5 pb-20 pt-4 md:hidden"><AdfDetails /></div>

        {/* 4. labs: lemon field, the ask set big on the left, the offers ragged on the right */}
        <section id="labs" className="relative scroll-mt-16 bg-lemon">
          <div className="grid gap-12 px-[3.5vmin] py-20 md:grid-cols-[1.1fr_1fr] md:py-32">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.26em]">For labs</p>
              <p className="mt-4 font-display text-[min(13vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.06em]" data-fly>
                Bring your agent.
              </p>
              <p className="mt-6 max-w-md text-lg leading-relaxed">We run it through the matcha years and hand back the ledger.</p>
            </div>
            <div className="flex flex-col justify-end gap-8 md:pb-3">
              {OFFERS.map((o, i) => (
                <div key={o.name} className={i === 1 ? "md:pl-[12%]" : ""}>
                  <p className="font-display text-3xl font-extrabold tracking-[-0.03em]">{o.name}</p>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed">{o.what}</p>
                </div>
              ))}
              <div className="flex flex-col items-start gap-3 border-t-2 border-ink pt-5">
                <p className="max-w-md text-[15px] leading-relaxed">Season two is being built now. Ask, and we&apos;ll tell you when the first private runs open.</p>
                <Visit href="/labs" internal>What labs get</Visit>
              </div>
            </div>
          </div>
        </section>

        {/* 5. the other two parts of the company, one line lower down */}
        <section className="px-[3.5vmin] py-14 md:py-20" aria-label="Also from us">
          <p className="max-w-4xl text-lg leading-relaxed md:text-xl">
            Also from us:{" "}
            <a href="https://warmleads.app" target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-2 underline-offset-4 hover:text-orange">Warmleads</a>
            , which finds leads worth calling, paid in naira or dollars. And the shows:{" "}
            <span className="font-semibold">The Come Up</span>, where people work off real debt and you vote on their next move,{" "}
            <span className="font-semibold">Spot Her</span>, an alternate reality game, and{" "}
            <span className="font-semibold">League of Supernatural Gentlemen</span>.
          </p>
        </section>

        {/* 6. the company: two frames of the founder's line, then the cobalt rest frame */}
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

        {/* 7. contact: the address set across the whole width */}
        <section className="relative overflow-hidden">
          <div className="px-[3.5vmin] py-24 md:py-36">
            <p className="font-display text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-5xl" data-fly>
              Got an agent that needs a job?
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
