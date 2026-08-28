import Link from "next/link";
import { ExternalArrow } from "../site";

/* One numbered beat of a case study. The extra that hangs off a beat, a table
   or a figure band or a receipt, is passed as children so no two beats have to
   look alike. */
export function Beat({
  n,
  title,
  big,
  children,
  body,
  kicker,
  href,
  link,
}: {
  n: string;
  title: string;
  big?: boolean;
  body: string;
  kicker?: string;
  href?: string;
  link?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="reveal grid gap-5 lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] lg:gap-10">
      <div className="lg:pt-2">
        <p className="font-mono text-4xl font-bold leading-none text-outline lg:text-6xl">
          {n}
        </p>
      </div>
      <div className="min-w-0">
        <h3
          className={`font-display font-extrabold tracking-tight ${
            big ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {title}
        </h3>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink/70">{body}</p>

        {kicker && (
          <p className="mt-5 max-w-2xl border-l-2 border-sun/60 pl-4 text-lg leading-relaxed text-ink/85">
            {kicker}
          </p>
        )}

        {children}

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-sun/80 hover:text-sun"
          >
            {link} <ExternalArrow className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

/* The landed-code card. Same shape whether the receipt is a merge commit or an
   open pull request, because the point is that you can go and look. */
export function Receipt({
  chip,
  headline,
  href,
  rows,
  tone = "sun",
}: {
  chip: string;
  headline: string;
  href: string;
  rows: [string, string][];
  tone?: "sun" | "quiet";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group mt-8 block overflow-hidden rounded-2xl border bg-card p-6 shadow-brut transition-transform hover:-translate-y-1 sm:p-8 ${
        tone === "sun" ? "border-sun/40" : "border-ink/25"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.2em] ${
            tone === "sun"
              ? "border-sun/40 text-sun"
              : "border-ink/25 text-ink/70"
          }`}
        >
          <span
            className={`live-dot h-1.5 w-1.5 rounded-full ${
              tone === "sun" ? "bg-sun" : "bg-ink/50"
            }`}
          />
          {chip}
        </span>
        <ExternalArrow className="h-5 w-5 shrink-0 text-ink/30 transition-colors group-hover:text-sun" />
      </div>
      <p className="mt-6 break-words font-mono text-sm leading-6 text-ink/85 sm:text-base">
        {headline}
      </p>
      <div className="mt-6 grid gap-2 font-mono text-xs sm:grid-cols-3">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={`flex justify-between gap-4 pb-2 sm:block sm:border-0 sm:pb-0 ${
              i === rows.length - 1 ? "" : "border-b border-ink/10"
            }`}
          >
            <span className="text-ink/40">{k}</span>
            <span
              className={`sm:mt-1 sm:block ${
                i === 0 && tone === "sun" ? "text-sun" : "text-ink/80"
              }`}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </a>
  );
}

export function CaseHeader({
  index,
  kicker,
  title,
  standfirst,
  meta,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  standfirst: string;
  meta: string;
}) {
  return (
    <header className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:pt-14">
      <Link
        href="/#cases"
        className="reveal inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-ink/45 hover:text-sun"
      >
        &#8592; ALL CASES
      </Link>
      <p className="reveal mt-8 font-mono text-xs tracking-[0.3em] text-sun/80">
        CASE {index} :: {kicker}
      </p>
      <h1 className="reveal mt-5 max-w-4xl font-display text-[9vw] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="reveal mt-8 max-w-3xl text-lg leading-relaxed text-ink/70">
        {standfirst}
      </p>
      <p className="reveal mt-8 border-t border-ink/15 pt-4 font-mono text-[11px] tracking-[0.14em] text-ink/40">
        {meta}
      </p>
    </header>
  );
}

/* Bottom of a case study: the honest paragraph, then the way out. */
export function CaseFoot({
  label,
  lead,
  tail,
  nextHref,
  nextLabel,
}: {
  label: string;
  lead: string;
  tail: string;
  nextHref: string;
  nextLabel: string;
}) {
  return (
    <div className="reveal mt-24 border-t border-ink/15 pt-10 lg:grid lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] lg:gap-10">
      <p className="font-mono text-[11px] tracking-[0.18em] text-sun/70">
        {label}
      </p>
      <div className="mt-4 max-w-2xl lg:mt-0">
        <p className="text-lg leading-relaxed text-ink/85">{lead}</p>
        <p className="mt-4 leading-relaxed text-ink/60">{tail}</p>
        <Link
          href={nextHref}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-sun/50 px-5 py-2.5 font-mono text-xs tracking-[0.14em] text-sun transition-colors hover:bg-sun hover:text-night"
        >
          {nextLabel} &#8594;
        </Link>
      </div>
    </div>
  );
}
