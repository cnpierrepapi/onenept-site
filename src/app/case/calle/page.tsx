import type { Metadata } from "next";
import Reveal from "../../reveal";
import { Footer, MobileBar, Nav, Ticker } from "../../site";
import { Beat, CaseFoot, CaseHeader, Receipt } from "../case-parts";

const TITLE = "It said done. Nobody answered. :: CALL-E";
const DESC =
  "A phone API reported a task completed, with high confidence, on a call that went to voicemail. I placed real calls until I could say what its fields actually mean, filed fourteen issues, six are fixed, and the tool that reads a call properly is merged into their repo.";

export const metadata: Metadata = {
  title: `${TITLE} :: Onenept Studios`,
  description: DESC,
  alternates: { canonical: "/case/calle" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://onenept.com/case/calle",
    type: "article",
  },
};

const SURFACES: [string, string][] = [
  ["3", "ways in: API, goal runs, MCP"],
  ["3", "vocabularies for how it ended"],
  ["0", "tables saying which is which"],
];

type Issue = [string, string, string, "FIXED" | "OPEN"];

const ISSUES: Issue[] = [
  ["calle-docs #39", "the auth example returns 405 for a good key and a bad one", "https://github.com/CALLE-AI/calle-docs/issues/39", "FIXED"],
  ["calle-docs #43", "the spec calls a field machine readable, the guide says never branch on it", "https://github.com/CALLE-AI/calle-docs/issues/43", "FIXED"],
  ["calle-docs #44", "task_completed is named for one question and defined as another", "https://github.com/CALLE-AI/calle-docs/issues/44", "FIXED"],
  ["integrations #107", "the key placeholder uses a prefix real keys do not have", "https://github.com/CALLE-AI/call-e-integrations/issues/107", "FIXED"],
  ["integrations #108", "agents are never told how to recover a call, so they place a second one", "https://github.com/CALLE-AI/call-e-integrations/issues/108", "FIXED"],
  ["integrations #109", "two packages install the same command and the skills call the wrong one", "https://github.com/CALLE-AI/call-e-integrations/issues/109", "FIXED"],
  ["calle-docs #40", "a finished status can arrive before the result does", "https://github.com/CALLE-AI/calle-docs/issues/40", "OPEN"],
  ["calle-docs #41", "a result comes back filled in on a call nobody spoke on", "https://github.com/CALLE-AI/calle-docs/issues/41", "OPEN"],
  ["calle-docs #42", "attempt timestamps lose their timezone", "https://github.com/CALLE-AI/calle-docs/issues/42", "OPEN"],
  ["ts sdk #17", "calls stop waiting at the status, goals wait for the result", "https://github.com/CALLE-AI/server-sdk-typescript/issues/17", "OPEN"],
  ["python sdk #30", "the same split, plus a poll interval of zero that hammers the API", "https://github.com/CALLE-AI/server-sdk-python/issues/30", "OPEN"],
  ["n8n node #3", "the same split, a third time", "https://github.com/CALLE-AI/n8n-nodes-calle/issues/3", "OPEN"],
  ["n8n node #4", "the phone masker shows the whole number at 8 or 9 digits", "https://github.com/CALLE-AI/n8n-nodes-calle/issues/4", "OPEN"],
  ["dify plugin #2", "the plugin points at the test docs host", "https://github.com/CALLE-AI/call-e-dify-plugin/issues/2", "OPEN"],
];

export default function CalleCase() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Reveal />
      <Ticker />
      <Nav chip="MERGED 11 SEP" />
      <MobileBar />

      <CaseHeader
        index="03"
        kicker="CALL-E, AI PHONE CALLS"
        title={
          <>
            IT SAID
            <br />
            <span className="text-outline">DONE.</span>
            <br />
            NOBODY
            <br />
            <span className="text-sun">ANSWERED.</span>
          </>
        }
        standfirst="CALL-E lets an agent pick up the phone and make a call for you. I built on it for a hackathon and kept hitting the same question: what actually happened on that call? The API has an answer. Quite often it is the wrong one, and it says it with high confidence."
        meta="31 AUGUST TO 11 SEPTEMBER 2026 :: REAL CALLS, NO PERSON ON THE OTHER END :: ONE PULL REQUEST MERGED"
      />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="space-y-16 lg:space-y-24">
          <Beat
            n="01"
            title="ONE QUESTION, THREE ANSWERS"
            body="There are three ways into CALL-E and each one reports how a call ended in its own words. One can say voicemail and busy. One has no word for either. The third has a failure code with no published list of values, and their own errors guide says not to branch on it. So I wrote a small library that reads all three onto the same scale, and every reading says where it came from: quoted from a field, worked out from other fields, or simply not there."
          >
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/10 sm:grid-cols-3">
              {SURFACES.map(([fig, cap]) => (
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
                &quot;NOT THERE&quot; IS THE IMPORTANT ONE. A MAPPING THAT CANNOT
                SAY A FACT IS MISSING WILL MAKE ONE UP.
              </p>
            </div>
          </Beat>

          <Beat
            n="02"
            title="A VOICEMAIL BOX FINISHED THE JOB"
            big
            body="Early on I dialled my own phone and it went to voicemail. The agent asked its question into the beep three times and hung up. The API came back completed, task_completed true, confidence high. Sitting in the same object, the result field said the answer was unknown. The payload disagreed with itself and the field everybody branches on picked the wrong side."
            kicker="Nothing in my mapping was wrong. Each field was read faithfully. The missing rule was about the pair: a job marked done on a call where nobody established a person was there."
          />

          <Beat
            n="03"
            title="CONFIDENCE CANNOT TELL THEM APART"
            body="So I needed a call with a known right answer and nobody bothered by it. The US speaking clock is a recorded line that exists to be called, and what it says is checkable to the second. The agent heard the time and got it right. That real success and the voicemail box that answered nothing scored two hundredths apart, under the same label. There is no threshold you can set between them. Anyone gating on the score is gating on noise."
            href="https://github.com/CALLE-AI/calle-docs/issues/44"
            link="calle-docs #44, fixed a week later"
          />

          <Beat
            n="04"
            title="THE CLOCK THAT MOVES"
            big
            body="Read a finished call straight away and the attempt times are fine: a timezone, fractions of a second. Read the same call a minute later and they have been rewritten. The zone is gone, the time has moved four hours, and the fractions are rounded off. After that it stays wrong. A billing check or a support ticket always reads it later, so it always gets the bad copy."
            href="https://github.com/CALLE-AI/awesome-phone-call-agents/issues/196"
            link="the validation, on their p1 issue that asked for it"
          >
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">
              Another builder had already reported failed calls showing zero
              duration and blamed the failure path. Their issue was tagged as
              needing validation. I posted a reproduction that disagreed with
              their theory: it is about when you read, not whether the call
              failed. I also said plainly which part of their report my data
              could not explain. The event stream never moved in any read, so
              the tool treats events as the clock and the attempt fields as a
              rumour.
            </p>
          </Beat>

          <Beat
            n="05"
            title="AND I WAS WRONG, MORE THAN ONCE"
            big
            body="My library read an automated phone menu as a human picking up. The screen said a person answered and it was safe to act on. That one switched off the exact safety rule the whole thing exists for, and a live call caught it, not my hundred tests. The reviewer caught the rest. My demo would let anyone who guessed a call id read that call. I shipped two real phone numbers after ticking the box that said all numbers were fictional. My first pull request carried payloads from real calls, and I closed it myself."
            kicker="Every one of those is fixed and written up in the thread where it happened. The reviewer asked for four rounds of changes and was right every time."
          />

          <Beat
            n="06"
            title="FOURTEEN ISSUES, SIX FIXED"
            body="While building I kept a defect log and filed it in the right repos: the docs, the two SDKs, the CLI and plugins. A maintainer fixed five of them in one night and closed each one with a merged change. Two of them he rated top priority."
          >
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">
              The one I am proudest of shows up three times. The TypeScript
              SDK, the Python SDK and the n8n node all stop waiting the moment
              a call&apos;s status says finished, and all three do the opposite
              for goal runs. Three codebases, written separately, with the same
              bug. That is not three careless authors. It is one sentence in
              the docs, and they all believed it.
            </p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/15 bg-card/60">
              <table className="w-full min-w-[34rem] table-fixed border-collapse font-mono text-xs">
                <colgroup>
                  <col className="w-[30%]" />
                  <col />
                  <col className="w-[16%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-ink/15 text-left text-ink/40">
                    <th className="px-4 py-3 font-normal tracking-[0.14em]">
                      WHERE
                    </th>
                    <th className="px-4 py-3 font-normal tracking-[0.14em]">
                      WHAT
                    </th>
                    <th className="px-4 py-3 text-right font-normal tracking-[0.14em]">
                      STATE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ISSUES.map(([where, what, href, state]) => (
                    <tr
                      key={href}
                      className="border-b border-ink/10 last:border-0"
                    >
                      <td className="px-4 py-3 align-top">
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink/80 hover:text-sun"
                        >
                          {where}
                        </a>
                      </td>
                      <td className="px-4 py-3 align-top leading-5 text-ink/55">
                        {what}
                      </td>
                      <td
                        className={`px-4 py-3 text-right align-top ${
                          state === "FIXED" ? "text-sun" : "text-ink/45"
                        }`}
                      >
                        {state}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Beat>

          <Beat
            n="07"
            title="MERGED"
            big
            body="The contribution is a skill that teaches an agent to read what actually happened to a call, plus a small app that shows it. It flags calls that are stuck, calls that are replays, retries that would ring someone twice, and durations that cannot be trusted. Each flag maps to an issue somebody else had already filed and nobody had built against."
          >
            <Receipt
              chip="ON MAIN"
              headline="feat(call-state-reconciler): read what actually happened to a call (#337)"
              href="https://github.com/CALLE-AI/awesome-phone-call-agents/pull/337"
              rows={[
                ["COMMIT", "fc43128f2c"],
                ["REPO", "CALLE-AI/awesome-phone-call-agents"],
                ["LANDED", "11 SEPTEMBER 2026"],
              ]}
            />
            <a
              href="https://asheard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-sun/80 hover:text-sun"
            >
              the hosted version, asheard.vercel.app &#8599;
            </a>
          </Beat>
        </div>

        <CaseFoot
          label="THE HONEST PART"
          lead="This repo merges a lot, so a merge here is not rare. The part worth reading is the issue table and the reviews."
          tail="Eight of the fourteen issues are still open and have not been touched since I filed them. The library is on npm as asheard and the hosted app still places real calls to the speaking clock, so you can watch the API say done on a recording yourself."
          nextHref="/case/datahub"
          nextLabel="CASE 01 :: DATAHUB, TWO MERGED"
        />
      </section>

      <Footer />
    </div>
  );
}
