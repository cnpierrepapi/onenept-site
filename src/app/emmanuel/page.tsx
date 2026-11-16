import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import GLSlot from "../fx/GLSlot";
import { Arrow, COMPANY, Footer, Nav } from "../site";

export const metadata: Metadata = {
  title: "Emmanuel Nnawuogo",
  description:
    "Founder of Onenept Studios and a design engineer. He builds the part of an AI product people actually touch. Open to remote and contract work.",
  alternates: { canonical: "/emmanuel" },
};

const EMAIL = "cnpierrepapi@gmail.com";

const SHIPPED: { name: string; href: string; what: string; state: string }[] = [
  {
    name: "AD FONTES",
    href: "https://adfontes.fun",
    what: "A blockchain game you start with an email. No wallet popup and no crypto words on screen, while every move underneath is a real transaction.",
    state: "Live on NEAR testnet",
  },
  {
    name: "FUGITIVA",
    href: "https://fugitiva.onenept.com",
    what: "A journal of case files on women behind the crimes people assume men commit. Bauhaus layout, masks drawn in code, every source linked.",
    state: "Live",
  },
  {
    name: "Melax",
    href: "https://github.com/cnpierrepapi/melax",
    what: "A bitcoin wallet in Wolof, French and English for phones with buttons. Its setup guide only ticks a step when the server proves it happened.",
    state: "Learning project",
  },
];

const ROLES = ["Design Engineer", "UX Engineer", "AI Product Engineer"];

function Split({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className="split-word intro-hide">
            <span style={{ "--i": from + i } as React.CSSProperties}>{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

export default function Founder() {
  return (
    <div className="relative">
      <Nav />
      <main className="relative z-10">
        {/* hero: the portrait gathers out of scattered clay dots */}
        <section data-track className="relative h-[170vh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <GLSlot scene="portrait" className="absolute inset-x-0 top-[9svh] h-[50svh] md:inset-y-0 md:left-[48%] md:right-0 md:h-full" />
            <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-10 sm:px-8 md:justify-center md:pb-0">
              <p className="intro-fade font-mono text-[11px] uppercase tracking-[0.26em] text-mute" style={{ "--fly-delay": "0.4s" } as React.CSSProperties}>
                Founder · Onenept Studios
              </p>
              <h1 className="mt-4 font-display text-[17vw] font-extrabold leading-[0.82] tracking-[-0.06em] md:text-[10vw] 2xl:text-[150px]">
                <Split text="Emmanuel" />
                <br />
                <span className="text-orange">
                  <Split text="Nnawuogo" from={1} />
                </span>
              </h1>
              <p className="intro-fade mt-6 max-w-md text-base leading-relaxed sm:text-lg" style={{ "--fly-delay": "0.8s" } as React.CSSProperties}>
                I&apos;m a design engineer. I build the part of an AI product people actually touch, and I keep at it until someone who has never seen it can use it without asking me anything.
              </p>
            </div>
          </div>
        </section>

        {/* how */}
        <section className="mx-auto max-w-[1500px] px-5 py-28 sm:px-8 sm:py-36">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.045em] sm:text-7xl" data-fly>
                The model is the engine. My job is the dashboard.
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed" data-fly style={{ "--fly-delay": "0.1s" } as React.CSSProperties}>
                My training is in design thinking and human-computer interaction, not computer science. I write code with AI and always have. What I bring is the judgement about what goes on the screen, what stays off it, and how plain the words can get before they stop being true.
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:pt-40">
              <div className="rotate-[2deg] rounded-3xl border-2 border-ink bg-orange p-6 shadow-[8px_8px_0_#15120F]" data-fly style={{ "--fly-rot": "8deg" } as React.CSSProperties}>
                <h3 className="font-display text-3xl font-extrabold tracking-[-0.03em]">Where I&apos;m not your guy.</h3>
                <p className="mt-3 leading-relaxed">
                  A backend with no screen, or deep infrastructure work. If it&apos;s an AI product real people have to understand, I am.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* shipped */}
        <section className="border-t-2 border-ink" data-flash="lemon">
          <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8">
            <h2 className="font-display text-[20vw] font-extrabold leading-[0.8] tracking-[-0.07em] md:text-[12vw]" data-fly>Shipped</h2>
            <ol className="mt-12 border-t-2 border-ink">
              {SHIPPED.map((s, i) => (
                <li key={s.name} className="grid gap-3 border-b-2 border-ink py-8 lg:grid-cols-12 lg:gap-8" data-fly style={{ "--fly-delay": `${i * 0.08}s` } as React.CSSProperties}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group lg:col-span-4">
                    <p className="flex items-center gap-3 font-display text-4xl font-extrabold tracking-[-0.03em] group-hover:text-orange">
                      {s.name}
                      <Arrow className="h-6 w-6 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </p>
                  </a>
                  <p className="max-w-2xl leading-relaxed lg:col-span-6">{s.what}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute lg:col-span-2 lg:text-right">{s.state}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-xl leading-relaxed" data-fly>
              When a platform I build on is wrong, I send the fix back. Four are merged, in Google&apos;s ADK, DataHub and CALL-E.{" "}
              <Link href="/#open-source" data-shutter className="font-semibold underline decoration-2 underline-offset-4 hover:text-orange">
                See them
              </Link>
            </p>
          </div>
        </section>

        {/* hire: the lemon band */}
        <section className="bg-lemon">
          <span className="block h-px" data-flash="lemon" />
          <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em]" data-fly>Open to remote and contract work</p>
              <ul className="mt-6 space-y-1 font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.045em] sm:text-7xl">
                {ROLES.map((r, i) => (
                  <li key={r} data-fly style={{ "--fly-delay": `${i * 0.08}s` } as React.CSSProperties}>{r}</li>
                ))}
              </ul>
              <a href={`mailto:${EMAIL}`} data-magnetic className="group mt-12 inline-flex max-w-full items-center gap-3 font-display text-2xl font-extrabold tracking-[-0.03em] hover:text-orange sm:text-4xl">
                <span className="min-w-0 break-all sm:break-normal">{EMAIL}</span>
                <Arrow className="h-[0.7em] w-[0.7em] shrink-0" />
              </a>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:pt-10">
              <dl className="divide-y-2 divide-ink border-y-2 border-ink text-sm" data-fly>
                <div className="py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">Studying</dt>
                  <dd className="mt-1">MSc IT Management with Data Analytics, GBS Malta</dd>
                </div>
                <div className="py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">Studied</dt>
                  <dd className="mt-1">MSc Innovation, Strategy &amp; Entrepreneurship, Grenoble École de Management, with Distinction</dd>
                </div>
                <div className="py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">Elsewhere</dt>
                  <dd className="mt-1 font-mono text-xs">
                    <a href={COMPANY.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-orange">GitHub</a>
                    {"  ·  "}
                    <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-orange">LinkedIn</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
