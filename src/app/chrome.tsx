"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { DoorMark } from "./brand";

const EMAIL = "admin@onenept.com";
const LINKS: [string, string, boolean][] = [
  ["/#adfontes", "AD FONTES", false],
  ["/labs", "Labs", true],
  ["/#company", "Company", false],
  ["/emmanuel", "Founder", true],
];

export function Arrow({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    // a new page closes the menu
    setLastPath(pathname);
    setOpen(false);
  }
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-4 py-3 sm:px-8 sm:py-4">
          <Link href="/" data-shutter className="flex items-center gap-2 rounded-full bg-paper/80 py-1.5 pl-1.5 pr-4 backdrop-blur-md" aria-label="onenept, home">
            <DoorMark className="h-8 w-8" />
            <span className="font-display text-xl font-extrabold tracking-[-0.04em]">onenept</span>
          </Link>
          <nav className="hidden items-center gap-1 rounded-full bg-paper/80 p-1.5 backdrop-blur-md md:flex">
            {LINKS.map(([href, label, wipe]) => (
              <Link key={href} href={href} data-shutter={wipe ? "" : undefined} className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={`mailto:${EMAIL}`} data-magnetic className="hidden items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-ink sm:inline-flex">
              Talk to us <Arrow />
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>
      <div
        id="menu"
        className={`fixed inset-0 z-40 flex flex-col justify-end bg-lemon px-5 pb-10 transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${open ? "[clip-path:circle(150%_at_90%_5%)]" : "pointer-events-none [clip-path:circle(0%_at_90%_5%)]"}`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col">
          {LINKS.map(([href, label, wipe]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} data-shutter={wipe ? "" : undefined} className="border-b-2 border-ink py-3 font-display text-5xl font-extrabold tracking-[-0.04em]">
              {label}
            </Link>
          ))}
        </nav>
        <a href={`mailto:${EMAIL}`} className="mt-8 font-mono text-sm underline underline-offset-4">{EMAIL}</a>
      </div>
    </>
  );
}

/* follows html[data-motion], which the motion layer sets */
function subscribeMotion(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => mo.disconnect();
}

function MotionSwitch() {
  const mode = useSyncExternalStore(subscribeMotion, () => document.documentElement.dataset.motion || "full", () => "full");
  const set = (m: "full" | "calm") => {
    window.dispatchEvent(new CustomEvent("onenept:motion", { detail: m }));
  };
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-ink p-0.5">
      <span className="px-2">Motion</span>
      {(["full", "calm"] as const).map((m) => (
        <button key={m} onClick={() => set(m)} aria-pressed={mode === m} className={`rounded-full px-2.5 py-0.5 ${mode === m ? "bg-ink text-paper" : ""}`}>
          {m}
        </button>
      ))}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-8 font-mono text-[11px] leading-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p>© {new Date().getFullYear()} Onenept Studios Inc. · 611 South Dupont Highway, Suite 102, Dover, DE 19901, United States</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={`mailto:${EMAIL}`} className="hover:text-orange">{EMAIL}</a>
          <a href="https://github.com/cnpierrepapi" target="_blank" rel="noopener noreferrer" className="hover:text-orange">GitHub</a>
          <Link href="/privacy" data-shutter className="hover:text-orange">Privacy</Link>
          <MotionSwitch />
        </div>
      </div>
    </footer>
  );
}
