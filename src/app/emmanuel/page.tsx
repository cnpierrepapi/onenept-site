import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Stage from "../gl/stage";
import Reveal from "../reveal";
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

export default function Founder() {
  return (
    <div className="relative overflow-x-clip">
      <Reveal />
      <Nav />

      {/* hero: name big and low on the left, the orbits off the right edge */}
      <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden">
        <Stage scene="orbits" className="absolute -right-[40%] -top-[8%] bottom-[52%] left-[5%] -z-10 opacity-70 lg:inset-y-0 lg:-right-[30%] lg:left-[52%] lg:opacity-80" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-night to-transparent" />

        <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
          <div className="reveal flex items-center gap-4">
            <Image
              src="/founder.jpg"
              alt={COMPANY.founder}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover object-top grayscale"
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ice/80">Founder · Onenept Studios</p>
          </div>
          <h1 className="reveal mt-8 font-display text-[15vw] font-extrabold leading-[0.85] tracking-[-0.05em] sm:text-[11vw] lg:text-[9vw] 2xl:text-[132px]">
            Emmanuel
            <br />
            <span className="text-glow">Nnawuogo</span>
          </h1>
          <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-cream/75 sm:text-xl">
            I&apos;m a design engineer. I build the part of an AI product people actually touch, and I keep at it until someone who has never seen it can use it without asking me anything.
          </p>
        </div>
      </section>

      {/* how: one big statement, one small aside pushed down */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-5 py-28 sm:px-8 sm:py-36">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="reveal font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl">
              The model is the engine. My job is the dashboard.
            </h2>
            <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-cream/70">
              My training is in design thinking and human-computer interaction, not computer science. I write code with AI and always have. What I bring is the judgement about what goes on the screen, what stays off it, and how plain the words can get before they stop being true.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-48">
            <div className="reveal border-l-2 border-signal pl-6">
              <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Where I&apos;m not your guy.</h3>
              <p className="mt-4 leading-relaxed text-cream/65">
                A backend with no screen, or deep infrastructure work. If it&apos;s an AI product real people have to understand, I am.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* shipped: a ledger, not cards */}
      <section className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
          <h2 className="reveal font-display text-[13vw] font-extrabold leading-[0.85] tracking-[-0.05em] sm:text-[8vw] lg:text-[110px]">Shipped</h2>
          <ol className="mt-12 border-t border-white/15">
            {SHIPPED.map((s) => (
              <li key={s.name} className="reveal grid gap-3 border-b border-white/10 py-8 lg:grid-cols-12 lg:gap-8">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="group lg:col-span-4">
                  <p className="flex items-center gap-3 font-display text-3xl font-bold group-hover:text-signal sm:text-4xl">
                    {s.name}
                    <Arrow className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </p>
                </a>
                <p className="max-w-2xl leading-relaxed text-cream/75 lg:col-span-6">{s.what}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute lg:col-span-2 lg:text-right">{s.state}</p>
              </li>
            ))}
          </ol>
          <p className="reveal mt-10 max-w-xl leading-relaxed text-cream/65">
            When a platform I build on is wrong, I send the fix back. Four are merged, in Google&apos;s ADK, DataHub and CALL-E.{" "}
            <Link href="/#open-source" className="text-cream underline decoration-white/30 underline-offset-4 hover:text-signal">
              See them
            </Link>
          </p>
        </div>
      </section>

      {/* hire: the light band */}
      <section className="relative z-10 bg-cream text-night">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="reveal font-mono text-[11px] uppercase tracking-[0.28em] text-night/55">Open to remote and contract work</p>
            <ul className="reveal mt-6 space-y-1 font-display text-4xl font-extrabold leading-[1] tracking-[-0.04em] sm:text-6xl">
              {ROLES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <a
              href={`mailto:${EMAIL}`}
              className="reveal group mt-12 inline-flex max-w-full items-center gap-3 font-display text-2xl font-bold tracking-tight hover:text-signal sm:text-4xl"
            >
              <span className="min-w-0 break-all sm:break-normal">{EMAIL}</span>
              <Arrow className="h-[0.7em] w-[0.7em] shrink-0" />
            </a>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-10">
            <dl className="reveal divide-y divide-night/15 border-y border-night/15 text-sm">
              <div className="py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-night/50">Studying</dt>
                <dd className="mt-1">MSc IT Management with Data Analytics, GBS Malta</dd>
              </div>
              <div className="py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-night/50">Studied</dt>
                <dd className="mt-1">MSc Innovation, Strategy &amp; Entrepreneurship, Grenoble École de Management, with Distinction</dd>
              </div>
              <div className="py-4 font-mono text-xs">
                <a href={COMPANY.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-signal">
                  GitHub
                </a>
                {"  ·  "}
                <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-signal">
                  LinkedIn
                </a>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
