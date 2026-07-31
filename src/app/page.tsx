import Image from "next/image";
import Reveal from "./reveal";

const TICKER = [
  "HALLMARK :: LIVE",
  "ARIADNE :: LIVE",
  "WHERE DID THIS COME FROM",
  "PROVENANCE OVER PROMISES",
  "SETTLE EVERYTHING",
  "ONENEPT STUDIOS INC",
];

const FLAGSHIPS = [
  {
    name: "HALLMARK",
    href: "https://hallmark-rust.vercel.app",
    label: "hallmark-rust.vercel.app",
    thesis:
      "Data provenance for AI advertising. Every generated asset carries its own record inside the file: which model made it, from which prompt, which person signed it off. Change one byte after sign-off and the file says so.",
    rows: [
      ["MARK", "C2PA credential, signed"],
      ["PRIVACY", "public proof, private prompts"],
      ["TAMPER", "one edited byte fails the check"],
    ],
  },
  {
    name: "ARIADNE",
    href: "https://ariadne-five.vercel.app",
    label: "ariadne-five.vercel.app",
    thesis:
      "Lineage-grounded root cause for production ML. When a model starts behaving differently, the cause is upstream. Ariadne walks the column-level lineage from the prediction back to the table that moved, then reads that hop against the rules the model has to answer to.",
    rows: [
      ["TRACE", "column level, prediction to source"],
      ["REGIMES", "four, one unchanged engine"],
      ["OUTPUT", "a record a regulator can read"],
    ],
  },
];

const DEAD_BOOK = [
  {
    name: "WETOWS",
    span: "2018",
    thesis: "Zero-capital social commerce for Africa.",
    cause: "off-thesis. A two-sided cold start is the opposite of the desk.",
  },
  {
    name: "CONFAM",
    span: "2025",
    thesis: "Verified tipsters for Nigerian bettors.",
    cause: "a nine-year incumbent already owned the lane. Dead in two days.",
  },
  {
    name: "BOOTROOM",
    span: "2026",
    thesis: "Live football calls for the group chat.",
    cause: "lost the three-product race it was born into. The other two shipped.",
  },
  {
    name: "HUSTLEBOOKS",
    span: "2026",
    thesis: "Books, bookings and an AI sales desk for the multi-hustle economy.",
    cause:
      "a market that never pays. Its dark theme survives as the skin of this page.",
  },
  {
    name: "SPOTR",
    span: "2026",
    thesis: "Bet on anything, as long as it is live.",
    cause:
      "bad actors found the exploit and named their price, and the marketing partner walked at halftime with nothing delivered. The tech held up better than the environment.",
  },
];

const RULES = [
  ["01", "Live data or nothing.", "If it does not run against real data arriving in real time, it is a slide, not a product."],
  ["02", "Every output carries its record.", "Where it came from travels inside the thing itself, not in a spreadsheet somebody has to be trusted to keep."],
  ["03", "Evidence holds the kill switch.", "Sunk cost does not get a vote. A position that misses its gate closes the same day."],
  ["04", "The other side is scraped, not onboarded.", "No cold starts. The data is already there on day one, so the product is useful to customer number one."],
  ["05", "Settle everything.", "A claim that cannot be traced back to a record is marketing. Every call gets graded against what actually happened."],
  ["06", "One operator, many positions.", "Small desk, sharp knife. The portfolio is the strategy."],
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
          <a href="#positions" className="hover:text-sun">POSITIONS</a>
          <a href="#deadbook" className="hover:text-sun">DEAD BOOK</a>
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
          2 LIVE
        </span>
      </nav>

      {/* mobile desk bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-night/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-4 font-mono text-[10px] tracking-[0.08em] text-ink/70">
          <a href="#positions" className="flex flex-col items-center gap-1 py-3 active:text-sun">
            <span className="text-sun">01</span>POSITIONS
          </a>
          <a href="#deadbook" className="flex flex-col items-center gap-1 py-3 active:text-sun">
            <span className="text-rust">02</span>DEAD BOOK
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
          ONENEPT STUDIOS :: ONE OPERATOR :: MALTA
        </p>
        {/* mobile hero: mixed-scale stack, every line sized to fit the screen */}
        <h1 className="reveal mt-6 font-display font-extrabold leading-[0.95] sm:hidden">
          <span className="block text-[21vw] tracking-tight">SHIP</span>
          <span className="block text-[21vw] tracking-tight text-outline-sun">
            LIVE.
          </span>
          <span className="mt-2 block text-[9.5vw] tracking-tight">
            <span className="text-outline">PROVE</span> THE
          </span>
          <span className="block text-[9.5vw] tracking-tight text-sun">
            DATA.
          </span>
        </h1>
        {/* desktop hero */}
        <h1 className="reveal mt-6 hidden font-display font-extrabold leading-[0.92] sm:block">
          <span className="block tracking-tight sm:text-8xl lg:text-9xl">
            SHIP <span className="text-outline-sun">LIVE.</span>
          </span>
          <span className="block tracking-tight sm:text-8xl lg:text-9xl">
            <span className="text-outline">PROVE</span> THE
          </span>
          <span className="block tracking-tight text-sun sm:text-8xl lg:text-9xl">
            DATA.
          </span>
        </h1>
        <div className="reveal mt-10 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end">
          <p className="text-lg leading-relaxed text-ink/70">
            A one-person data studio run like a trading desk. Two products, one
            question: where did this come from. A picture, a prediction. Each
            one ships with the record that answers it.
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

      {/* open positions */}
      <section id="positions" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="reveal mb-10 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            <span className="font-mono text-base text-sun sm:text-xl">01 ::</span>{" "}
            OPEN POSITIONS
          </h2>
          <p className="hidden font-mono text-xs text-ink/40 sm:block">
            TWO DATA PRODUCTS. BOTH LIVE RIGHT NOW.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {FLAGSHIPS.map((f, i) => (
            <a
              key={f.name}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`reveal group relative @container flex min-w-0 flex-col overflow-hidden rounded-3xl border border-ink/15 bg-card p-6 shadow-brut transition-transform hover:-translate-y-1.5 sm:p-8 ${
                i === 1 ? "md:translate-y-10" : ""
              }`}
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

      {/* dead book */}
      <section id="deadbook" className="relative z-10 border-y border-ink/10 bg-night/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-24">
          <div className="reveal mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              <span className="font-mono text-base text-rust sm:text-xl">02 ::</span>{" "}
              THE DEAD BOOK
            </h2>
            <p className="hidden font-mono text-xs text-ink/40 sm:block">
              MEMENTO :: THE ONES THAT CAME BEFORE
            </p>
          </div>
          <p className="reveal max-w-2xl leading-relaxed text-ink/60">
            Five products came before the data desk. Each one was a position:
            opened with conviction, closed by evidence. They are named here
            because the kills are the process, not the shame.
          </p>

          <div className="mt-12">
            {DEAD_BOOK.map((d) => (
              <div key={d.name} className="reveal">
                <div className="receipt-tear" />
                <div className="flex flex-col gap-3 py-7 sm:flex-row sm:items-start sm:gap-8">
                  <span className="stamp mt-1 inline-block w-fit shrink-0 rounded-md px-2.5 py-1 font-mono text-[10px] font-bold">
                    SETTLED :: NO
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[min(6.8vw,1.5rem)] font-extrabold tracking-tight text-ink/85 sm:text-3xl">
                      {d.name}
                      <span className="mt-1 block font-mono text-xs font-normal text-ink/35 sm:ml-3 sm:mt-0 sm:inline sm:align-middle">
                        {d.span}
                      </span>
                    </h3>
                    <p className="mt-2 text-ink/70">{d.thesis}</p>
                    <p className="mt-1 font-mono text-xs text-rust/90">
                      CAUSE :: {d.cause}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="receipt-tear" />
          </div>

          <p className="reveal mt-8 font-mono text-xs text-ink/35">
            BOOK CLOSED AT 5. THE NEXT ENTRY EARNS ITS LINE THE SAME WAY.
          </p>
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
              SCROLL UP: FIVE NAMES PAID FOR THEM.
            </p>
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
              DATA PRODUCTS. EVERY OUTPUT TRACED TO ITS SOURCE.
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
