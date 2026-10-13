import Link from "next/link";

export const COMPANY = {
  legal: "Onenept Studios Inc.",
  kind: "A Delaware C corporation",
  street: "611 South Dupont Highway, Suite 102",
  city: "Dover, DE 19901",
  country: "United States",
  email: "admin@onenept.com",
  founder: "Chukwudumaga Nnawuogo",
  linkedin: "https://www.linkedin.com/in/cenpierrepapi/",
  github: "https://github.com/cnpierrepapi",
};

export function Arrow({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Mark({ className = "h-6 w-6" }: { className?: string }) {
  /* the mark: a ring with one point lit on it, a node on a path */
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="23.4" cy="8.6" r="3.6" fill="#ff6b2c" />
    </svg>
  );
}

const LINKS: [string, string][] = [
  ["/#work", "Work"],
  ["/#open-source", "Open source"],
  ["/#company", "Company"],
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-night/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-cream">
          <Mark />
          <span className="font-display text-xl font-bold tracking-tight">onenept</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-mute sm:inline">
            studios
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-1.5 text-sm text-cream/75 transition-colors hover:bg-white/5 hover:text-cream"
            >
              {label}
            </Link>
          ))}
        </nav>
        <a
          href={`mailto:${COMPANY.email}`}
          className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-medium text-night transition-colors hover:bg-signal"
        >
          Talk to us
          <Arrow />
        </a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-night">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-10 font-mono text-[11px] leading-5 text-mute sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p>
          © {new Date().getFullYear()} {COMPANY.legal} · {COMPANY.street}, {COMPANY.city},{" "}
          {COMPANY.country}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${COMPANY.email}`} className="hover:text-cream">
            {COMPANY.email}
          </a>
          <a href={COMPANY.github} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
            GitHub
          </a>
          <Link href="/privacy" className="hover:text-cream">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
