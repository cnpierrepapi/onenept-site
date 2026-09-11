import Image from "next/image";
import Link from "next/link";
import Reveal from "./reveal";
import { ExternalArrow, Footer, MobileBar, Nav, Ticker } from "./site";

const CASES = [
  {
    n: "01",
    slug: "/case/datahub",
    where: "DATAHUB",
    title: "The page was wrong. So was I.",
    dek: "DataHub said which kinds of things can have an incident raised against them. The list had drifted from the code and nobody had noticed, because the failure was silent: five types accepted an incident and could never show it again. I stopped reading the files by eye and wrote the script that reads the answer out of the source.",
    outcome: "TWO PULL REQUESTS ON MASTER",
    live: true,
    when: "28 JUL TO 24 AUG 2026",
    rows: [
      ["MERGED", "#19115 schemaField incidents"],
      ["MERGED", "#19405 parent entity auth"],
      ["ADOPTED", "the truth table, in their tracker"],
    ],
  },
  {
    n: "02",
    slug: "/case/adk",
    where: "GOOGLE ADK",
    title: "I said the list would rot. It shipped rotten.",
    dek: "One config object, 35 fields, three different destinations in the request, and nothing saying which is which. Put the tools in the wrong half and the call returns 200 with no tools in it. A maintainer confirmed the diagnosis, then my own published field table went stale inside a day and settled how to fix it.",
    outcome: "PULL REQUEST OPEN AT A MAINTAINER'S ASK",
    live: false,
    when: "22 TO 28 AUG 2026",
    rows: [
      ["OPEN", "#6935 the helper, 460 lines"],
      ["CONFIRMED", "#6880 by the models triager"],
      ["FOUND", "while building MIGRAGENT"],
    ],
  },
  {
    n: "03",
    slug: "/case/calle",
    where: "CALL-E",
    title: "It said done. Nobody answered.",
    dek: "An AI phone API marked a task completed, with high confidence, on a call that went to voicemail. I placed real calls to a speaking clock until I could say what its fields actually mean. Fourteen issues filed, six fixed inside a week, and the tool that reads a call properly is merged into their repo.",
    outcome: "MERGED AFTER FOUR ROUNDS OF REVIEW",
    live: true,
    when: "31 AUG TO 11 SEP 2026",
    rows: [
      ["MERGED", "#337 call state reconciler"],
      ["FIXED", "6 of 14 issues filed"],
      ["VALIDATED", "a p1 bug another builder found"],
    ],
  },
];

/* Every upstream thread, one line each. States checked against GitHub on
   11 Sep 2026. Re-check before changing a state word. */
type Entry = {
  state: string;
  where: string;
  line: string;
  href: string;
  tone: "sun" | "ink" | "quiet";
};

const LEDGER: Entry[] = [
  { state: "MERGED", where: "datahub #19115", line: "incidents on columns, the case 01 finding", href: "https://github.com/datahub-project/datahub/pull/19115", tone: "sun" },
  { state: "MERGED", where: "datahub #19405", line: "the permission check the column tab needed", href: "https://github.com/datahub-project/datahub/pull/19405", tone: "sun" },
  { state: "MERGED", where: "call-e #337", line: "the call state reconciler, case 03", href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/337", tone: "sun" },
  { state: "6 FIXED", where: "call-e, 14 issues", line: "docs, SDKs, CLI and plugins. Eight still open", href: "https://github.com/search?q=author%3Acnpierrepapi+org%3ACALLE-AI+is%3Aissue&type=issues", tone: "sun" },
  { state: "PR OPEN", where: "adk #6935", line: "the config helper a maintainer asked for", href: "https://github.com/google/adk-python/pull/6935", tone: "ink" },
  { state: "PR OPEN", where: "datahub #18685", line: "the docs half of case 01", href: "https://github.com/datahub-project/datahub/pull/18685", tone: "ink" },
  { state: "PR OPEN", where: "datahub #18684", line: "two self-hosted failures that print no error", href: "https://github.com/datahub-project/datahub/pull/18684", tone: "ink" },
  { state: "PR OPEN", where: "datahub-skills #66", line: "what breaks downstream if a column changes", href: "https://github.com/datahub-project/datahub-skills/pull/66", tone: "ink" },
  { state: "CONFIRMED", where: "adk #6880", line: "the silent 200, confirmed by the models triager", href: "https://github.com/google/adk-python/issues/6880", tone: "ink" },
  { state: "VALIDATED", where: "call-e #196", line: "a p1 another builder filed, reproduced", href: "https://github.com/CALLE-AI/awesome-phone-call-agents/issues/196", tone: "ink" },
  { state: "THREAD", where: "adk #2425", line: "a cancel design, worked out with a rival library's author", href: "https://github.com/google/adk-python/issues/2425", tone: "quiet" },
  { state: "THREAD", where: "adk #2792", line: "a stack trace for stopping an agent on purpose", href: "https://github.com/google/adk-python/issues/2792", tone: "quiet" },
  { state: "THREAD", where: "python-genai #782", line: "why any output limit under 4k is zero", href: "https://github.com/googleapis/python-genai/issues/782", tone: "quiet" },
  { state: "FILED", where: "effectstream #895", line: "five reasons a Midnight template will not build", href: "https://github.com/effectstream/effectstream/issues/895", tone: "quiet" },
  { state: "CLOSED BY ME", where: "call-e #300", line: "my first attempt. It carried real call data", href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/300", tone: "quiet" },
];

const TONE = {
  sun: "text-sun",
  ink: "text-ink/75",
  quiet: "text-ink/40",
} as const;

const RULES = [
  [
    "01",
    "Live data or nothing.",
    "If it does not run against real data arriving in real time, it is a slide, not a product.",
  ],
  [
    "02",
    "Every output carries its record.",
    "Where it came from travels inside the thing itself, not in a spreadsheet somebody has to be trusted to keep.",
  ],
  [
    "03",
    "Derive it, do not maintain it.",
    "A hand-written list of what a system supports is wrong the week after it is written. If it can be read from the source, read it from the source.",
  ],
  [
    "04",
    "Settle everything.",
    "A claim that cannot be traced back to a record is marketing. That includes my own claims, including the ones I got wrong first.",
  ],
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Reveal />
      <Ticker />
      <Nav />
      <MobileBar />

      {/* hero */}
      <header className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-14 sm:pt-20">
        <span className="rail absolute right-2 top-8 hidden font-mono text-[10px] uppercase text-ink/25 lg:block">
          read code. prove the gaps.
        </span>
        <p className="reveal font-mono text-xs tracking-[0.3em] text-ink/50">
          ONENEPT STUDIOS :: ONE OPERATOR :: REMOTE
        </p>
        {/* mobile hero: mixed-scale stack, every line sized to fit the screen */}
        <h1 className="reveal mt-6 font-display font-extrabold leading-[0.95] sm:hidden">
          <span className="block text-[15vw] tracking-tight">READ</span>
          <span className="block text-[15vw] tracking-tight text-outline-sun">
            CODE.
          </span>
          <span className="mt-2 block text-[7.5vw] tracking-tight">
            <span className="text-outline">PROVE</span> THE
          </span>
          <span className="block text-[7.5vw] tracking-tight text-sun">
            GAPS.
          </span>
        </h1>
        {/* desktop hero */}
        <h1 className="reveal mt-6 hidden font-display font-extrabold leading-[0.92] sm:block">
          <span className="block tracking-tight sm:text-6xl lg:text-7xl">
            READ <span className="text-outline-sun">CODE.</span>
          </span>
          <span className="block tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-outline">PROVE</span> THE
          </span>
          <span className="block tracking-tight text-sun sm:text-6xl lg:text-7xl">
            GAPS.
          </span>
        </h1>
        <div className="reveal mt-10 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end">
          <p className="text-base leading-relaxed text-ink/70">
            I find where a codebase and its own documentation disagree, and prove
            it with a script anyone can run. Two of those are merged into
            DataHub. One is merged into CALL-E, after I placed real calls to
            find out what its API was actually saying. Another is open in
            Google&apos;s agent kit because a maintainer asked me to write it.
            Available for contract work, remote.
          </p>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-ink/15 bg-card/70 p-3 shadow-brut-sm">
            <Image
              src="/founder.jpg"
              alt="Chukwudumaga Nnawuogo"
              width={52}
              height={52}
              className="h-13 w-13 rounded-xl object-cover object-top"
            />
            <div className="font-mono text-[11px] leading-4 text-ink/60">
              CHUKWUDUMAGA
              <br />
              NNAWUOGO
              <br />
              <span className="text-sun">FOUNDER + DESK</span>
            </div>
          </div>
        </div>
      </header>

      {/* the cases */}
      <section
        id="cases"
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24"
      >
        <div className="reveal mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-4xl">
            <span className="font-mono text-sm text-sun sm:text-base">
              01 ::
            </span>{" "}
            IN OTHER PEOPLE&apos;S CODEBASES
          </h2>
          <p className="hidden font-mono text-xs text-ink/40 sm:block">
            THREE CASES. READ ANY.
          </p>
        </div>
        <p className="reveal max-w-3xl text-lg leading-relaxed text-ink/70">
          Anyone can get a typo fix merged. This is the other thing: reading
          somebody else&apos;s codebase until you can tell the team something
          about their own project they had not written down yet, and having them
          write it down. Each one is written up in full, including the parts
          where I was the one who was wrong.
        </p>

        <div className="mt-14 space-y-8">
          {CASES.map((c) => (
            <Link
              key={c.slug}
              href={c.slug}
              className="reveal group @container block overflow-hidden rounded-3xl border border-ink/15 bg-card p-6 shadow-brut transition-transform hover:-translate-y-1.5 hover:border-ink/30 sm:p-9"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.2em] ${
                    c.live
                      ? "border-sun/40 text-sun"
                      : "border-ink/25 text-ink/70"
                  }`}
                >
                  <span
                    className={`live-dot h-1.5 w-1.5 rounded-full ${
                      c.live ? "bg-sun" : "bg-ink/50"
                    }`}
                  />
                  {c.outcome}
                </span>
                <span className="font-mono text-4xl font-bold leading-none text-outline sm:text-5xl">
                  {c.n}
                </span>
              </div>

              <p className="mt-7 font-mono text-[11px] tracking-[0.2em] text-ink/40">
                {c.where} :: {c.when}
              </p>
              <h3 className="mt-3 max-w-3xl font-display text-[min(8.5cqw,2.75rem)] font-extrabold leading-[1.06] tracking-tight">
                {c.title}
              </h3>
              <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">
                {c.dek}
              </p>

              <div className="mt-8 grid gap-2 font-mono text-xs sm:grid-cols-3">
                {c.rows.map(([k, v]) => (
                  <div
                    key={v}
                    className="flex min-w-0 justify-between gap-4 border-b border-ink/10 pb-2 sm:block sm:border-0 sm:pb-0"
                  >
                    <span className="shrink-0 text-ink/40">{k}</span>
                    <span className="min-w-0 break-words text-right text-ink/80 sm:mt-1 sm:block sm:text-left">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-sun/80 group-hover:text-sun">
                READ THE CASE &#8594;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* the ledger: full-bleed band, breaks the card rhythm on purpose */}
      <section
        id="ledger"
        className="relative z-10 border-y border-ink/10 bg-night/60"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="reveal grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-4xl">
                <span className="font-mono text-sm text-sun sm:text-base">
                  02 ::
                </span>{" "}
                THE LEDGER
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-ink/65">
                Every thread I have opened or argued in, merged or not. The
                open ones stay on the list. So does the one I closed myself.
              </p>
              <p className="mt-6 font-mono text-[11px] leading-5 text-ink/35">
                STATES CHECKED AGAINST GITHUB, 11 SEP 2026.
              </p>
            </div>

            <ol className="min-w-0 font-mono text-xs">
              {LEDGER.map((e) => (
                <li key={e.href} className="border-b border-ink/10 last:border-0">
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-3 sm:grid-cols-[7.5rem_10rem_minmax(0,1fr)]"
                  >
                    <span className={`tracking-[0.12em] ${TONE[e.tone]}`}>
                      {e.state}
                    </span>
                    <span className="text-ink/80 group-hover:text-sun">
                      {e.where}
                    </span>
                    <span className="col-start-2 leading-5 text-ink/50 sm:col-start-3">
                      {e.line}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <p className="reveal mt-14 max-w-3xl border-t border-ink/10 pt-6 text-sm leading-relaxed text-ink/55">
            I also ship things, usually because building on a project is how
            I find what is wrong with it. Two still running:{" "}
            <a
              href="https://asheard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/80 underline decoration-ink/25 underline-offset-4 hover:text-sun"
            >
              asheard
            </a>
            , the call reader from case 03, and{" "}
            <a
              href="https://greenlight.onenept.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/80 underline decoration-ink/25 underline-offset-4 hover:text-sun"
            >
              greenlight
            </a>
            , which tells a creator what a finished video will get flagged for
            before it goes up.
          </p>
        </div>
      </section>

      {/* desk rules */}
      <section
        id="rules"
        className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24"
      >
        <h2 className="reveal mb-12 font-display text-2xl font-bold sm:text-4xl">
          <span className="font-mono text-sm text-sun sm:text-base">03 ::</span>{" "}
          DESK RULES
        </h2>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {RULES.map(([n, title, body]) => (
            <div key={n} className="reveal">
              <p className="font-mono text-2xl font-bold text-outline">{n}</p>
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
            </div>
          ))}
          <div className="reveal flex items-end">
            <p className="font-mono text-xs leading-6 text-ink/35">
              THE RULES ARE NOT ASPIRATIONAL.
              <br />
              CASE 01 IS RULE 03. CASE 02 IS RULE 03 AGAIN,
              <br />
              THE DAY AFTER IT CAUGHT ME OUT.
              <br />
              CASE 03 IS RULE 04, AIMED AT A PHONE API.
            </p>
          </div>
        </div>
      </section>

      {/* why this domain */}
      <section className="relative z-10 border-t border-ink/10 bg-night/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="reveal grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <h2 className="font-display text-xl font-bold leading-tight sm:text-3xl">
              WHY ONENEPT.COM
              <br />
              <span className="text-outline">AND NOT MY NAME</span>
            </h2>
            <div className="max-w-2xl space-y-4 leading-relaxed text-ink/70">
              <p>
                Onenept Studios is a real company. It is how the work ships and
                how it gets invoiced, so a first contract needs no paperwork set
                up from scratch.
              </p>
              <p className="text-ink/85">
                If you are hiring, you are hiring me, and I am on this page. If
                you are contracting, the entity is already here.
              </p>
              <a
                href="mailto:admin@onenept.com"
                className="inline-flex items-center gap-2 rounded-full border border-sun/50 px-5 py-2.5 font-mono text-xs tracking-[0.14em] text-sun transition-colors hover:bg-sun hover:text-night"
              >
                START A CONVERSATION
                <ExternalArrow className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
