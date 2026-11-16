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
        {/* hero: the name along the top and bottom edges, the face gathering out of clay dots between them */}
        <section data-track className="relative h-[170vh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <GLSlot scene="portrait" className="absolute inset-x-0 bottom-[22svh] top-[24svh] md:bottom-[20svh] md:top-[22svh]" />
            <h1 className="pointer-events-none absolute inset-0 font-display font-extrabold leading-[0.8] tracking-[-0.06em]">
              <span className="absolute inset-x-0 top-[72px] whitespace-nowrap px-[3.5vmin] text-center text-[min(17vw,19svh)] md:top-[78px] md:text-left">
                <Split text="EMMANUEL" />
              </span>
              <span className="absolute inset-x-0 bottom-6 whitespace-nowrap px-[3.5vmin] text-center text-[min(17vw,19svh)] text-orange md:text-right">
                <Split text="NNAWUOGO" from={1} />
              </span>
            </h1>
            <p className="intro-fade absolute right-[3.5vmin] top-[80px] hidden w-[min(28vw,24rem)] text-[15px] leading-relaxed md:block" style={{ "--fly-delay": "0.8s" } as React.CSSProperties}>
              Founder of Onenept Studios. I&apos;m a design engineer: I build the part of an AI product people actually touch, and I keep at it until someone who has never seen it can use it without asking me anything.
            </p>
          </div>
        </section>
        <p className="px-5 pb-12 text-base leading-relaxed md:hidden">
          Founder of Onenept Studios. I&apos;m a design engineer: I build the part of an AI product people actually touch, and I keep at it until someone who has never seen it can use it without asking me anything.
        </p>

        {/* the line: slides across the whole width, then cuts to ink */}
        <section data-track className="relative h-[280vh]" aria-label="How I work">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(28vw,36svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[22svh]" data-slide="0,0.46">
              The model is the engine.
            </p>
            <div className="absolute inset-0 flex items-center bg-ink text-lemon" data-at="0.48" data-cut>
              <p className="whitespace-nowrap pl-[3.5vmin] font-display text-[min(28vw,36svh)] font-extrabold leading-none tracking-[-0.06em] will-change-transform max-md:text-[22svh]" data-slide="0.48,0.86">
                My job is the dashboard.
              </p>
              <div className="absolute inset-x-0 bottom-0 grid gap-6 px-[3.5vmin] pb-7 text-paper md:grid-cols-2 md:gap-[4vw]" data-at="0.82">
                <p className="text-base leading-relaxed md:text-lg">
                  My training is in design thinking and human-computer interaction, not computer science. I write code with AI and always have. What I bring is the judgement about what goes on the screen, what stays off it, and how plain the words can get before they stop being true.
                </p>
                <p className="text-base leading-relaxed md:text-lg">
                  <span className="font-display font-extrabold text-orange">Where I&apos;m not your guy:</span> a backend with no screen, or deep infrastructure work. If it&apos;s an AI product real people have to understand, I am.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* shipped: a ledger across the whole width */}
        <section className="border-t-2 border-ink">
          <div className="px-[3.5vmin] py-20">
            <h2 className="whitespace-nowrap text-center font-display text-[21vw] font-extrabold leading-[0.78] tracking-[-0.07em]" data-fly>Shipped</h2>
            <ol className="mt-12 border-t-2 border-ink">
              {SHIPPED.map((s, i) => (
                <li key={s.name} className="grid gap-3 border-b-2 border-ink py-7 md:grid-cols-12 md:items-baseline md:gap-8" data-fly style={{ "--fly-delay": `${i * 0.08}s` } as React.CSSProperties}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group md:col-span-5">
                    <p className="flex items-center gap-3 font-display text-[min(7vw,11svh)] font-extrabold leading-none tracking-[-0.05em] group-hover:text-orange max-md:text-5xl">
                      {s.name}
                      <Arrow className="h-[0.4em] w-[0.4em] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </p>
                  </a>
                  <p className="leading-relaxed md:col-span-5">{s.what}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute md:col-span-2 md:text-right">{s.state}</p>
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

        {/* hire: the roles set across the whole width, one per line, alternating sides */}
        <section className="bg-lemon">
          <div className="px-[3.5vmin] py-20 md:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em]" data-fly>Open to remote and contract work</p>
            <ul className="mt-6 font-display text-[min(10.5vw,16svh)] font-extrabold leading-[0.88] tracking-[-0.06em] max-md:text-[8.4vw]">
              {ROLES.map((r, i) => (
                <li key={r} className={`whitespace-nowrap ${i % 2 ? "md:text-right" : ""}`} data-fly style={{ "--fly-delay": `${i * 0.08}s` } as React.CSSProperties}>{r}</li>
              ))}
            </ul>
            <a href={`mailto:${EMAIL}`} data-magnetic className="mt-12 block whitespace-nowrap font-display text-[7.6vw] font-extrabold leading-none tracking-[-0.06em] hover:text-orange">
              {EMAIL}
            </a>
            <dl className="mt-12 grid gap-6 border-t-2 border-ink pt-6 text-sm md:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">Studying</dt>
                <dd className="mt-1">MSc IT Management with Data Analytics, GBS Malta</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">Studied</dt>
                <dd className="mt-1">MSc Innovation, Strategy &amp; Entrepreneurship, Grenoble École de Management, with Distinction</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em]">Elsewhere</dt>
                <dd className="mt-1 font-mono text-xs">
                  <a href={COMPANY.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-orange">GitHub</a>
                  {"  ·  "}
                  <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-orange">LinkedIn</a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
