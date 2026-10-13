import { ImageResponse } from "next/og";

export const alt = "Onenept Studios: we build agents that find the work, then they show the receipts.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* a field of dots with one orange path through it, the same idea as the hero */
function dots() {
  const out: { x: number; y: number; o: number; r: number }[] = [];
  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 40; col++) {
      const x = col * 31 + (row % 2) * 15;
      const y = 330 + row * 22 + Math.sin(col * 0.5 + row * 0.7) * 10;
      out.push({ x, y, o: 0.15 + (row / 14) * 0.5, r: 1.2 + row * 0.12 });
    }
  }
  return out;
}

export default function OG() {
  const path = [[120, 520], [300, 470], [470, 505], [650, 440], [830, 470], [1010, 410]];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#05060c", padding: 72, position: "relative", color: "#f3efe6" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <radialGradient id="g" cx="80%" cy="10%" r="60%">
              <stop offset="0%" stopColor="#3b5bff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b5bff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#g)" />
          {dots().map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#b8c6ff" fillOpacity={d.o} />
          ))}
          <polyline points={path.map((p) => p.join(",")).join(" ")} fill="none" stroke="#ff6b2c" strokeWidth="3" />
          {path.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={i === path.length - 1 ? 9 : 5} fill="#ff6b2c" />
          ))}
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 700 }}>
          <svg width="40" height="40" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="10.5" fill="none" stroke="#f3efe6" strokeWidth="2.4" />
            <circle cx="23.4" cy="8.6" r="3.6" fill="#ff6b2c" />
          </svg>
          onenept studios
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 54, fontSize: 62, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>
          <span>We build agents that find the work.</span>
          <span style={{ color: "#ff6b2c", marginTop: 12 }}>Then they show the receipts.</span>
        </div>
      </div>
    ),
    size,
  );
}
