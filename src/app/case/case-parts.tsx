import Link from "next/link";
import { ExternalArrow } from "../site";

/* One numbered clause of a report. Whatever hangs off it, a reading band, a
   table or a receipt, comes in as children so no two clauses look alike. */
export function Clause({
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
    <div className="reveal grid gap-4 border-t border-ink/20 pt-8 lg:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] lg:gap-10">
      <p className="font-mono text-xs tracking-[0.16em] text-ink/55">§{n}</p>
      <div className="min-w-0">
        <h3
          className={`font-serif font-semibold tracking-tight ${
            big
              ? "text-3xl leading-tight sm:text-4xl"
              : "text-2xl leading-snug sm:text-[1.75rem]"
          }`}
        >
          {title}
        </h3>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink/80">
          {body}
        </p>

        {kicker && (
          <p className="mt-6 max-w-2xl border-l-2 border-ink pl-5 font-serif text-xl italic leading-relaxed">
            {kicker}
          </p>
        )}

        {children}

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink/75 underline decoration-ink/30 underline-offset-4 hover:text-ink"
          >
            {link} <ExternalArrow className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

/* A band of measured figures, read off the source rather than typed. */
export function Readings({
  items,
  note,
}: {
  items: [string, string][];
  note?: string;
}) {
  return (
    <div className="mt-8 border border-ink/30 bg-paper">
      <div className="grid sm:grid-cols-3">
        {items.map(([fig, cap], i) => (
          <div
            key={cap}
            className={`px-5 py-5 ${
              i > 0 ? "border-t border-ink/15 sm:border-l sm:border-t-0" : ""
            }`}
          >
            <p className="num font-mono text-4xl font-medium leading-none sm:text-5xl">
              {fig}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase leading-5 tracking-[0.08em] text-ink/65">
              {cap}
            </p>
          </div>
        ))}
      </div>
      {note && (
        <p className="border-t border-ink/15 px-5 py-4 font-mono text-[11px] uppercase leading-5 tracking-[0.05em] text-ink/70">
          {note}
        </p>
      )}
    </div>
  );
}

/* Scroll box for a wide table, so only the table scrolls on a phone. */
export function TableBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 overflow-x-auto border border-ink/30 bg-paper">
      {children}
    </div>
  );
}

/* The landed code. Same shape for a merge and for an open pull request,
   because either way the point is that you can go and look. */
export function Receipt({
  chip,
  headline,
  href,
  rows,
  tone = "ok",
}: {
  chip: string;
  headline: string;
  href: string;
  rows: [string, string][];
  tone?: "ok" | "open";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-8 block border-2 border-ink bg-paper p-6 transition-colors hover:bg-paper-2 sm:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] ${
            tone === "ok" ? "border-ok text-ok" : "border-ink/40 text-ink/75"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              tone === "ok" ? "bg-ok" : "bg-ink/50"
            }`}
          />
          {chip}
        </span>
        <ExternalArrow className="h-5 w-5 shrink-0 text-ink/40 transition-colors group-hover:text-ink" />
      </div>
      <p className="mt-6 break-words font-mono text-sm leading-6 sm:text-base">
        {headline}
      </p>
      <div className="mt-6 grid gap-2 font-mono text-xs sm:grid-cols-3">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={`flex justify-between gap-4 pb-2 sm:block sm:border-0 sm:pb-0 ${
              i === rows.length - 1 ? "" : "border-b border-ink/15"
            }`}
          >
            <span className="text-ink/55">{k}</span>
            <span className="min-w-0 break-words text-right sm:mt-1 sm:block sm:text-left">
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
  meta: [string, string][];
}) {
  return (
    <header className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:pt-12">
      <Link
        href="/#cases"
        className="reveal inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-ink/60 hover:text-ink"
      >
        &#8592; ALL REPORTS
      </Link>
      <p className="reveal mt-8 font-mono text-xs tracking-[0.28em] text-ink/60">
        REPORT {index} :: {kicker}
      </p>
      <h1 className="reveal mt-5 max-w-4xl font-serif text-[11vw] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="reveal mt-8 max-w-3xl text-xl leading-relaxed text-ink/80">
        {standfirst}
      </p>
      <dl className="reveal mt-10 grid border-t-2 border-ink sm:grid-cols-3">
        {meta.map(([k, v]) => (
          <div key={k} className="border-b border-ink/15 py-3 sm:pr-6">
            <dt className="font-mono text-[10px] tracking-[0.18em] text-ink/55">
              {k}
            </dt>
            <dd className="mt-1 font-mono text-xs">{v}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

/* Bottom of a report: the honest paragraph, then the way out. */
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
    <div className="reveal mt-20 border-t-2 border-ink pt-10 lg:grid lg:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] lg:gap-10">
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink/60">
        {label}
      </p>
      <div className="mt-4 max-w-2xl lg:mt-0">
        <p className="font-serif text-2xl leading-snug">{lead}</p>
        <p className="mt-4 leading-relaxed text-ink/70">{tail}</p>
        <Link
          href={nextHref}
          className="mt-8 inline-flex items-center gap-2 border-2 border-ink px-5 py-2.5 font-mono text-xs tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
        >
          {nextLabel} &#8594;
        </Link>
      </div>
    </div>
  );
}

export type Thread = { name: string; href: string; label: string; line: string };

/* Related threads, as rows rather than cards. */
export function Threads({ items }: { items: Thread[] }) {
  return (
    <div className="reveal mt-16">
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink/60">
        RELATED THREADS
      </p>
      <ul className="mt-3 border-t border-ink/30">
        {items.map((m) => (
          <li key={m.href} className="border-b border-ink/15">
            <a
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-2 py-5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,11rem)] sm:gap-6"
            >
              <span className="font-mono text-xs group-hover:underline">
                {m.name}
              </span>
              <span className="text-[0.95rem] leading-relaxed text-ink/75">
                {m.line}
              </span>
              <span className="font-mono text-[10px] tracking-[0.08em] text-ink/60 sm:text-right">
                {m.label} &#8599;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
