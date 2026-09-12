import Link from "next/link";

/* The date every state on the site was last checked against GitHub. Change it
   only after re-checking, because the stamp and the ledger both print it. */
export const CALIBRATED = "11 SEP 2026";

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

/* Top strip. Static on purpose: a record does not scroll past you. */
export function CertBar() {
  return (
    <div className="relative z-10 bg-ink py-2 font-mono text-[10px] tracking-[0.18em] text-paper">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5">
        <span className="truncate">
          ONENEPT STUDIOS INC.
          <span className="hidden sm:inline"> :: CALIBRATION RECORD</span>
        </span>
        <span className="shrink-0">LAST CALIBRATED {CALIBRATED}</span>
      </div>
    </div>
  );
}

const LINKS: [string, string][] = [
  ["/#cases", "CASES"],
  ["/#ledger", "LEDGER"],
  ["/#errata", "ERRATA"],
  ["/#rules", "RULES"],
];

/* chip: the short status in the top right on mobile */
export function Nav({ chip = "OPEN TO WORK" }: { chip?: string }) {
  return (
    <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
      <Link
        href="/"
        className="font-serif text-2xl font-semibold tracking-tight"
      >
        onenept
        <span className="ml-1.5 align-middle font-mono text-[9px] tracking-[0.2em] text-ink/55">
          STUDIOS
        </span>
      </Link>
      <div className="hidden items-center gap-6 font-mono text-xs text-ink/70 sm:flex">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} className="hover:text-ink">
            {label}
          </Link>
        ))}
        <a
          href="mailto:admin@onenept.com"
          className="border border-ink px-3 py-1.5 text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          CONTACT
        </a>
      </div>
      <span className="inline-flex items-center gap-2 border border-ink/40 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.18em] text-ink/80 sm:hidden">
        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
        {chip}
      </span>
    </nav>
  );
}

export function MobileBar() {
  const items: [string, string, string][] = [
    ["/#cases", "01", "CASES"],
    ["/#ledger", "02", "LEDGER"],
    ["/#errata", "03", "ERRATA"],
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/25 bg-paper/95 backdrop-blur sm:hidden">
      <div className="grid grid-cols-4 font-mono text-[10px] tracking-[0.08em] text-ink/75">
        {items.map(([href, n, label]) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 py-3 active:text-ink"
          >
            <span className="text-ink/45">{n}</span>
            {label}
          </Link>
        ))}
        <a
          href="mailto:admin@onenept.com"
          className="flex flex-col items-center gap-1 py-3 active:text-ink"
        >
          <span className="text-ink/45">@</span>CONTACT
        </a>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t-2 border-ink bg-paper-2">
      <div className="mx-auto w-full max-w-6xl px-5 pb-28 pt-14 sm:py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Onenept Studios
            </p>
            <p className="mt-3 font-mono text-xs leading-6 text-ink/65">
              ONENEPT STUDIOS INC.
              <br />
              AVAILABLE FOR CONTRACT WORK. REMOTE.
            </p>
          </div>
          <p className="cal-stamp self-start px-4 py-2 font-mono text-[11px] leading-5 text-ink/75 sm:self-auto">
            CALIBRATED {CALIBRATED}
            <br />
            AGAINST GITHUB
          </p>
        </div>
        <div className="mt-10 flex items-center gap-6 font-mono text-xs text-ink/70">
          <a href="mailto:admin@onenept.com" className="hover:text-ink">
            EMAIL
          </a>
          <a
            href="https://github.com/cnpierrepapi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            GITHUB
          </a>
          <a
            href="https://www.linkedin.com/in/cenpierrepapi/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            LINKEDIN
          </a>
        </div>
        <p className="mt-10 font-mono text-[10px] leading-5 text-ink/50">
          © {new Date().getFullYear()} ONENEPT STUDIOS INC. /// EVERY STATE ON
          THIS SITE LINKS TO THE THING THAT PROVES IT.
        </p>
      </div>
    </footer>
  );
}
