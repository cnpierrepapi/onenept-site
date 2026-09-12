import type { Metadata } from "next";
import Reveal from "../../reveal";
import { CertBar, Footer, MobileBar, Nav } from "../../site";
import {
  CaseFoot,
  CaseHeader,
  Clause,
  Readings,
  Receipt,
  TableBox,
  Threads,
  type Thread,
} from "../case-parts";

const TITLE = "The docs and the code disagreed :: DataHub incidents";
const DESC =
  "DataHub said which things could have an incident raised against them. The list had drifted from the code. I wrote the script that reads the answer out of the source, gave half the work away, and two pull requests are on master.";

export const metadata: Metadata = {
  title: `${TITLE} :: Onenept Studios`,
  description: DESC,
  alternates: { canonical: "/case/datahub" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://onenept.com/case/datahub",
    type: "article",
  },
};

const FIGURES: [string, string][] = [
  ["10", "types accept an incident"],
  ["7", "carry the summary aspect"],
  ["5", "could be read back"],
];

const GATES: [string, string, string, string][] = [
  ["1", "Write allowlist", "IncidentInfo.pdl", "ALREADY THERE"],
  ["2", "Summary aspect", "entity-registry.yml", "MINE"],
  ["3", "GraphQL schema", "incident.graphql", "MINE"],
  ["4", "Resolver wiring", "GmsGraphQLEngine.java", "MINE"],
  ["5", "Tab badge", "entity page query", "BUILT, NOT WANTED YET"],
  ["6", "Incident tab", "web react fragments", "BUILT, NOT WANTED YET"],
  ["7", "Agent tooling", "mcp_tools/incidents.py", "STILL OPEN"],
];

const ALSO: Thread[] = [
  {
    name: "DATAHUB #18685",
    href: "https://github.com/datahub-project/datahub/pull/18685",
    label: "open, waiting on a review",
    line: "The docs half. It was held while other work changed the table. That work has landed or been parked, the table it prints is true of master, and it is waiting on a fresh look from a reviewer.",
  },
  {
    name: "DATAHUB #18684",
    href: "https://github.com/datahub-project/datahub/pull/18684",
    label: "open, awaiting a reviewer",
    line: "Two self-hosted failures that produce no error at all. Each cost an afternoon and left nothing to search for.",
  },
  {
    name: "DATAHUB SKILLS #66",
    href: "https://github.com/datahub-project/datahub-skills/pull/66",
    label: "open, with reviewers",
    line: "What breaks downstream if this table or column changes. The question every data team asks before a migration.",
  },
];

export default function DataHubCase() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Reveal />
      <CertBar />
      <Nav chip="TWO ON MASTER" />
      <MobileBar />

      <CaseHeader
        index="01"
        kicker="DATAHUB, METADATA AND LINEAGE"
        title={
          <>
            The page was wrong. <span className="text-off">So was I.</span>
          </>
        }
        standfirst="Anyone can get a typo fix merged. This is the other thing: reading somebody else's codebase until you can tell the team something about their own project they had not written down yet, and having them write it down."
        meta={[
          ["WHEN", "28 JULY TO 24 AUGUST 2026"],
          ["WHERE", "datahub-project/datahub"],
          ["STATUS", "TWO PULL REQUESTS ON MASTER"],
        ]}
      />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="space-y-14 lg:space-y-20">
          <Clause
            n="01"
            title="The page was wrong"
            body="DataHub documents which kinds of things can have an incident raised against them. A table can. A dashboard can. The published list had drifted from the code and had been wrong for a while, quietly, the way documentation goes wrong."
            href="https://github.com/datahub-project/datahub/pull/18685"
            link="PR #18685"
          />

          <Clause
            n="02"
            title="So was I"
            big
            body="My first correction was also wrong. I wrote that one file was the gate that blocks a write, and that machine learning models get rejected. Neither is true. The maintainer asked for changes and he was right to. I went back and posted the correction myself, twice, once for an input shape I had copied wrong and once for a readback claim I had simply invented."
            kicker="This is the part I would keep if I had to delete the rest of the page."
            href="https://github.com/datahub-project/datahub/pull/18685#issuecomment-5306551155"
            link="the correction"
          />

          <Clause
            n="03"
            title="Stop checking by hand"
            body="Reading six files by eye is how the list went wrong in the first place. So I stopped reading and wrote the check. It parses the write allowlist, the registry, the schema and the resolver wiring, then prints the table. It runs inside the build, so the docs cannot drift again without the build noticing."
          >
            <Readings
              items={FIGURES}
              note="The gap: five types accepted an incident and could never show it again. Nothing errored. That is why nobody had caught it."
            />
          </Clause>

          <Clause
            n="04"
            title="Gave half of it away"
            body="Someone else had scoped the machine learning half before I filed anything. I found his thread after mine was open. So I handed him those entities and kept the column level one, which nobody was looking at. He shipped his in two pull requests. Mine was one. All three are on master now."
            href="https://github.com/datahub-project/datahub/issues/18911"
            link="his RFC, filed first"
          />

          <Clause
            n="05"
            title="They made it the rule"
            body="The maintainer opened a tracker and made it the single place this work gets planned from. It runs on gates: every layer a thing has to clear before anyone can honestly say it supports incidents. He had named three when we started. The tracker has seven. The truth table inside it is the one my script prints, and the rule at the top of it, do not ship a write path without a read path, is the failure I filed."
            href="https://github.com/datahub-project/datahub/issues/19322"
            link="the tracker"
          >
            <TableBox>
              <table className="w-full min-w-[34rem] border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-ink/30 text-left text-ink/55">
                    <th className="px-4 py-3 font-normal tracking-[0.14em]">
                      GATE
                    </th>
                    <th className="px-4 py-3 font-normal tracking-[0.14em]">
                      WHAT IT CONTROLS
                    </th>
                    <th className="px-4 py-3 font-normal tracking-[0.14em]">
                      SOURCE
                    </th>
                    <th className="px-4 py-3 text-right font-normal tracking-[0.14em]">
                      SCHEMAFIELD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GATES.map(([g, what, src, who]) => (
                    <tr key={g} className="border-b border-ink/15 last:border-0">
                      <td className="px-4 py-3 text-ink/55">{g}</td>
                      <td className="px-4 py-3">{what}</td>
                      <td className="px-4 py-3 text-ink/60">{src}</td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-right ${
                          who === "MINE" ? "font-medium text-ok" : "text-ink/60"
                        }`}
                      >
                        {who}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>
            <p className="mt-3 font-mono text-[11px] leading-5 text-ink/55">
              GATES 5 AND 6 WERE BUILT AFTER THIS TABLE WAS WRITTEN. SEE §07
              FOR WHY THEY ARE NOT ON MASTER.
            </p>
          </Clause>

          <Clause
            n="06"
            title="Merged"
            big
            body="Approved, taken out of draft and queued by the maintainer himself, then squashed onto master by a bot while I was asleep."
          >
            <Receipt
              chip="ON MASTER"
              headline="feat(incidents): add incident support for schemaField (#19115)"
              href="https://github.com/datahub-project/datahub/commit/8c823661e6b457c2c8843c60346d4ea8aa63d900"
              rows={[
                ["COMMIT", "8c823661e6"],
                ["REPO", "datahub-project/datahub"],
                ["LANDED", "20 AUGUST 2026"],
              ]}
            />
          </Clause>

          <Clause
            n="07"
            title="Then they handed back the rest"
            big
            body="Gates 5 and 6, the tab you would actually click, were out of scope on purpose. After the merge the maintainer agreed a plan on the tracker: the permission check first, with tests, then the tab. That first half is now on master too, four days after the other one."
          >
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/80">
              The check was asking the wrong question. Editing an incident on a
              column was authorized against the column, and nobody holds
              permissions on a column, so a dataset policy never matched and only
              platform admins got through. Ship the tab on top of that and it
              renders for everybody, the count is right, and the button is dead
              for everyone who is not an admin. That is worse than no tab.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink/80">
              It now asks about the parent instead, which is where permissions
              already live and what the frontend had been assuming all along.
              Fixing it turned up two private copies of the same check sitting in
              two different resolvers, byte for byte identical. Patch the shared
              one and the button would still have disagreed with the mutation
              behind it. Both go through one check now.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink/80">
              Then I built the tab, got it green, and asked before opening it.
              The answer was no, for now. An incident on a column but not on
              its table is a strange thing to show people, and the product
              team has not decided what it should look like. That is a product
              call, not a code one. The branch sits on my fork, unopened, and
              nobody spent review time on a pull request they did not want.
            </p>
            <Receipt
              chip="ON MASTER"
              headline="fix(incidents): authorize field incidents against the parent entity (#19405)"
              href="https://github.com/datahub-project/datahub/commit/1eeb440e658213989b90c434edb01961b197cc2c"
              rows={[
                ["COMMIT", "1eeb440e65"],
                ["REPO", "datahub-project/datahub"],
                ["LANDED", "24 AUGUST 2026"],
              ]}
            />
          </Clause>
        </div>

        <CaseFoot
          label="THE REST"
          lead="Two pull requests of mine are on master. A third was built and not opened, because the maintainer said the product was not ready for it. The other threads here are still open."
          tail="I am leaving that here because it was true before either merge and it is the reason they happened. The finding stood on a script anyone could run, months before a busy maintainer got to it."
          nextHref="/case/adk"
          nextLabel="REPORT 02 :: GOOGLE ADK"
        />

        <Threads items={ALSO} />
      </section>

      <Footer />
    </div>
  );
}
