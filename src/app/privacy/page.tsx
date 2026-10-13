import type { Metadata } from "next";
import { COMPANY, Footer, Nav } from "../site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What onenept.com collects, which is almost nothing.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "13 October 2026";

export default function Privacy() {
  return (
    <div className="relative min-h-screen">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">Last updated {UPDATED}</p>
        <h1 className="mt-6 font-display text-5xl font-extrabold tracking-[-0.04em] sm:text-7xl">Privacy</h1>
        <div className="mt-12 space-y-8 text-lg leading-relaxed text-cream/75">
          <p>
            Short version: this site doesn&apos;t ask you for anything. There are no accounts, no forms, no cookies, and no analytics or ad trackers on it.
          </p>
          <section>
            <h2 className="font-display text-2xl font-bold text-cream">What gets logged</h2>
            <p className="mt-3">
              The site is hosted on Vercel. Like any web host, Vercel handles the request when you load a page, which includes your IP address and browser details, and keeps short-lived logs to run and protect the service. We don&apos;t add anything on top of that. Fonts are served from this site, not from a third party.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-cream">If you email us</h2>
            <p className="mt-3">
              We get your email address and whatever you wrote. We use it to reply, and that&apos;s it. We don&apos;t sell it or add you to a list. Ask us to delete it and we will.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-cream">Our products</h2>
            <p className="mt-3">
              Warmleads, SYZYGY and asheard run on their own sites and each has its own terms. This page only covers onenept.com.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-cream">Who we are</h2>
            <p className="mt-3">
              {COMPANY.legal}, {COMPANY.street}, {COMPANY.city}, {COMPANY.country}.{" "}
              <a href={`mailto:${COMPANY.email}`} className="text-cream underline decoration-white/30 underline-offset-4 hover:decoration-signal">
                {COMPANY.email}
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
