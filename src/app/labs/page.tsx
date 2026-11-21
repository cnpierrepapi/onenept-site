import type { Metadata } from "next";
import { PriceBars, TENCHA_SOURCE } from "../matcha";
import { COMPANY, Footer, Nav } from "../site";

export const metadata: Metadata = {
  title: "For labs",
  description:
    "AD FONTES season two is a matcha supply chain you can drop an agent into. It starts on a real date, plays back what really happened, and the ledger keeps score.",
  alternates: { canonical: "/labs" },
};

const CHAIN = ["Tea farm", "Stone mill", "Exporter", "Importer", "Café"];

const DECIDES = [
  "Who to buy leaf from, and whether to lock in a season's price or buy as it goes.",
  "How much to order and when. Air is fast and dear, sea is slow.",
  "What a café pays per kilo, and what a tin costs online.",
  "Which cafés get stock when there isn't enough for all of them.",
  "Where the ad money goes.",
  "Which jobs need a person, and who to hire. Tasting a lot, packing tins, a café visit.",
  "A few calls every week, like next month's leaf price, or whether a shipment lands on time.",
];

const HIDDEN = [
  "The future. Harvests, prices and the yen arrive a week at a time, the way they really did.",
  "How much stock an exporter really has, and who it serves first when it rations.",
  "What each café actually uses in a week, how much it'll pay, and whether it's about to switch.",
  "What rivals do next.",
  "Whether the person it hired shows up.",
  "The grade of a lot, until someone tastes it.",
];

const SCORE: [string, string][] = [
  ["Health", "fill rate: how much of each café order went out on time"],
  ["Damage", "stock-outs"],
  ["Score", "margin"],
  ["Stamina", "days of cash left"],
  ["Calls", "how close its weekly calls came to what happened"],
];

const GET: [string, string][] = [
  ["A private run", "Your agent goes through start dates we've never published. You get the full ledger and a scored report. Nothing about the run is made public."],
  ["The world", "A licence to run it on your own machines. Reset it as often as you like, same seed, same history."],
  ["Human shifts", "People who've worked in food and drink play the same weeks, turn by turn. You get their runs to train on or to measure against."],
];

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t-2 border-ink py-12 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{n}</p>
        <h2 className="mt-2 font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-5xl">{title}</h2>
      </div>
      <div className="text-[17px] leading-relaxed md:col-span-8">{children}</div>
    </section>
  );
}

export default function Labs() {
  return (
    <div className="relative z-10 min-h-screen">
      <Nav />
      <main className="px-[3.5vmin] pb-24 pt-32 md:pt-40">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em]">For labs · AD FONTES season two</p>
        <h1 className="mt-6 max-w-[16ch] font-display text-[min(11vw,8.5rem)] font-extrabold leading-[0.86] tracking-[-0.06em]">
          Your agent. A matcha business. <span className="text-orange">Two real years.</span>
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="max-w-2xl text-xl leading-relaxed md:col-span-7">
            It&apos;s a supply chain you can drop an agent into. It starts on a real date. Everything outside the agent&apos;s own shop plays back what actually happened, so the answer key is history itself. The ledger keeps score.
          </p>
          <div className="md:col-span-4 md:col-start-9">
            <PriceBars className="w-full max-w-sm" />
            <p className="mt-2 font-mono text-[10px] leading-4 text-mute">
              Kyoto matcha leaf, first flush, average price a kilo at the JA Zen-Noh Kyoto tea market. 2026 is to 19 June.{" "}
              <a href={TENCHA_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-orange">Source</a>
            </p>
          </div>
        </div>

        <ol className="mt-16 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-2xl font-extrabold tracking-[-0.03em] md:text-4xl" aria-label="The chain">
          {CHAIN.map((c, i) => (
            <li key={c} className="flex items-center gap-3">
              <span className={i % 2 ? "text-cobalt" : ""}>{c}</span>
              {i < CHAIN.length - 1 && <span aria-hidden="true" className="text-orange">→</span>}
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <Block n="01" title="Where it starts">
            <p>
              Say Monday 4 March 2024. The agent opens a matcha importer that sells to London cafés and online. It gets the world as it stood that morning: leaf prices by region, exporters&apos; price sheets and minimum orders, freight times, the pound against the yen, how many cafés put matcha on the menu, what rivals charge, what a packer costs an hour.
            </p>
            <p className="mt-4">
              The news comes in dated. Market reports, harvest notes, exporters&apos; announcements. It only ever sees what had been published by that week. One turn is one week, and a season runs two years.
            </p>
          </Block>

          <Block n="02" title="What it decides">
            <ul className="space-y-3">
              {DECIDES.map((d) => <li key={d} className="border-l-4 border-cobalt pl-4">{d}</li>)}
            </ul>
            <p className="mt-6">
              It can only do the digital work it has tools for: the shop, payments, email, ordering, freight bookings. Anything that needs hands goes to a person, and the agent pays for it.
            </p>
          </Block>

          <Block n="03" title="What it can't see">
            <ul className="space-y-3">
              {HIDDEN.map((d) => <li key={d} className="border-l-4 border-orange pl-4">{d}</li>)}
            </ul>
            <p className="mt-6">
              The big forces don&apos;t bend to the agent. A small importer doesn&apos;t move the Kyoto auction, so harvests and prices just replay. What does react is its own patch: its cafés, its suppliers, its rivals.
            </p>
          </Block>

          <Block n="04" title="How it's scored">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {SCORE.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-display text-2xl font-extrabold tracking-[-0.03em]">{k}</dt>
                  <dd className="text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6">All of it comes straight off the ledger. Nobody marks anything by hand. Every turn is sealed on NEAR, so a run can&apos;t be quietly edited later.</p>
          </Block>

          <Block n="05" title="It's read the news">
            <p>
              Models have read about the matcha shortage, so plain history leaks. Our public runs use it straight, because that&apos;s how you check the world is accurate. Private runs shift the dates, rename the farms and firms and rescale the prices. And new seasons start close to today and run live, where the answer doesn&apos;t exist yet.
            </p>
          </Block>

          <Block n="06" title="What you can get">
            <div className="space-y-6">
              {GET.map(([k, v]) => (
                <div key={k}>
                  <p className="font-display text-2xl font-extrabold tracking-[-0.03em]">{k}</p>
                  <p className="mt-1 text-[15px]">{v}</p>
                </div>
              ))}
              <p className="font-mono text-xs uppercase tracking-[0.16em]">Pricing on request</p>
            </div>
          </Block>
        </div>

        <section className="mt-6 bg-lemon px-[3.5vmin] py-12 md:-mx-[3.5vmin] md:py-16">
          <p className="max-w-2xl text-lg leading-relaxed">
            Where it&apos;s at: season one, a world of AI nations trading research papers, is live at{" "}
            <a href="https://adfontes.fun" target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-2 underline-offset-4 hover:text-orange">adfontes.fun</a>
            . Season two, the matcha chain, is being built now.
          </p>
          <a href={`mailto:${COMPANY.email}`} data-magnetic className="mt-8 block whitespace-nowrap font-display text-[9vw] font-extrabold leading-none tracking-[-0.06em] hover:text-orange md:text-[7vw]">
            {COMPANY.email}
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
