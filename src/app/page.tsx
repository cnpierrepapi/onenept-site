import Image from "next/image";
import Link from "next/link";
import Reveal from "./reveal";
import {
  CALIBRATED,
  CertBar,
  ExternalArrow,
  Footer,
  MobileBar,
  Nav,
} from "./site";

type Reading = { k: string; v: string; struck?: boolean; ok?: boolean };

const CASES: {
  n: string;
  slug: string;
  where: string;
  when: string;
  title: string;
  dek: string;
  readings: Reading[];
}[] = [
  {
    n: "01",
    slug: "/case/datahub",
    where: "DATAHUB",
    when: "28 JUL TO 24 AUG 2026",
    title: "The page was wrong. So was I.",
    dek: "DataHub said which kinds of things can have an incident raised against them. The list had drifted from the code and nobody had noticed, because the failure was silent. I stopped reading the files by eye and wrote the script that reads the answer out of the source.",
    readings: [
      { k: "THE DOCS SAID", v: "the published list of types", struck: true },
      { k: "I MEASURED", v: "10 accept an incident, 5 can show it" },
      { k: "OFF BY", v: "5 types, with no error" },
      { k: "STATUS", v: "2 MERGED", ok: true },
    ],
  },
  {
    n: "02",
    slug: "/case/adk",
    where: "GOOGLE ADK",
    when: "22 TO 28 AUG 2026",
    title: "I said the list would rot. It shipped rotten.",
    dek: "One config object, 35 fields, three different destinations in the request, and nothing saying which is which. Put the tools in the wrong half and the call returns 200 with no tools in it. A maintainer confirmed it, and my own table went stale inside a day.",
    readings: [
      { k: "THE DOCS SAID", v: "nothing. 35 fields, no map" },
      { k: "I MEASURED", v: "8 top level, 22 nested, 3 dropped" },
      { k: "OFF BY", v: "your tools vanish on a 200" },
      { k: "STATUS", v: "PR OPEN, AT THEIR ASK" },
    ],
  },
  {
    n: "03",
    slug: "/case/calle",
    where: "CALL-E",
    when: "31 AUG TO 11 SEP 2026",
    title: "It said done. Nobody answered.",
    dek: "An AI phone API marked a task completed, with high confidence, on a call that went to voicemail. I placed real calls to a speaking clock until I could say what its fields actually mean. Fourteen issues filed, six fixed inside a week, and the tool that reads a call properly is merged.",
    readings: [
      { k: "THE API SAID", v: "task_completed: true", struck: true },
      { k: "I MEASURED", v: "a voicemail box. Nobody spoke" },
      { k: "OFF BY", v: "two hundredths from a real success" },
      { k: "STATUS", v: "MERGED, 6 ISSUES FIXED", ok: true },
    ],
  },
];

/* Every upstream thread, one line each. States checked against GitHub on the
   CALIBRATED date. Re-check before changing a state word. */
type Entry = {
  state: string;
  where: string;
  line: string;
  href: string;
  tone: "ok" | "ink" | "quiet";
};

const LEDGER: Entry[] = [
  { state: "MERGED", where: "datahub #19115", line: "incidents on columns, the case 01 finding", href: "https://github.com/datahub-project/datahub/pull/19115", tone: "ok" },
  { state: "MERGED", where: "datahub #19405", line: "the permission check the column tab needed", href: "https://github.com/datahub-project/datahub/pull/19405", tone: "ok" },
  { state: "MERGED", where: "call-e #337", line: "the call state reconciler, case 03", href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/337", tone: "ok" },
  { state: "6 FIXED", where: "call-e, 14 issues", line: "docs, SDKs, CLI and plugins. Eight still open", href: "https://github.com/search?q=author%3Acnpierrepapi+org%3ACALLE-AI+is%3Aissue&type=issues", tone: "ok" },
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
  ok: "text-ok",
  ink: "text-ink",
  quiet: "text-ink/55",
} as const;

/* Things I said in public that were wrong, and what was actually true. */
const ERRATA: {
  where: string;
  claimed: string;
  actual: string;
  href: string;
  label: string;
}[] = [
  {
    where: "DATAHUB #18685",
    claimed: "One file is the gate that blocks the write, and machine learning models get rejected.",
    actual: "Neither is true. The maintainer asked for changes and he was right to. I posted the correction myself, twice.",
    href: "https://github.com/datahub-project/datahub/pull/18685#issuecomment-5306551155",
    label: "the correction",
  },
  {
    where: "ADK #6880",
    claimed: "Six fields go to the top level of the request.",
    actual: "Eight. I missed modelArmorConfig and serviceTier, less than a day after publishing the table.",
    href: "https://github.com/google/adk-python/issues/6880#issuecomment-5413241023",
    label: "the correction",
  },
  {
    where: "ADK #2425",
    claimed: "An orphaned tool call leaves a session in a shape nothing in the codebase is written to handle.",
    actual: "So I ran it. The session resumes fine on Gemini. Retracted in the thread, with the probe.",
    href: "https://github.com/google/adk-python/issues/2425",
    label: "the thread",
  },
  {
    where: "CALL-E #300",
    claimed: "Nothing from the earlier commits survives the force-push.",
    actual: "It did. A force-push moves a branch, it does not delete the objects. I said so in the thread and closed the pull request myself.",
    href: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/300",
    label: "the thread",
  },
  {
    where: "MY OWN LIBRARY",
    claimed: "A person picked up. Safe to act on.",
    actual: "It was a phone menu. A live call caught it, not my hundred tests.",
    href: "/case/calle",
    label: "report 03",
  },
];

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
      <CertBar />
      <Nav />
      <MobileBar />

      {/* hero: the claim left, a real specimen right */}
      <header className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-5 pb-24 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0">
          <p className="reveal font-mono text-xs tracking-[0.28em] text-ink/60">
            CALIBRATION RECORD FOR
          </p>
          <div className="reveal mt-5 flex items-center gap-4">
            <Image
              src="/founder.jpg"
              alt="Chukwudumaga Nnawuogo"
              width={56}
              height={56}
              className="h-14 w-14 border border-ink/30 object-cover object-top grayscale"
            />
            <div>
              <p className="font-serif text-xl font-semibold leading-tight sm:text-2xl">
                Chukwudumaga Nnawuogo
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-ink/60">
                BENG, ELECTRICAL AND ELECTRONICS ENGINEERING
              </p>
            </div>
          </div>
          <h1 className="reveal mt-10 font-serif text-[12vw] font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            I read the spec.
            <br />
            <span className="italic text-ink/70">Then I measure</span>
            <br />
            the thing.
          </h1>
          <p className="reveal mt-10 max-w-xl text-lg leading-relaxed text-ink/80">
            {
              "On a bench you trust the meter, not the drawing. I do the same with other people's code. I find where a project's docs and what it actually does disagree, and I prove it with something anyone can rerun. Two of those are merged into DataHub and one into CALL-E. Another is open in Google's agent kit because a maintainer asked me to write it."
            }
          </p>
          <div className="reveal mt-8 flex flex-wrap items-center gap-5">
            <a
              href="mailto:admin@onenept.com"
              className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-5 py-2.5 font-mono text-xs tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              START A CONVERSATION
              <ExternalArrow className="h-3.5 w-3.5" />
            </a>
            <span className="font-mono text-xs text-ink/60">
              CONTRACT WORK, REMOTE
            </span>
          </div>
        </div>

        {/* the specimen: one real finding, as a test sheet */}
        <Link
          href="/case/calle"
          className="reveal group relative self-end border-2 border-ink bg-paper p-6 transition-colors hover:bg-paper-2 sm:p-7"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] text-ink/60">
            SPECIMEN :: REPORT 03 :: CALL-E
          </p>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.18em] text-ink/55">
                THE API SAID
              </dt>
              <dd className="struck mt-1 font-mono text-lg">
                task_completed: true
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.18em] text-ink/55">
                I MEASURED
              </dt>
              <dd className="mt-1 font-serif text-2xl leading-snug">
                A voicemail box. Nobody answered.
              </dd>
            </div>
            <div className="border-t border-ink/20 pt-4">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-ink/55">
                THEIR DOCS
              </dt>
              <dd className="mt-1 font-mono text-sm text-ok">
                REDEFINED THE FIELD, 7 SEP
              </dd>
            </div>
          </dl>
          <span className="cal-stamp absolute -right-2 -top-4 bg-paper px-3 py-1 font-mono text-[10px] text-ok sm:-right-4">
            SETTLED
          </span>
          <span className="mt-6 inline-block font-mono text-[11px] tracking-[0.1em] text-ink/70 group-hover:text-ink">
            READ THE REPORT &#8594;
          </span>
        </Link>
      </header>

      {/* the cases: report rows, not cards */}
      <section
        id="cases"
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24"
      >
        <div className="reveal flex items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="mr-3 font-mono text-sm font-normal text-ink/55">
              01
            </span>
            In other people&apos;s codebases
          </h2>
          <p className="hidden font-mono text-xs text-ink/55 sm:block">
            THREE REPORTS
          </p>
        </div>
        <p className="reveal mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
          {
            "Anyone can get a typo fix merged. This is the other thing: reading somebody else's codebase until you can tell the team something about their own project they had not written down yet, and having them write it down. Each one is written up in full, including the parts where I was the one who was wrong."
          }
        </p>

        <div className="mt-6">
          {CASES.map((c) => (
            <Link
              key={c.slug}
              href={c.slug}
              className="reveal group grid gap-6 border-b border-ink/25 py-12 lg:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] lg:gap-10"
            >
              <div>
                <p className="num font-mono text-5xl font-medium leading-none text-ink/25 group-hover:text-ink">
                  {c.n}
                </p>
                <p className="mt-3 font-mono text-[11px] tracking-[0.16em]">
                  {c.where}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-ink/55">
                  {c.when}
                </p>
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {c.title}
                </h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink/75">
                  {c.dek}
                </p>
                <dl className="mt-7 grid grid-cols-2 border-t border-ink/30 sm:grid-cols-4">
                  {c.readings.map((r) => (
                    <div
                      key={r.k}
                      className="border-b border-ink/15 py-3 pr-4 sm:border-b-0"
                    >
                      <dt className="font-mono text-[10px] tracking-[0.16em] text-ink/55">
                        {r.k}
                      </dt>
                      <dd
                        className={`mt-1 font-mono text-xs leading-5 ${
                          r.struck ? "struck" : r.ok ? "text-ok" : ""
                        }`}
                      >
                        {r.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <span className="mt-6 inline-block font-mono text-[11px] tracking-[0.12em] text-ink/70 underline decoration-ink/30 underline-offset-4 group-hover:text-ink">
                  READ REPORT {c.n} &#8594;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* the ledger: full-bleed band, breaks the page rhythm on purpose */}
      <section
        id="ledger"
        className="relative z-10 border-y-2 border-ink bg-paper-2"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="reveal grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                <span className="mr-3 font-mono text-sm font-normal text-ink/55">
                  02
                </span>
                The ledger
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-ink/75">
                Every thread I have opened or argued in, merged or not. The
                open ones stay on the list. So does the one I closed myself.
              </p>
              <p className="mt-6 font-mono text-[11px] leading-5 text-ink/55">
                STATES CHECKED AGAINST GITHUB, {CALIBRATED}.
              </p>
            </div>

            <ol className="min-w-0 border-t border-ink/30 font-mono text-xs">
              {LEDGER.map((e) => (
                <li key={e.href} className="border-b border-ink/15">
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-3 sm:grid-cols-[7.5rem_10rem_minmax(0,1fr)]"
                  >
                    <span className={`tracking-[0.1em] ${TONE[e.tone]}`}>
                      {e.state}
                    </span>
                    <span className="group-hover:underline">{e.where}</span>
                    <span className="col-start-2 leading-5 text-ink/65 sm:col-start-3">
                      {e.line}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <p className="reveal mt-14 max-w-3xl border-t border-ink/20 pt-6 leading-relaxed text-ink/70">
            I also ship things, usually because building on a project is how
            I find what is wrong with it. Two still running:{" "}
            <a
              href="https://asheard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/30 underline-offset-4"
            >
              asheard
            </a>
            , the call reader from report 03, and{" "}
            <a
              href="https://greenlight.onenept.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/30 underline-offset-4"
            >
              greenlight
            </a>
            , which tells a creator what a finished video will get flagged for
            before it goes up.
          </p>
        </div>
      </section>

      {/* errata: offset right, the one section that is all about me being wrong */}
      <section
        id="errata"
        className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24"
      >
        <div className="lg:pl-[16%]">
          <h2 className="reveal font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="mr-3 font-mono text-sm font-normal text-ink/55">
              03
            </span>
            Errata
          </h2>
          <p className="reveal mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">
            Things I said in public that turned out to be wrong. Each one got
            corrected where I said it, before anyone had to ask twice.
          </p>

          <ol className="mt-10 border-t-2 border-ink">
            {ERRATA.map((e) => {
              const internal = e.href.startsWith("/");
              return (
                <li
                  key={e.where}
                  className="reveal grid gap-3 border-b border-ink/20 py-7 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-8"
                >
                  <p className="font-mono text-[11px] tracking-[0.14em] text-ink/60">
                    {e.where}
                  </p>
                  <div className="min-w-0">
                    <p className="struck font-serif text-xl leading-snug">
                      {e.claimed}
                    </p>
                    <p className="mt-3 max-w-2xl leading-relaxed">{e.actual}</p>
                    {internal ? (
                      <Link
                        href={e.href}
                        className="mt-3 inline-block font-mono text-[11px] tracking-[0.08em] text-ink/70 underline decoration-ink/30 underline-offset-4 hover:text-ink"
                      >
                        {e.label} &#8594;
                      </Link>
                    ) : (
                      <a
                        href={e.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block font-mono text-[11px] tracking-[0.08em] text-ink/70 underline decoration-ink/30 underline-offset-4 hover:text-ink"
                      >
                        {e.label} &#8599;
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* where the habit came from: one big paragraph, no furniture */}
      <section className="relative z-10 bg-ink text-paper">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-28">
          <p className="reveal font-mono text-[11px] tracking-[0.2em] text-paper/60">
            WHERE THE HABIT CAME FROM
          </p>
          <p className="reveal mt-6 max-w-4xl font-serif text-2xl leading-snug sm:text-4xl sm:leading-tight">
            {
              "I trained as an electrical engineer, where you check the meter before you believe the drawing. In 2016 I co-founded Afrosets, a dataset of Black faces, because the models of the day had barely seen any. My master's dissertation is about drift: what a stock keeps doing after the company publishes its numbers."
            }
          </p>
          <p className="reveal mt-8 font-serif text-2xl italic text-paper/70 sm:text-3xl">
            Same question every time. What did the record leave out?
          </p>
        </div>
      </section>

      {/* standing rules */}
      <section
        id="rules"
        className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24"
      >
        <h2 className="reveal mb-12 border-b-2 border-ink pb-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="mr-3 font-mono text-sm font-normal text-ink/55">
            04
          </span>
          Standing rules
        </h2>
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {RULES.map(([n, title, body]) => (
            <div key={n} className="reveal grid grid-cols-[3rem_minmax(0,1fr)]">
              <p className="font-mono text-sm text-ink/55">§{n}</p>
              <div>
                <h3 className="font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink/75">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="reveal mt-14 font-mono text-xs leading-6 text-ink/55">
          THE RULES ARE NOT ASPIRATIONAL. REPORT 01 IS §03. REPORT 02 IS §03
          AGAIN, THE DAY AFTER IT CAUGHT ME OUT. REPORT 03 IS §04, AIMED AT A
          PHONE API. THE ERRATA ARE §04 AIMED AT ME.
        </p>
      </section>

      {/* why this domain */}
      <section className="relative z-10 border-t border-ink/25">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="reveal grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Why onenept.com
              <br />
              <span className="italic text-ink/60">and not my name</span>
            </h2>
            <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-ink/80">
              <p>
                Onenept Studios is a real company. It is how the work ships and
                how it gets invoiced, so a first contract needs no paperwork set
                up from scratch.
              </p>
              <p className="text-ink">
                If you are hiring, you are hiring me, and I am on this page. If
                you are contracting, the entity is already here.
              </p>
              <a
                href="mailto:admin@onenept.com"
                className="inline-flex items-center gap-2 border-2 border-ink px-5 py-2.5 font-mono text-xs tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
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
