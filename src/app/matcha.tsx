/* The real price record the matcha world is scored against. Kyoto first-flush tencha (the leaf that is
   milled into matcha), average trading price per kg at the JA Zen-Noh Kyoto tea market, from the Kyoto
   Prefecture Tea Industry Council figures that Ippodo published. 2026 runs to 19 June. */
export const TENCHA: { year: string; yen: number; partial?: boolean }[] = [
  { year: "2022", yen: 4121 },
  { year: "2023", yen: 4738 },
  { year: "2024", yen: 5402 },
  { year: "2025", yen: 14144 },
  { year: "2026", yen: 17797, partial: true },
];

export const TENCHA_SOURCE = "https://www.ippodo-tea.co.jp/blogs/news/20260901";

const yen = (n: number) => "¥" + n.toLocaleString("en-US");

/** Five bars, one per year, labelled directly. One series, so no legend; the caption names it. */
export function PriceBars({ className = "" }: { className?: string }) {
  const W = 300, H = 128, base = 104, top = 22, bw = 40, gap = (W - 5 * bw) / 4;
  const max = Math.max(...TENCHA.map((d) => d.yen));
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Kyoto matcha leaf price per kilo: 2022 ¥4,121, 2023 ¥4,738, 2024 ¥5,402, 2025 ¥14,144, 2026 ¥17,797 to 19 June.">
        <defs>
          <pattern id="tencha-part" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--color-paper)" />
            <rect width="3" height="6" fill="var(--color-cobalt)" />
          </pattern>
        </defs>
        <line x1="0" x2={W} y1={base + 0.5} y2={base + 0.5} stroke="currentColor" strokeOpacity="0.35" />
        {TENCHA.map((d, i) => {
          const x = i * (bw + gap);
          const h = ((base - top) * d.yen) / max;
          const y = base - h, r = 4;
          return (
            <g key={d.year}>
              <title>{`${d.year}: ${yen(d.yen)} a kilo${d.partial ? " (to 19 June)" : ""}`}</title>
              <path
                d={`M${x},${base} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${base} Z`}
                fill={d.partial ? "url(#tencha-part)" : "var(--color-cobalt)"}
                stroke={d.partial ? "var(--color-cobalt)" : "none"}
                strokeWidth="1.5"
              />
              <text x={x + bw / 2} y={y - 6} textAnchor="middle" className="fill-current font-mono" fontSize="10">{yen(d.yen)}</text>
              <text x={x + bw / 2} y={base + 16} textAnchor="middle" className="fill-current font-mono" fontSize="10" opacity="0.7">{d.year}</text>
            </g>
          );
        })}
      </svg>
      {/* a table can't be shrunk by sr-only itself, so it sits in a wrapper that can */}
      <div className="sr-only"><table>
        <caption>Kyoto first-flush matcha leaf, average price per kilo</caption>
        <tbody>
          {TENCHA.map((d) => (
            <tr key={d.year}><th scope="row">{d.year}</th><td>{yen(d.yen)}{d.partial ? " (to 19 June)" : ""}</td></tr>
          ))}
        </tbody>
      </table></div>
    </figure>
  );
}
