import type { Metadata } from "next";
import Reveal from "../../reveal";
import { Footer, MobileBar, Nav, Ticker } from "../../site";
import { Beat, CaseFoot, CaseHeader, Receipt } from "../case-parts";

const TITLE = "I predicted the list would rot :: Google ADK";
const DESC =
  "One config object holds 35 fields that belong in three different places in the request, and nothing says which is which. Put the tools in the wrong half and the call still returns 200. Filed, confirmed by a maintainer, and the fix is open at their ask.";

export const metadata: Metadata = {
  title: `${TITLE} :: Onenept Studios`,
  description: DESC,
  alternates: { canonical: "/case/adk" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://onenept.com/case/adk",
    type: "article",
  },
};

const SPLIT: [string, string][] = [
  ["8", "go to the top level"],
  ["22", "go inside generationConfig"],
  ["3", "never reach the wire"],
];

const ALSO = [
  {
    name: "ADK #2425",
    href: "https://github.com/google/adk-python/issues/2425",
    label: "open, live thread",
    line: "A design for cancelling a running agent. Someone building a competing library brought measurements, I brought the code path, and between us it turned out a stopped tool leaves a different mess depending on whether it was written with def or async def.",
  },
  {
    name: "ADK #2792",
    href: "https://github.com/google/adk-python/issues/2792",
    label: "open, awaiting a maintainer",
    line: "Stopping an agent early prints a stack trace for something you chose to do. The workaround is one line and it is in the thread.",
  },
  {
    name: "PYTHON-GENAI #782",
    href: "https://github.com/googleapis/python-genai/issues/782",
    label: "open, 53 comments deep",
    line: "Thinking spends two to three thousand tokens before writing a character, so any output limit under about 4k is a zero budget dressed as a generous one. Every call failed the same way across 400 pages until we found it.",
  },
];

export default function AdkCase() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Reveal />
      <Ticker />
      <Nav chip="PR OPEN" />
      <MobileBar />

      <CaseHeader
        index="02"
        kicker="GOOGLE AGENT DEVELOPMENT KIT"
        title={
          <>
            I SAID IT
            <br />
            <span className="text-outline">WOULD ROT.</span>
            <br />
            IT SHIPPED
            <br />
            <span className="text-sun">ROTTEN.</span>
          </>
        }
        standfirst="This one came out of building on the thing, not reading its tracker. Four reports went upstream. One is mine and is now a pull request, opened because a maintainer asked for it. The other three are other people's threads where I had the measurement that was missing."
        meta="22 TO 28 AUGUST 2026 :: FOUND WHILE BUILDING MIGRAGENT :: NOTHING MERGED YET"
      />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="space-y-16 lg:space-y-24">
          <Beat
            n="01"
            title="ONE OBJECT, THREE DESTINATIONS"
            body="Write your own model class for ADK and you are handed a single config object with 35 fields on it. On the wire those fields go to three different places. A few sit at the top of the request, most belong in a nested block, and a handful mean something only to the client library and are rejected by the endpoint. Nothing on the type tells you which is which."
          />

          <Beat
            n="02"
            title="THE FAILURE IS A 200"
            big
            body="Put the tools in the wrong half and nothing errors. The call returns 200 with a well formed answer in it. The tools are simply absent, so the model answers from memory instead of calling anything, and it reads like a model that decided not to use the tool. You go and rewrite your prompt. The bug is one dictionary key away and it never says a word."
            kicker="A silent wrong answer costs more than a crash. A crash tells you where to look."
            href="https://github.com/google/adk-python/issues/6880"
            link="issue #6880, with a repro that runs offline"
          />

          <Beat
            n="03"
            title="A MAINTAINER CHECKED IT"
            body="He cross-checked my field table against the client library's own converters and said it lines up. Then he suggested something better than my workaround: instead of flattening the config by hand, hand the whole thing to the converter the official library already uses on itself. He asked me to run it against the full field set before anything went up for review."
          />

          <Beat
            n="04"
            title="SO I RAN IT, AND IT CAUGHT ME"
            big
            body="I built a config with 33 of the 35 fields populated and pushed it through. The split came out clean, and nothing was silently lost. It also showed that the table I had published the day before was wrong."
            kicker="I said six fields go to the top level. It is eight. I had missed two, writing from the installed package, less than 24 hours earlier."
            href="https://github.com/google/adk-python/issues/6880#issuecomment-5413241023"
            link="the correction, in the thread"
          >
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/10 sm:grid-cols-3">
              {SPLIT.map(([fig, cap]) => (
                <div key={cap} className="bg-night px-5 py-6">
                  <p className="font-display text-5xl font-extrabold leading-none text-sun sm:text-6xl">
                    {fig}
                  </p>
                  <p className="mt-3 font-mono text-[11px] leading-5 tracking-[0.1em] text-ink/50">
                    {cap.toUpperCase()}
                  </p>
                </div>
              ))}
              <p className="bg-night px-5 pb-6 font-mono text-[11px] leading-5 text-ink/45 sm:col-span-3">
                8 + 22 + 3 = 33. THE TWO I MISSED WERE MODELARMORCONFIG AND
                SERVICETIER, BOTH TOP LEVEL.
              </p>
            </div>
          </Beat>

          <Beat
            n="05"
            title="THAT SETTLED THE ARGUMENT"
            body="I had been asking for one of two things: a documented table, or a helper that does the split for you. My own table going stale inside a day answered it. A written list is a second copy of the truth and it drifts, which is the same failure as the hand-rolled dictionary every custom model class is already writing. So: the helper. One copy of the mapping, and it moves when the library moves."
            kicker="I would rather write the version that cannot go stale than the version that documents the staleness."
          />

          <Beat
            n="06"
            title="OPENED AT THEIR ASK"
            big
            body="He came back with all three: the helper rather than the docs, on the ADK object rather than in the client library, and go ahead and put it up. It delegates to the library's own converter, strips a private routing key that is a 400 if you send it, covers the one field that changes name in transit, and re-raises the library's validation error with the field that actually caused it so the message points at your code instead of somebody else's."
          >
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">
              Thirteen tests. The one I care about walks every field on the
              config type and fails if a new one shows up that the helper cannot
              place. If the library grows a field and this thing cannot classify
              it, their build says so, instead of somebody finding out through a
              parameter that quietly went nowhere.
            </p>
            <Receipt
              chip="OPEN, IN REVIEW"
              tone="quiet"
              headline="feat(models): add LlmRequest.to_generate_content_body() (#6935)"
              href="https://github.com/google/adk-python/pull/6935"
              rows={[
                ["REPO", "google/adk-python"],
                ["SIZE", "3 files, 460 lines"],
                ["OPENED", "28 AUGUST 2026"],
              ]}
            />
          </Beat>
        </div>

        <CaseFoot
          label="THE HONEST PART"
          lead="Nothing of mine has merged in a Google repository. The pull request above is open and a maintainer asked for it, which is not the same thing as it landing."
          tail="I have watched a one line fix in the same folder sit for 25 days after the triager had already root caused it, so I am not going to pretend a date. Three of the four threads here are somebody else's, where all I brought was the measurement nobody had run yet. That still counts, it just counts as something other than a merge."
          nextHref="/case/datahub"
          nextLabel="CASE 01 :: DATAHUB, TWO MERGED"
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {ALSO.map((m) => (
            <a
              key={m.href}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group @container flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/15 bg-card/60 p-5 transition-transform hover:-translate-y-1 hover:border-ink/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-display text-[min(9cqw,1rem)] font-extrabold leading-[1.15] tracking-tight">
                  {m.name}
                </h4>
                <span className="shrink-0 font-mono text-ink/25 group-hover:text-sun">
                  &#8599;
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
                {m.line}
              </p>
              <span className="mt-4 min-w-0 break-words border-t border-ink/10 pt-3 font-mono text-[10px] tracking-[0.1em] text-sun/70 group-hover:text-sun">
                {m.label} &#8599;
              </span>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
