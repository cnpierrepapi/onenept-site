import Image from "next/image";
import Reveal from "./reveal";

const TICKER = [
  "AVAILABLE FOR CONTRACT WORK",
  "DATAHUB :: METADATA :: LINEAGE",
  "THE DOCS AND THE CODE DISAGREE",
  "PROVE IT OR IT DID NOT HAPPEN",
  "SETTLE EVERYTHING",
  "ONENEPT STUDIOS INC",
];

const UPSTREAM = [
  {
    repo: "datahub-project/datahub",
    href: "https://github.com/datahub-project/datahub/pull/18685",
    label: "PR #18685 and the thread around it",
    found:
      "The page listing which entity types support incidents was wrong, and so was my first correction of it. Support is declared in six separate files that no longer agree, and nobody had counted them.",
    proof:
      "Derived all six from the source with a script after the hand-written version had already been wrong once. Ten entity types accept an incident, seven carry the summary aspect, five can be read back. The table is now generated at build time instead of typed by hand.",
    rows: [
      ["SURFACES", "six, where the maintainer named three"],
      ["DRIFT", "10 write / 7 summary / 5 readable"],
      ["FIX", "generated from source, not maintained"],
    ],
  },
  {
    repo: "datahub-project/datahub",
    href: "https://github.com/datahub-project/datahub/issues/18999",
    label: "Issue #18999 and PR #19115",
    found:
      "Raising an incident on an ML model returns a URN and looks like it worked. Nothing can read it back. The write is accepted at one layer and invisible at the next, so no error is ever reported.",
    proof:
      "Opened the issue, released the ML half of the claim to another contributor who had scoped it first rather than duplicating him, and took the schemaField half. Held it in draft while an authorization question was open instead of pushing it through.",
    rows: [
      ["BEHAVIOUR", "accepted, unreadable, no error"],
      ["SCOPE", "released the overlap, kept one piece"],
      ["STATE", "open, deliberately still a draft"],
    ],
  },
];

const UPSTREAM_MORE = [
  {
    name: "DATAHUB #18684",
    href: "https://github.com/datahub-project/datahub/pull/18684",
    label: "datahub-project/datahub",
    line: "Two self-hosted failures that produce no error at all. The startup ping blocks the handshake for forty seconds on a host that cannot reach telemetry; entity type is silently trimmed out of search results. Each cost an afternoon and left nothing to search for.",
  },
  {
    name: "DATAHUB SKILLS #66",
    href: "https://github.com/datahub-project/datahub-skills/pull/66",
    label: "datahub-project/datahub-skills",
    line: "A skill that answers the question every data team asks before a migration: what breaks downstream if this table or column changes.",
  },
];

const FLAGSHIPS = [
  {
    name: "ARIADNE",
    href: "https://ariadne-five.vercel.app",
    label: "ariadne-five.vercel.app",
    thesis:
      "Lineage-grounded root cause for production ML, built on DataHub. When a model starts behaving differently, the cause is upstream. Ariadne walks the column-level lineage from the prediction back to the table that moved, then reads that hop against the rules the model has to answer to.",
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
          <a href="#upstream" className="hover:text-sun">UPSTREAM</a>
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
          OPEN TO WORK
        </span>
      </nav>

      {/* mobile desk bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-night/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-4 font-mono text-[10px] tracking-[0.08em] text-ink/70">
          <a href="#upstream" className="flex flex-col items-center gap-1 py-3 active:text-sun">
            <span className="text-sun">01</span>UPSTREAM
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
          run like a trading desk
        </span>
        <p className="reveal font-mono text-xs tracking-[0.3em] text-ink/50">
          ONENEPT STUDIOS :: ONE OPERATOR :: REMOTE
        </p>
        {/* mobile hero: mixed-scale stack, every line sized to fit the screen */}
        <h1 className="reveal mt-6 font-display font-extrabold leading-[0.95] sm:hidden">
          <span className="block text-[21vw] tracking-tight">READ</span>
          <span className="block text-[21vw] tracking-tight text-outline-sun">
            CODE.
          </span>
          <span className="mt-2 block text-[9.5vw] tracking-tight">
            <span className="text-outline">PROVE</span> THE
          </span>
          <span className="block text-[9.5vw] tracking-tight text-sun">
            GAPS.
          </span>
        </h1>
        {/* desktop hero */}
        <h1 className="reveal mt-6 hidden font-display font-extrabold leading-[0.92] sm:block">
          <span className="block tracking-tight sm:text-8xl lg:text-9xl">
            READ <span className="text-outline-sun">CODE.</span>
          </span>
          <span className="block tracking-tight sm:text-8xl lg:text-9xl">
            <span className="text-outline">PROVE</span> THE
          </span>
          <span className="block tracking-tight text-sun sm:text-8xl lg:text-9xl">
            GAPS.
          </span>
        </h1>
        <div className="reveal mt-10 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end">
          <p className="text-lg leading-relaxed text-ink/70">
            I find the places where a codebase and its own documentation
            disagree, and I prove it with a script anyone can run. Then I build
            products on the same principle. Available now for contract work,
            remote, through Onenept Studios Inc.
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
      <section id="upstream" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="reveal mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            <span className="font-mono text-base text-sun sm:text-xl">01 ::</span>{" "}
            IN OTHER PEOPLE&apos;S CODEBASES
          </h2>
          <p className="hidden font-mono text-xs text-ink/40 sm:block">
            PUBLIC THREADS. NOTHING PRIVATE, NOTHING CLAIMED.
          </p>
        </div>
        <p className="reveal max-w-2xl leading-relaxed text-ink/60">
          The work I would most want read. Every line below is a public thread
          with named maintainers in it, including the parts where I was wrong
          and said so.
        </p>
        <p className="reveal mb-10 mt-4 max-w-2xl border-l-2 border-ink/20 pl-4 font-mono text-xs leading-6 text-ink/45">
          NOTHING HERE IS MERGED YET. Every one of these is open. I would rather
          say that than round it up, and it is the same reason the work is worth
          reading: the finding stands on a script you can run, not on whether a
          busy maintainer got to it.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {UPSTREAM.map((u, i) => (
            <a
              key={u.href}
              href={u.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`reveal group relative @container flex min-w-0 flex-col overflow-hidden rounded-3xl border border-ink/15 bg-card p-6 shadow-brut transition-transform hover:-translate-y-1.5 sm:p-8 ${
                i === 1 ? "md:translate-y-10" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-ink/70">
                  <span className="min-w-0 truncate">{u.repo}</span>
                </span>
                <ExternalArrow className="h-5 w-5 shrink-0 text-ink/30 transition-colors group-hover:text-sun" />
              </div>
              <h3 className="mt-6 font-display text-[min(7.2cqw,1.6rem)] font-extrabold leading-[1.15] tracking-tight">
                {u.label}
              </h3>
              <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-sun/70">
                WHAT I FOUND
              </p>
              <p className="mt-2 leading-relaxed text-ink/70">{u.found}</p>
              <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-sun/70">
                HOW I PROVED IT
              </p>
              <p className="mt-2 flex-1 leading-relaxed text-ink/70">{u.proof}</p>
              <div className="mt-8 space-y-2 font-mono text-xs">
                {u.rows.map(([k, v]) => (
                  <div key={k} className="flex min-w-0 justify-between gap-4 border-b border-ink/10 pb-2">
                    <span className="shrink-0 text-ink/40">{k}</span>
                    <span className="min-w-0 break-words text-right text-ink/80">{v}</span>
                  </div>
                ))}
              </div>
              <span className="mt-6 font-mono text-[11px] text-sun/80 group-hover:text-sun">
                read the thread ↗
              </span>
            </a>
          ))}
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2">
          {UPSTREAM_MORE.map((m) => (
            <a
              key={m.href}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group @container flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/15 bg-card/60 p-5 transition-transform hover:-translate-y-1 hover:border-ink/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-display text-[min(9cqw,1.15rem)] font-extrabold leading-[1.15] tracking-tight">
                  {m.name}
                </h4>
                <ExternalArrow className="h-4 w-4 shrink-0 text-ink/25 transition-colors group-hover:text-sun" />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
                {m.line}
              </p>
              <span className="mt-4 min-w-0 break-words border-t border-ink/10 pt-3 font-mono text-[10px] tracking-[0.1em] text-sun/70 group-hover:text-sun">
                {m.label} ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* open positions */}
      <section id="positions" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="reveal mb-10 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            <span className="font-mono text-base text-sun sm:text-xl">02 ::</span>{" "}
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
              <h3 className="mt-6 font-display text-[min(9.4cqw,2.25rem)] font-extrabold leading-[1.1] tracking-tight">
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
        <h2 className="reveal mb-12 font-display text-3xl font-bold sm:text-5xl">
          <span className="font-mono text-base text-sun sm:text-xl">03 ::</span>{" "}
          DESK RULES
        </h2>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {RULES.map(([n, title, body]) => (
            <div key={n} className="reveal">
              <p className="font-mono text-4xl font-bold text-outline">{n}</p>
              <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
            </div>
          ))}
          <div className="reveal flex items-end">
            <p className="font-mono text-xs leading-6 text-ink/35">
              THE RULES ARE NOT ASPIRATIONAL.
              <br />
              SCROLL UP: THE THREADS PAID FOR THEM.
            </p>
          </div>
        </div>
      </section>

      {/* why this domain */}
      <section className="relative z-10 border-t border-ink/10 bg-night/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="reveal grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <h2 className="font-display text-2xl font-bold leading-tight sm:text-4xl">
              WHY ONENEPT.COM
              <br />
              <span className="text-outline">AND NOT MY NAME</span>
            </h2>
            <div className="max-w-2xl space-y-4 leading-relaxed text-ink/70">
              <p>
                Onenept Studios is a real company. It is how the work ships and
                how it gets invoiced, and it is why a first contract needs no
                paperwork set up from scratch.
              </p>
              <p>
                Putting my name on the door would suggest these are portfolio
                exercises. They are not. Five of them are dead on the record so
                that the ones still running have to have earned it.
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
          <p className="font-display text-[min(10.2vw,2.25rem)] font-extrabold tracking-tight sm:text-6xl">
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
