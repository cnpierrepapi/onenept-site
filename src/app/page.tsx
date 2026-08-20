import Image from "next/image";
import Reveal from "./reveal";

const TICKER = [
  "AVAILABLE FOR CONTRACT WORK",
  "MERGED INTO DATAHUB :: 20 AUG 2026",
  "DATAHUB :: METADATA :: LINEAGE",
  "THE DOCS AND THE CODE DISAGREE",
  "PROVE IT OR IT DID NOT HAPPEN",
  "SETTLE EVERYTHING",
  "ONENEPT STUDIOS INC",
];

const RECEIPT = {
  sha: "8c823661e6",
  href: "https://github.com/datahub-project/datahub/commit/8c823661e6b457c2c8843c60346d4ea8aa63d900",
  headline: "feat(incidents): add incident support for schemaField (#19115)",
  when: "20 AUGUST 2026",
  repo: "datahub-project/datahub",
};

const FIGURES = [
  ["10", "types accept an incident"],
  ["7", "carry the summary aspect"],
  ["5", "could be read back"],
];

const GATES: [string, string, string, string][] = [
  ["1", "Write allowlist", "IncidentInfo.pdl", "ALREADY THERE"],
  ["2", "Summary aspect", "entity-registry.yml", "MINE"],
  ["3", "GraphQL schema", "incident.graphql", "MINE"],
  ["4", "Resolver wiring", "GmsGraphQLEngine.java", "MINE"],
  ["5", "Tab badge", "entity page query", "OUT BY DESIGN"],
  ["6", "Incident tab", "web react fragments", "OUT BY DESIGN"],
  ["7", "Agent tooling", "mcp_tools/incidents.py", "STILL OPEN"],
];

const BEATS = [
  {
    n: "01",
    title: "THE PAGE WAS WRONG",
    body: "DataHub documents which kinds of things can have an incident raised against them. A table can. A dashboard can. The published list had drifted from the code and had been wrong for a while, quietly, the way documentation goes wrong.",
    href: "https://github.com/datahub-project/datahub/pull/18685",
    link: "PR #18685",
  },
  {
    n: "02",
    title: "SO WAS I",
    body: "My first correction was also wrong. I wrote that one file was the gate that blocks a write, and that machine learning models get rejected. Neither is true. The maintainer asked for changes and he was right to. I went back and posted the correction myself, twice, once for an input shape I had copied wrong and once for a readback claim I had simply invented.",
    kicker: "This is the beat I would keep if I had to delete the rest of the page.",
    href: "https://github.com/datahub-project/datahub/pull/18685#issuecomment-5306551155",
    link: "the correction",
  },
  {
    n: "03",
    title: "STOP CHECKING BY HAND",
    body: "Reading six files by eye is how the list went wrong in the first place. So I stopped reading and wrote the check. It parses the write allowlist, the registry, the schema and the resolver wiring, then prints the table. It runs inside the build, so the docs cannot drift again without the build noticing.",
    figures: true,
  },
  {
    n: "04",
    title: "GAVE HALF OF IT AWAY",
    body: "Someone else had scoped the machine learning half before I filed anything. I found his thread after mine was open. So I handed him those entities and kept the column level one, which nobody was looking at. He shipped his in two pull requests. Mine was one. All three are on master now.",
    href: "https://github.com/datahub-project/datahub/issues/18911",
    link: "his RFC, filed first",
  },
  {
    n: "05",
    title: "THEY MADE IT THE RULE",
    body: "The maintainer opened a tracker and made it the single place this work gets planned from. It runs on gates: every layer a thing has to clear before anyone can honestly say it supports incidents. He had named three when we started. The tracker has seven. The truth table inside it is the one my script prints, and the rule at the top of it, do not ship a write path without a read path, is the failure I filed.",
    gates: true,
    href: "https://github.com/datahub-project/datahub/issues/19322",
    link: "the tracker",
  },
  {
    n: "06",
    title: "MERGED",
    body: "Approved, taken out of draft and queued by the maintainer himself, then squashed onto master by a bot while I was asleep.",
    receipt: true,
  },
];

const ALSO = [
  {
    name: "DATAHUB #18685",
    href: "https://github.com/datahub-project/datahub/pull/18685",
    label: "open, held on purpose",
    line: "The docs half. It is finished and it is not merging yet, because the list it prints will not be true until one more contributor's work lands. Waiting is the correct move and it is the whole point of the generator.",
  },
  {
    name: "DATAHUB #18684",
    href: "https://github.com/datahub-project/datahub/pull/18684",
    label: "open, awaiting a reviewer",
    line: "Two self-hosted failures that produce no error at all. Each cost an afternoon and left nothing to search for.",
  },
  {
    name: "DATAHUB SKILLS #66",
    href: "https://github.com/datahub-project/datahub-skills/pull/66",
    label: "open, with reviewers",
    line: "What breaks downstream if this table or column changes. The question every data team asks before a migration.",
  },
];

const FLAGSHIPS = [
  {
    name: "ARIADNE",
    href: "https://ariadne-five.vercel.app",
    label: "ariadne-five.vercel.app",
    thesis:
      "Lineage-grounded root cause for production ML, built on DataHub. When a model behaves differently, the cause is upstream. Ariadne walks column-level lineage from the prediction back to the table that moved.",
    rows: [
      ["TRACE", "column level, prediction to source"],
      ["CATALOG", "DataHub, real lineage graph"],
      ["OUTPUT", "a record a regulator can read"],
    ],
  },
];




const RULES = [
  ["01", "Live data or nothing.", "If it does not run against real data arriving in real time, it is a slide, not a product."],
  ["02", "Every output carries its record.", "Where it came from travels inside the thing itself, not in a spreadsheet somebody has to be trusted to keep."],
  ["03", "Derive it, do not maintain it.", "A hand-written list of what a system supports is wrong the week after it is written. If it can be read from the source, read it from the source."],
  ["04", "Settle everything.", "A claim that cannot be traced back to a record is marketing. That includes my own claims, including the ones I got wrong first."],
];

function ExternalArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17L17 7M17 7H9m8 0v8"
      />
    </svg>
  );
}

export default function Home() {
  const tape = [...TICKER, ...TICKER];
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Reveal />

      {/* desk feed ticker */}
      <div className="marquee border-b border-ink/15 bg-night py-2.5 font-mono text-[11px] tracking-[0.18em] text-sun">
        <div className="marquee-track">
          {tape.map((t, i) => (
            <span key={i} className="mx-6">
              {t} <span className="mx-6 text-ink/30">///</span>
            </span>
          ))}
        </div>
      </div>

      {/* nav */}
      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <span className="font-display text-lg font-bold tracking-tight">
          one<span className="rounded-md bg-sun px-1.5 py-0.5">nept</span>
        </span>
        <div className="hidden items-center gap-5 font-mono text-xs text-ink/60 sm:flex">
          <a href="#case" className="hover:text-sun">THE CASE</a>
          <a href="#positions" className="hover:text-sun">PRODUCTS</a>
          <a href="#rules" className="hover:text-sun">RULES</a>
          <a
            href="mailto:admin@onenept.com"
            className="rounded-full border border-ink/20 px-3 py-1.5 hover:border-sun hover:text-sun"
          >
            CONTACT
          </a>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ink/70 sm:hidden">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-sun" />
          CODE ON MASTER
        </span>
      </nav>

      {/* mobile desk bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-night/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-4 font-mono text-[10px] tracking-[0.08em] text-ink/70">
          <a href="#case" className="flex flex-col items-center gap-1 py-3 active:text-sun">
            <span className="text-sun">01</span>THE CASE
          </a>
          <a href="#positions" className="flex flex-col items-center gap-1 py-3 active:text-sun">
            <span className="text-sun">02</span>PRODUCTS
          </a>
          <a href="#rules" className="flex flex-col items-center gap-1 py-3 active:text-sun">
            <span className="text-sun">03</span>RULES
          </a>
          <a href="mailto:admin@onenept.com" className="flex flex-col items-center gap-1 py-3 active:text-sun">
            <span className="text-sun">@</span>CONTACT
          </a>
        </div>
      </nav>

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
            I find where a codebase and its own documentation disagree, and
            prove it with a script anyone can run. This week DataHub merged mine
            and turned the finding into the rule they plan the work from.
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

      {/* upstream work */}
      {/* the case */}
      <section id="case" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="reveal mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-4xl">
            <span className="font-mono text-sm text-sun sm:text-base">01 ::</span>{" "}
            ONE THREAD, START TO FINISH
          </h2>
          <p className="hidden font-mono text-xs text-ink/40 sm:block">
            DATAHUB. 28 JULY TO 20 AUGUST. PUBLIC THROUGHOUT.
          </p>
        </div>
        <p className="reveal max-w-3xl text-lg leading-relaxed text-ink/70">
          Anyone can get a typo fix merged. This is the other thing: reading
          somebody else&apos;s codebase until you can tell the team something
          about their own project they had not written down yet, and having them
          write it down.
        </p>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {BEATS.map((b) => (
            <div
              key={b.n}
              className="reveal grid gap-5 lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] lg:gap-10"
            >
              <div className="lg:pt-2">
                <p className="font-mono text-4xl font-bold leading-none text-outline lg:text-6xl">
                  {b.n}
                </p>
              </div>
              <div className="min-w-0">
                <h3
                  className={`font-display font-extrabold tracking-tight ${
                    b.n === "02" || b.n === "06"
                      ? "text-3xl sm:text-5xl"
                      : "text-2xl sm:text-3xl"
                  }`}
                >
                  {b.title}
                </h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink/70">
                  {b.body}
                </p>

                {b.kicker && (
                  <p className="mt-5 max-w-2xl border-l-2 border-sun/60 pl-4 text-lg leading-relaxed text-ink/85">
                    {b.kicker}
                  </p>
                )}

                {b.figures && (
                  <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/10 sm:grid-cols-3">
                    {FIGURES.map(([fig, cap]) => (
                      <div key={cap} className="bg-night px-5 py-6">
                        <p className="font-display text-5xl font-extrabold leading-none text-sun sm:text-6xl">
                          {fig}
                        </p>
                        <p className="mt-3 font-mono text-[11px] leading-5 tracking-[0.1em] text-ink/50">
                          {cap.toUpperCase()}
                        </p>
                      </div>
                    ))}
                    <p className="bg-night px-5 pb-6 font-mono text-[11px] leading-5 text-ink/45 sm:col-span-3">
                      THE GAP: FIVE TYPES ACCEPTED AN INCIDENT AND COULD NEVER
                      SHOW IT AGAIN. NOTHING ERRORED. THAT IS WHY NOBODY HAD
                      CAUGHT IT.
                    </p>
                  </div>
                )}

                {b.gates && (
                  <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/15 bg-card/60">
                    <table className="w-full min-w-[34rem] border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b border-ink/15 text-left text-ink/40">
                          <th className="px-4 py-3 font-normal tracking-[0.14em]">
                            GATE
                          </th>
                          <th className="px-4 py-3 font-normal tracking-[0.14em]">
                            WHAT IT CONTROLS
                          </th>
                          <th className="px-4 py-3 font-normal tracking-[0.14em]">
                            SOURCE
                          </th>
                          <th className="px-4 py-3 text-right font-normal tracking-[0.14em]">
                            SCHEMAFIELD
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {GATES.map(([g, what, src, who]) => (
                          <tr
                            key={g}
                            className="border-b border-ink/10 last:border-0"
                          >
                            <td className="px-4 py-3 text-ink/40">{g}</td>
                            <td className="px-4 py-3 text-ink/80">{what}</td>
                            <td className="px-4 py-3 text-ink/45">{src}</td>
                            <td
                              className={`whitespace-nowrap px-4 py-3 text-right ${
                                who === "MINE" ? "text-sun" : "text-ink/45"
                              }`}
                            >
                              {who}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {b.receipt && (
                  <a
                    href={RECEIPT.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 block overflow-hidden rounded-2xl border border-sun/40 bg-card p-6 shadow-brut transition-transform hover:-translate-y-1 sm:p-8"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-sun/40 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-sun">
                        <span className="live-dot h-1.5 w-1.5 rounded-full bg-sun" />
                        ON MASTER
                      </span>
                      <ExternalArrow className="h-5 w-5 shrink-0 text-ink/30 transition-colors group-hover:text-sun" />
                    </div>
                    <p className="mt-6 break-words font-mono text-sm leading-6 text-ink/85 sm:text-base">
                      {RECEIPT.headline}
                    </p>
                    <div className="mt-6 grid gap-2 font-mono text-xs sm:grid-cols-3">
                      <div className="flex justify-between gap-4 border-b border-ink/10 pb-2 sm:block sm:border-0 sm:pb-0">
                        <span className="text-ink/40">COMMIT</span>
                        <span className="text-sun sm:mt-1 sm:block">
                          {RECEIPT.sha}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-ink/10 pb-2 sm:block sm:border-0 sm:pb-0">
                        <span className="text-ink/40">REPO</span>
                        <span className="text-ink/80 sm:mt-1 sm:block">
                          {RECEIPT.repo}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 sm:block">
                        <span className="text-ink/40">LANDED</span>
                        <span className="text-ink/80 sm:mt-1 sm:block">
                          {RECEIPT.when}
                        </span>
                      </div>
                    </div>
                  </a>
                )}

                {b.href && (
                  <a
                    href={b.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-sun/80 hover:text-sun"
                  >
                    {b.link} <ExternalArrow className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* the honest half */}
        <div className="reveal mt-24 border-t border-ink/15 pt-10 lg:grid lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] lg:gap-10">
          <p className="font-mono text-[11px] tracking-[0.18em] text-sun/70">
            THE REST
          </p>
          <div className="mt-4 max-w-2xl lg:mt-0">
            <p className="text-lg leading-relaxed text-ink/85">
              One pull request of mine has ever merged. It merged this week. The
              other threads on this page are still open, and two of them are
              being held shut on purpose until somebody else&apos;s work lands.
            </p>
            <p className="mt-4 leading-relaxed text-ink/60">
              I am leaving that here because it was true before the merge and it
              is the reason the merge happened. The finding stood on a script
              anyone could run, months before a busy maintainer got to it.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {ALSO.map((m) => (
            <a
              key={m.href}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group @container flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/15 bg-card/60 p-5 transition-transform hover:-translate-y-1 hover:border-ink/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-display text-[min(9cqw,1rem)] font-extrabold leading-[1.15] tracking-tight">
                  {m.name}
                </h4>
                <ExternalArrow className="h-4 w-4 shrink-0 text-ink/25 transition-colors group-hover:text-sun" />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
                {m.line}
              </p>
              <span className="mt-4 min-w-0 break-words border-t border-ink/10 pt-3 font-mono text-[10px] tracking-[0.1em] text-sun/70 group-hover:text-sun">
                {m.label} &#8599;
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* open positions */}
      <section id="positions" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="reveal mb-10 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-4xl">
            <span className="font-mono text-sm text-sun sm:text-base">02 ::</span>{" "}
            BUILT ON DATAHUB
          </h2>
          <p className="hidden font-mono text-xs text-ink/40 sm:block">
            LIVE. OPEN IT.
          </p>
        </div>

        <div className="grid gap-6">
          {FLAGSHIPS.map((f) => (
            <a
              key={f.name}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`reveal group relative @container flex min-w-0 flex-col overflow-hidden rounded-3xl border border-ink/15 bg-card p-6 shadow-brut transition-transform hover:-translate-y-1.5 sm:p-8`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-ink/70">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-sun" />
                  LIVE
                </span>
                <ExternalArrow className="h-5 w-5 text-ink/30 transition-colors group-hover:text-sun" />
              </div>
              <h3 className="mt-6 font-display text-[min(8cqw,1.75rem)] font-extrabold leading-[1.1] tracking-tight">
                {f.name}
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-ink/70">{f.thesis}</p>
              <div className="mt-8 space-y-2 font-mono text-xs">
                {f.rows.map(([k, v]) => (
                  <div key={k} className="flex min-w-0 justify-between gap-4 border-b border-ink/10 pb-2">
                    <span className="shrink-0 text-ink/40">{k}</span>
                    <span className="min-w-0 break-words text-right text-ink/80">{v}</span>
                  </div>
                ))}
              </div>
              <span className="mt-6 font-mono text-[11px] text-sun/80 group-hover:text-sun">
                {f.label} ↗
              </span>
            </a>
          ))}
        </div>

      </section>

      {/* desk rules */}
      <section id="rules" className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24">
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
              SCROLL UP: RULE 03 IS THE ONE THAT MERGED.
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

      {/* footer */}
      <footer className="relative z-10 border-t border-ink/10 bg-night">
        <div className="mx-auto w-full max-w-6xl px-5 pb-28 pt-14 sm:py-14">
          <p className="font-display text-[min(8vw,1.75rem)] font-extrabold tracking-tight sm:text-4xl">
            ONENEPT <span className="text-outline">STUDIOS</span>
          </p>
          <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="font-mono text-xs leading-6 text-ink/50">
              ONENEPT STUDIOS INC.
              <br />
              AVAILABLE FOR CONTRACT WORK. REMOTE.
            </div>
            <div className="flex items-center gap-6 font-mono text-xs text-ink/60">
              <a href="mailto:admin@onenept.com" className="hover:text-sun">
                EMAIL
              </a>
              <a
                href="https://github.com/cnpierrepapi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sun"
              >
                GITHUB
              </a>
              <a
                href="https://www.linkedin.com/in/cenpierrepapi/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sun"
              >
                LINKEDIN
              </a>
            </div>
          </div>
          <p className="mt-10 font-mono text-[10px] text-ink/30">
            © {new Date().getFullYear()} ONENEPT STUDIOS INC. /// DARK MODE ONLY. THERE IS NO LIGHT MODE.
          </p>
        </div>
      </footer>
    </div>
  );
}
