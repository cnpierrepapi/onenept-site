import Image from "next/image";
import Link from "next/link";
import Stage from "./gl/stage";
import Reveal from "./reveal";
import { Arrow, COMPANY, Footer, Nav } from "./site";

/* lines lifted from the products themselves, shown in the hero */
const TRACE: { who: string; line: string; tail: string }[] = [
  { who: "ad fontes", line: "Play with email", tail: "a funded account, no wallet popup" },
  { who: "melax", line: "#2580#", tail: "1 Balance · 2 Send · 3 Receive" },
  { who: "fugitiva", line: "File 01 · Europol, 2019", tail: "18 women, sources linked" },
];

/* what every FUGITIVA case file is made of, in order */
const FILE: [string, string][] = [
  ["The facts", "flat, each one with its source"],
  ["Open eyes", "did she go in knowing what she was doing"],
  ["The read", "an opinion, argued from the record"],
  ["Where it stands", "caught, sentenced or still out there"],
  ["Sources", "linked, so you can check us"],
];

const MERGED: { repo: string; pr: string; href: string; what: string; date: string; sha: string; shaHref: string }[] = [
  {
    repo: "google/adk-python",
    pr: "#6935",
    href: "https://github.com/google/adk-python/pull/6935",
    what: "A custom model in Google's Agent Development Kit got one config object holding fields for three different places, and putting the tools in the wrong one quietly dropped them. The fix hands the job to the converter Google's own client uses. Their team took it in with our founder as co-author.",
    date: "7 Nov 2026",
    sha: "9be86308a1",
    shaHref: "https://github.com/google/adk-python/commit/9be86308a1a1af769541165c9ff57d0ec095c68c",
  },
  {
    repo: "datahub-project/datahub",
    pr: "#19115",
    href: "https://github.com/datahub-project/datahub/pull/19115",
    what: "You can now raise an incident on a single column, not only on a whole dataset. The docs listed types the code didn't support, so we read the answer out of the source instead.",
    date: "20 Aug 2026",
    sha: "8c823661e6",
    shaHref: "https://github.com/datahub-project/datahub/commit/8c823661e6",
  },
  {
    repo: "datahub-project/datahub",
    pr: "#19405",
    href: "https://github.com/datahub-project/datahub/pull/19405",
    what: "The permission check for those column incidents. It now runs against the parent dataset, which is where the access rules actually live.",
    date: "24 Aug 2026",
    sha: "1eeb440e65",
    shaHref: "https://github.com/datahub-project/datahub/commit/1eeb440e65",
  },
  {
    repo: "CALLE-AI/awesome-phone-call-agents",
    pr: "#337",
    href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/337",
    what: "A call state reconciler. It reads what really happened to a phone call, because the status field alone can say done on a voicemail.",
    date: "11 Sep 2026",
    sha: "fc43128f2c",
    shaHref: "https://github.com/CALLE-AI/awesome-phone-call-agents/commit/fc43128f2c",
  },
];

function Chip({ live, children }: { live?: boolean; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/80">
      {live ? <span className="live-dot" /> : <span className="h-[7px] w-[7px] rounded-full border border-ice/70" />}
      {children}
    </span>
  );
}

function Visit({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 border-b border-cream/30 pb-1 font-mono text-xs tracking-[0.08em] text-cream transition-colors hover:border-signal hover:text-signal"
    >
      {children}
      <Arrow className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <Reveal />
      <Nav />

      {/* hero: the field fills the screen, words sit low and left */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Stage scene="field" className="absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_10%,rgb(59_91_255/0.28),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-night/25 lg:bg-transparent lg:bg-gradient-to-r lg:from-night/85 lg:via-night/30 lg:to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-night to-transparent" />

        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 pb-14 pt-32 sm:px-8 lg:grid-cols-12 lg:items-end lg:pb-20">
          <div className="min-w-0 lg:col-span-8">
            <p className="reveal font-mono text-[11px] uppercase tracking-[0.28em] text-ice/80">
              Onenept Studios · applied AI
            </p>
            <h1 className="reveal mt-6 font-display text-[12.5vw] font-extrabold leading-[0.88] tracking-[-0.045em] sm:text-[9vw] lg:text-[7.2vw] 2xl:text-[104px]">
              AI products
              <br />
              for people
              <br />
              <span className="text-glow">who never asked</span>
              <br />
              <span className="text-glow">for AI.</span>
            </h1>
            <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-cream/75 sm:text-xl">
              We hide the plumbing. Models, wallets, tokens and APIs stay under the floor. What&apos;s left on the screen is something you can use in the first thirty seconds.
            </p>
            <div className="reveal mt-9 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-night transition-colors hover:bg-cream"
              >
                Talk to us <Arrow />
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-cream transition-colors hover:border-cream"
              >
                See what we&apos;ve built
              </a>
            </div>
          </div>

          <aside className="reveal min-w-0 lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-mute">Straight from the products</p>
            <ol className="mt-4 space-y-3">
              {TRACE.map((r) => (
                <li key={r.who} className="glass rounded-xl px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">{r.who}</p>
                  <p className="mt-1 font-mono text-sm text-cream">{r.line}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-mute">{r.tail}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* what we do: two halves on purpose, one much bigger than the other */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-5 py-28 sm:px-8 sm:py-40">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="reveal font-mono text-[11px] uppercase tracking-[0.28em] text-mute">What we do</p>
            <h2 className="reveal mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              Most AI products work. Most people still can&apos;t use them.
            </h2>
            <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-cream/70">
              A blockchain game asks for a wallet before you&apos;ve seen anything. A bitcoin wallet assumes a smartphone and data. Every time, the clever part is done and the person in front of it gets stuck at the door. We build the door.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-56">
            <div className="reveal border-l-2 border-signal pl-6">
              <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                And we say what&apos;s real.
              </h3>
              <p className="mt-4 leading-relaxed text-cream/65">
                Every product says what works and what doesn&apos;t yet. When a platform we build on turns out to be wrong, we send the fix back. Four of those are merged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* work */}
      <section id="work" className="relative z-10 scroll-mt-20">
        <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 sm:px-8">
          <h2 className="reveal font-display text-[15vw] font-extrabold leading-[0.8] tracking-[-0.05em] text-cream/95 sm:text-[11vw] lg:text-[150px]">
            Built
          </h2>
          <p className="reveal hidden pb-3 text-right font-mono text-[11px] uppercase leading-6 tracking-[0.2em] text-mute sm:block">
            3 products
            <br />2 live
          </p>
        </div>
        <div className="hairline mx-auto mt-10 max-w-[1400px]" />

        {/* 01 ad fontes: wide, the globe bleeds off the right edge */}
        <article className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(50%_60%_at_80%_50%,rgb(59_91_255/0.22),transparent_70%)]" />
          <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-5 py-20 sm:px-8 lg:min-h-[88vh] lg:grid-cols-12 lg:py-10">
            <div className="relative z-10 lg:col-span-5">
              <div className="reveal flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-mute">01</span>
                <Chip live>Live · NEAR testnet</Chip>
              </div>
              <h3 className="reveal mt-6 font-display text-[16vw] font-extrabold tracking-[-0.04em] sm:text-8xl">AD FONTES</h3>
              <p className="reveal mt-4 font-display text-2xl font-medium leading-snug text-ice sm:text-3xl">
                A blockchain game where you never see the blockchain.
              </p>
              <p className="reveal mt-6 max-w-md leading-relaxed text-cream/70">
                A world of small nations run by AI. Their citizens read real research papers, trade what they learn and sometimes go to war. You fund one and become its god. Underneath there are DAOs, agent wallets and a contract that seals every turn. On screen you sign up with an email and give grace. That&apos;s it.
              </p>
              <dl className="reveal mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {[
                  ["email", "to start"],
                  ["0", "wallet popups"],
                  ["3D", "world map"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="font-display text-2xl font-bold sm:text-3xl">{v}</dt>
                    <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{k}</dd>
                  </div>
                ))}
              </dl>
              <div className="reveal mt-9">
                <Visit href="https://adfontes.fun">adfontes.fun</Visit>
              </div>
            </div>
            <div className="relative h-[78vh] min-h-[520px] lg:col-span-7 lg:h-[88vh] lg:min-h-0">
              <Stage scene="globe" className="absolute -left-[10%] -right-[25%] bottom-[22%] top-0 sm:inset-y-0 lg:-right-[35%]" />
              <div className="reveal glass absolute bottom-0 left-0 w-[min(320px,92%)] rounded-2xl p-5 sm:bottom-14 sm:left-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">How you start</p>
                <p className="mt-3 rounded-lg border border-white/15 px-3 py-2 font-mono text-[12px] text-cream/50">you@email.com</p>
                <p className="mt-3 rounded-full bg-signal px-4 py-2 text-center text-sm font-semibold text-night">Play with email</p>
                <p className="mt-4 font-mono text-[11px] leading-5 text-cream/55">
                  A funded account gets made for you. No wallet, no seed phrase, no popups.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* 02 fugitiva: reversed, tall stage on the left, the case file on the right */}
        <article className="relative isolate overflow-hidden border-y border-white/10 bg-deep">
          <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-0">
            <div className="relative order-2 h-[58vh] min-h-[360px] lg:order-1 lg:col-span-7 lg:h-[96vh]">
              <Stage scene="orbits" className="absolute inset-0 lg:-left-[18%]" />
            </div>
            <div className="order-1 lg:order-2 lg:col-span-5 lg:py-24">
              <div className="reveal flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-mute">02</span>
                <Chip live>Live · fugitiva.onenept.com</Chip>
              </div>
              <h3 className="reveal mt-6 font-display text-[16vw] font-extrabold tracking-[-0.04em] sm:text-8xl">FUGITIVA</h3>
              <p className="reveal mt-4 font-display text-2xl font-medium leading-snug text-violet sm:text-3xl">
                The crimes nobody expects from a woman.
              </p>
              <p className="reveal mt-6 leading-relaxed text-cream/70">
                A journal of case files on women behind the crimes people assume men commit. File 01 is the 18 women on Europol&apos;s 2019 most wanted list: what each one did, and where she is now.
              </p>
              <ol className="reveal relative mt-8 space-y-0 border-l border-white/15 pl-6">
                {FILE.map(([name, job], k) => (
                  <li key={name} className="relative py-2">
                    <span
                      className={`absolute -left-[29px] top-[14px] h-2.5 w-2.5 rounded-full ${
                        k === FILE.length - 1 ? "bg-signal" : "border border-ice/60 bg-deep"
                      }`}
                    />
                    <p className="text-sm">
                      <span className="font-mono text-ice">{name}</span>
                      <span className="text-cream/55"> {job}</span>
                    </p>
                  </li>
                ))}
              </ol>
              <p className="reveal mt-6 font-mono text-[11px] leading-5 text-mute">
                No glamour. Every case file runs in that order.
              </p>
              <div className="reveal mt-8">
                <Visit href="https://fugitiva.onenept.com">read file 01</Visit>
              </div>
            </div>
          </div>
        </article>

        {/* 03 melax: a full-bleed band, the signal behind the words */}
        <article className="relative isolate overflow-hidden">
          <Stage scene="wave" className="absolute inset-0 -z-10 opacity-90" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/10" />
          <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-28 sm:px-8 lg:min-h-[86vh] lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="reveal flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-mute">03</span>
                <Chip>Learning project · not deployed</Chip>
              </div>
              <h3 className="reveal mt-6 font-display text-[16vw] font-extrabold tracking-[-0.04em] sm:text-8xl">Melax</h3>
              <p className="reveal mt-4 font-display text-2xl font-medium leading-snug text-signal sm:text-3xl">
                Bitcoin for the phone you already have.
              </p>
              <p className="reveal mt-6 max-w-lg leading-relaxed text-cream/70">
                Dial a short code and a menu opens, in Wolof, French or English. No app, no internet. Under the menu it&apos;s Lightning and Cashu, and a local agent swaps francs for sats with you. It runs on a test network on one machine, and the repo says so up front.
              </p>
              <div className="reveal mt-9">
                <Visit href="https://github.com/cnpierrepapi/melax">the code on GitHub</Visit>
              </div>
            </div>
            <div className="reveal lg:col-span-5 lg:col-start-8">
              <div className="glass grid grid-cols-2 overflow-hidden rounded-2xl font-mono text-xs">
                <div className="border-r border-white/10 p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-mute">You dial</p>
                  <p className="mt-4 font-display text-3xl font-semibold text-cream">#2580#</p>
                  <p className="mt-3 text-cream/55">on any phone with buttons</p>
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-signal">What opens</p>
                  <ul className="mt-4 space-y-1.5 text-cream/85">
                    <li>Melax</li>
                    <li>1 Balance</li>
                    <li>2 Send</li>
                    <li>3 Receive</li>
                    <li>4 Pay a shop</li>
                    <li>5 Cash in</li>
                    <li>6 Cash out</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 font-mono text-[11px] text-mute">The English menu. In Wolof, 1 is Sa xaalis.</p>
            </div>
          </div>
        </article>
      </section>

      {/* open source: merged only */}
      <section id="open-source" className="relative isolate z-10 scroll-mt-20 overflow-hidden border-t border-white/10">
        <div className="relative h-[42vh] min-h-[280px]">
          <Stage scene="merge" className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night to-transparent" />
        </div>
        <div className="mx-auto max-w-[1400px] px-5 pb-28 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <h2 className="reveal font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:col-span-7">
              Merged upstream.
            </h2>
            <p className="reveal max-w-md leading-relaxed text-cream/65 lg:col-span-5">
              Some of the work happens in other people&apos;s code. These four are in, reviewed and merged by the teams who own the projects.
            </p>
          </div>
          <ol className="mt-14 border-t border-white/15">
            {MERGED.map((m) => (
              <li key={m.pr + m.repo} className="reveal grid gap-4 border-b border-white/10 py-8 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-3">
                  <a href={m.href} target="_blank" rel="noopener noreferrer" className="group">
                    <p className="font-mono text-[11px] text-mute">{m.repo}</p>
                    <p className="mt-1 font-display text-3xl font-bold group-hover:text-signal">{m.pr}</p>
                  </a>
                </div>
                <p className="max-w-2xl leading-relaxed text-cream/75 lg:col-span-6">{m.what}</p>
                <div className="font-mono text-[11px] leading-6 lg:col-span-3 lg:text-right">
                  <p className="text-signal">MERGED {m.date.toUpperCase()}</p>
                  <a href={m.shaHref} target="_blank" rel="noopener noreferrer" className="text-mute underline decoration-white/20 underline-offset-4 hover:text-cream">
                    commit {m.sha}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* company: the one light section, breaks the night */}
      <section id="company" className="relative z-10 scroll-mt-16 bg-cream text-night">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="reveal font-mono text-[11px] uppercase tracking-[0.28em] text-night/55">The company</p>
            <h2 className="reveal mt-6 font-display text-5xl font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-7xl">
              Onenept
              <br />
              Studios Inc.
            </h2>
            <p className="reveal mt-8 max-w-md text-lg leading-relaxed text-night/70">
              An applied AI company. We build for the person who has never heard of the tech underneath, and we test on the live thing, on a phone.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
            <dl className="reveal divide-y divide-night/15 border-y border-night/15 font-mono text-sm">
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-4">
                <dt className="text-[10px] uppercase tracking-[0.18em] text-night/50">Entity</dt>
                <dd>
                  {COMPANY.legal}
                  <br />
                  <span className="text-night/60">{COMPANY.kind}</span>
                </dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-4">
                <dt className="text-[10px] uppercase tracking-[0.18em] text-night/50">Address</dt>
                <dd>
                  {COMPANY.street}
                  <br />
                  {COMPANY.city}
                  <br />
                  {COMPANY.country}
                </dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-4">
                <dt className="text-[10px] uppercase tracking-[0.18em] text-night/50">Email</dt>
                <dd>
                  <a href={`mailto:${COMPANY.email}`} className="underline decoration-night/30 underline-offset-4 hover:decoration-signal">
                    {COMPANY.email}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="reveal mt-10 flex items-center gap-4">
              <Image
                src="/founder.jpg"
                alt={COMPANY.founder}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover object-top grayscale"
              />
              <div>
                <p className="font-display text-lg font-bold">{COMPANY.founder}</p>
                <p className="text-sm text-night/60">
                  Founder and design engineer.{" "}
                  <Link href="/emmanuel" className="underline underline-offset-4">
                    About him
                  </Link>{" "}
                  ·{" "}
                  <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    LinkedIn
                  </a>{" "}
                  ·{" "}
                  <a href={COMPANY.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    GitHub
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* contact */}
      <section className="relative isolate z-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_70%_at_15%_100%,rgb(255_107_44/0.25),transparent_70%),radial-gradient(50%_60%_at_90%_0%,rgb(59_91_255/0.25),transparent_70%)]" />
        <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 sm:py-40">
          <p className="reveal max-w-xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Got an AI product people keep bouncing off?
          </p>
          <a
            href={`mailto:${COMPANY.email}`}
            className="reveal group mt-10 inline-flex max-w-full items-center gap-4 font-display text-[9.4vw] font-extrabold leading-none tracking-[-0.045em] text-cream transition-colors hover:text-signal sm:text-[7vw] lg:text-[96px]"
          >
            <span className="min-w-0 break-all sm:break-normal">{COMPANY.email}</span>
            <Arrow className="h-[0.6em] w-[0.6em] shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
