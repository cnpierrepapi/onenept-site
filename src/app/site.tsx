import Link from "next/link";

export const TICKER = [
  "AVAILABLE FOR CONTRACT WORK",
  "TWO MERGED INTO DATAHUB :: AUG 2026",
  "ADK HELPER PR OPEN AT A MAINTAINER'S ASK",
  "THE DOCS AND THE CODE DISAGREE",
  "PROVE IT OR IT DID NOT HAPPEN",
  "SETTLE EVERYTHING",
  "ONENEPT STUDIOS INC",
];

export function ExternalArrow({ className }: { className?: string }) {
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

export function Ticker() {
  const tape = [...TICKER, ...TICKER];
  return (
    <div className="marquee border-b border-ink/15 bg-night py-2.5 font-mono text-[11px] tracking-[0.18em] text-sun">
      <div className="marquee-track">
        {tape.map((t, i) => (
          <span key={i} className="mx-6">
            {t} <span className="mx-6 text-ink/30">{"///"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* chip: the short status word in the top right on mobile */
export function Nav({ chip = "CODE ON MASTER" }: { chip?: string }) {
  return (
    <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
      <Link href="/" className="font-display text-lg font-bold tracking-tight">
        one<span className="rounded-md bg-sun px-1.5 py-0.5">nept</span>
      </Link>
      <div className="hidden items-center gap-5 font-mono text-xs text-ink/60 sm:flex">
        <Link href="/#cases" className="hover:text-sun">
          THE CASES
        </Link>
        <Link href="/#positions" className="hover:text-sun">
          PRODUCTS
        </Link>
        <Link href="/#rules" className="hover:text-sun">
          RULES
        </Link>
        <a
          href="mailto:admin@onenept.com"
          className="rounded-full border border-ink/20 px-3 py-1.5 hover:border-sun hover:text-sun"
        >
          CONTACT
        </a>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ink/70 sm:hidden">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-sun" />
        {chip}
      </span>
    </nav>
  );
}

export function MobileBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-night/95 backdrop-blur sm:hidden">
      <div className="grid grid-cols-4 font-mono text-[10px] tracking-[0.08em] text-ink/70">
        <Link
          href="/#cases"
          className="flex flex-col items-center gap-1 py-3 active:text-sun"
        >
          <span className="text-sun">01</span>THE CASES
        </Link>
        <Link
          href="/#positions"
          className="flex flex-col items-center gap-1 py-3 active:text-sun"
        >
          <span className="text-sun">02</span>PRODUCTS
        </Link>
        <Link
          href="/#rules"
          className="flex flex-col items-center gap-1 py-3 active:text-sun"
        >
          <span className="text-sun">03</span>RULES
        </Link>
        <a
          href="mailto:admin@onenept.com"
          className="flex flex-col items-center gap-1 py-3 active:text-sun"
        >
          <span className="text-sun">@</span>CONTACT
        </a>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
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
          © {new Date().getFullYear()} ONENEPT STUDIOS INC. /// DARK MODE ONLY.
          THERE IS NO LIGHT MODE.
        </p>
      </div>
    </footer>
  );
}
