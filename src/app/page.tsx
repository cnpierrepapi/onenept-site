import Image from "next/image";
import Link from "next/link";
import GLSlot from "./fx/GLSlot";
import type { Frame } from "./fx/gl/type";
import { MERGE_AT } from "./fx/gl/scenes";
import { Arrow, COMPANY, Footer, Nav } from "./site";

/* The page is a run of full-screen frames, like a title sequence. Each section opens with a burst of
   kinetic type (two lines on opposite edges, the clay object in the open band between them), cut on the
   scroll beat, then lands on one rest frame that uses the whole breadth of the screen. No section puts
   copy in one column and media in the other. Phones get their own stacked layouts.
   Onenept is three parts (22 Nov 2026): platforms, real-life games, stories. One chapter each. */

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
  { top: "WE BUILD", bottom: "PLATFORMS.", bg: "cobalt", fg: "paper" },
  { top: "WE RUN", bottom: "REAL-LIFE GAMES.", bg: "lemon", fg: "ink" },
  { top: "WE TELL", bottom: "STORIES.", bg: "orange", fg: "ink" },
  { top: "ONE", bottom: "COMPANY.", bg: "ink", fg: "lemon" },
];

const PLATFORM_FRAMES: Frame[] = [
  { top: "WRITERS.", bottom: "DESIGNERS.", bg: "ink", fg: "lemon" },
  { top: "TASTE", bottom: "GETS HIRED.", bg: "paper", fg: "cobalt" },
  { top: "GAMES", bottom: "FOR EVERYONE.", bg: "ink", fg: "orange" },
  { top: "YOU TALK.", bottom: "IT REMEMBERS.", bg: "paper", fg: "ink" },
];

const GAME_FRAMES: Frame[] = [
  { top: "THE", bottom: "COME UP.", bg: "lemon", fg: "ink" },
  { top: "REAL TASKS.", bottom: "REAL STREETS.", bg: "cobalt", fg: "lemon" },
  { top: "YOU VOTE.", bottom: "YOU CALL IT.", bg: "orange", fg: "ink" },
  { top: "SPOT", bottom: "HER.", bg: "ink", fg: "lemon" },
];

const STORY_FRAMES: Frame[] = [
  { top: "SUPERNATURAL", bottom: "GENTLEMEN.", bg: "ink", fg: "lemon" },
  { top: "VANITY", bottom: "HORROR.", bg: "paper", fg: "orange" },
  { top: "OLD", bottom: "FOLKLORE.", bg: "cobalt", fg: "paper" },
  { top: "DONE", bottom: "RIGHT.", bg: "orange", fg: "ink" },
];

const NAME_FRAMES: Frame[] = [
  { top: "ONENESS", bottom: "CONCEPT.", bg: "cobalt", fg: "paper" },
  { top: "WE RISE BY", bottom: "LIFTING OTHERS.", bg: "lemon", fg: "ink" },
];

type PartScene = "platforms" | "streets" | "series";
const PARTS: { scene: PartScene; name: string; line: string; href: string }[] = [
  { scene: "platforms", name: "PLATFORMS", line: "Warmleads, Folofolo and SYZYGY", href: "#platforms" },
  { scene: "streets", name: "REAL-LIFE GAMES", line: "The Come Up and Spot Her", href: "#real-life-games" },
  { scene: "series", name: "STORIES", line: "League of Supernatural Gentlemen", href: "#stories" },
];

const MERGED: { repo: string; pr: string; href: string; what: string; date: string }[] = [
  { repo: "datahub-project/datahub", pr: "#19115", href: "https://github.com/datahub-project/datahub/pull/19115", what: "Incidents on a single column, not only a whole dataset.", date: "20 Aug 2026" },
  { repo: "datahub-project/datahub", pr: "#19405", href: "https://github.com/datahub-project/datahub/pull/19405", what: "Their permission check runs against the parent dataset, where access rules live.", date: "24 Aug 2026" },
  { repo: "CALLE-AI/awesome-phone-call-agents", pr: "#337", href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/337", what: "Reads what really happened to a phone call, not just the status field.", date: "11 Sep 2026" },
  { repo: "google/adk-python", pr: "#6935", href: "https://github.com/google/adk-python/pull/6935", what: "Tools in the wrong half of a custom model's config were quietly dropped. Fixed, with our founder as co-author.", date: "7 Nov 2026" },
];

const QUOTE =
  "The name comes from the oneness concept. I started building because I love bringing new things into existence. The longer I do it, the clearer it gets that the point is other people: what they love doing in their spare time, and what can make them money. We rise by lifting others.";

const INTRO =
  "Onenept is three things under one roof. Platforms where people earn. Games that happen out in the real world and lead people to those platforms. And stories, starting with a live-action series.";

/* ---------- detail blocks (rest frames: columns on desktop, a stack on phones) ---------- */

function Col({ chip, title, titleClass = "text-cobalt", children, foot }: { chip: string; title: string; titleClass?: string; children: React.ReactNode; foot?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="chip">{chip}</span>
      <p className={`font-display text-[min(2vw,3.6svh)] font-bold leading-[1.05] max-md:text-2xl ${titleClass}`}>{title}</p>
      <p className="text-[14px] leading-relaxed [@media(max-height:760px)]:text-[13px]">{children}</p>
      {foot}
    </div>
  );
}

function PlatformDetails() {
  return (
    <>
      <Col chip="Rebuilding" title="Warmleads" foot={<Visit href="https://warmleads.app">warmleads.app</Visit>}>
        A marketplace for content writers and graphic designers, with voice actors later. Use AI if you like. The job goes to whoever has the better eye. You pay for connects, and a subscription gets you first dibs on new listings.
      </Col>
      <Col chip="In the works" title="Folofolo" titleClass="text-orange">
        Where our games live. Hopium Highway, a kart race on roads built from the trades of big coins like DOGE, ETH and SOL. First Discovery, a puzzle where the wrong combo costs you. Area Boss, tower defence against an AI that posts new bounties every day. Free to play. Bid if you want in first.
      </Col>
      <Col chip="In the works" title="SYZYGY" titleClass="text-ink">
        A companion for women that actually remembers what you told it last week, and last month. It reads the stars with you too: your sign, your chart, what the week is shaping up to be.
      </Col>
    </>
  );
}

function GameDetails() {
  return (
    <>
      <Col chip="Coming" title="The Come Up">
        Everyday people take on real tasks out in the world to pay off their debts. Everyone else votes on what they do next, and calls whether they&apos;ll actually pull it off.
      </Col>
      <Col chip="Coming" title="Spot Her" titleClass="text-orange">
        The next one. It plays out online and off, and we&apos;ll say more when it starts.
      </Col>
      <Col chip="How they connect" title="Every road leads home" titleClass="text-ink">
        Missions inside both games run through Warmleads, Folofolo and SYZYGY. Play one and you end up on the others.
      </Col>
    </>
  );
}

function StoryDetails() {
  return (
    <>
      <Col chip="In development · live action" title="League of Supernatural Gentlemen">
        Our first series. James Bond walks into the Twilight Zone. African folklore and urban legends, done properly for once.
      </Col>
      <Col chip="The genre" title="Vanity horror" titleClass="text-orange">
        That&apos;s what we call it. Think American Horror Story, except the monsters are the ones your grandmother warned you about.
      </Col>
      <Col chip="Next" title="More stories" titleClass="text-ink">
        LSG is the first. Whatever comes after it, we make it and we keep it.
      </Col>
    </>
  );
}

/** One part: a burst of frames, then the rest frame with the name across the top and the details
 *  in three columns across the bottom. On phones the details follow the scene as a normal stack. */
function Chapter({ id, scene, frames, restFrom, fit, name, nameClass, details }: {
  id: string; scene: PartScene; frames: Frame[]; restFrom: number; fit: number;
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
      <div className="flex flex-col gap-8 px-5 pb-20 pt-4 md:hidden">{details}</div>
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
            <h1 id="hero-title" className="sr-only">Onenept builds platforms, runs real-life games and tells stories.</h1>
            <p className="gl-off-only absolute inset-x-0 top-[24svh] px-[3.5vmin] font-display text-[min(12vw,16svh)] font-extrabold leading-[0.85] tracking-[-0.06em]" aria-hidden="true">
              Platforms, real-life games and stories.
            </p>
            <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity" data-until="0.04" aria-hidden="true">
              scroll
            </p>
            {/* rest frame: COME along the top edge, ON IN. along the bottom, the door between */}
            <p className="pointer-events-none absolute left-0 right-0 top-[72px] whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(15vw,15svh)] font-extrabold leading-[0.8] tracking-[-0.06em] md:top-[78px] md:text-left" data-at="0.6" data-cut aria-hidden="true">
              COME
            </p>
            <p className="pointer-events-none absolute bottom-[5svh] left-0 right-0 whitespace-nowrap px-[3.5vmin] text-center font-display text-[min(15vw,15svh)] font-extrabold leading-[0.8] tracking-[-0.06em] text-orange md:bottom-6 md:text-right" data-at="0.66" data-cut aria-hidden="true">
              ON IN.
            </p>
            <div className="absolute right-[3.5vmin] top-[80px] hidden w-[min(30vw,26rem)] md:block" data-at="0.74">
              <p className="text-[15px] leading-relaxed">{INTRO}</p>
            </div>
            <ul className="absolute bottom-7 left-[3.5vmin] hidden flex-col items-start gap-2 md:flex" aria-label="The three parts" data-at="0.8">
              {PARTS.map((p) => (
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
          <p className="text-base leading-relaxed">{INTRO}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="The three parts">
            {PARTS.map((p) => (
              <li key={p.scene}>
                <a href={p.href} className="flex items-center rounded-full border-2 border-ink px-4 py-2 font-display text-sm font-extrabold">{p.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. the line: one sentence slides across the whole width, then cuts to ink for the turn */}
        <section data-track className="relative h-[300vh]" aria-label="Why three parts">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(30vw,40svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[24svh]" data-slide="0,0.48">
              People want to earn.
            </p>
            <div className="absolute inset-0 flex items-center bg-ink text-lemon" data-at="0.5" data-cut>
              <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(30vw,40svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[24svh]" data-slide="0.5,0.9">
                They want a good story too.
              </p>
              <p className="absolute bottom-6 left-[3.5vmin] right-[3.5vmin] max-w-2xl text-base leading-relaxed text-paper md:text-lg" data-at="0.86">
                So we do both. The platforms are where people make money. The games out in the real world send people to them. And what the platforms make goes into the shows.
              </p>
            </div>
          </div>
        </section>

        {/* 3. the three parts, each a burst of frames and one rest frame */}
        <div id="work" className="scroll-mt-0">
          <Chapter id="platforms" scene="platforms" frames={PLATFORM_FRAMES} restFrom={0.5} fit={1.6} name="PLATFORMS" nameClass="text-ink" details={<PlatformDetails />} />
          <Chapter id="real-life-games" scene="streets" frames={GAME_FRAMES} restFrom={0.5} fit={1.5} name="REAL-LIFE GAMES" nameClass="text-cobalt text-[min(10vw,17svh)]" details={<GameDetails />} />
          <Chapter id="stories" scene="series" frames={STORY_FRAMES} restFrom={0.5} fit={1.7} name="STORIES" nameClass="text-orange" details={<StoryDetails />} />
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
              Want in on any of it? Say hello.
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
