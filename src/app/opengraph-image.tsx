import { ImageResponse } from "next/og";
import { DOOR_PATH } from "./brand";

export const alt = "Onenept Studios: AI products for people who never asked for AI.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFF8EE", padding: 72, position: "relative", color: "#15120F" }}>
        <div style={{ position: "absolute", right: -60, top: 60, display: "flex" }}>
          <svg width="520" height="520" viewBox="-54 -54 108 108">
            <path d={DOOR_PATH} fill="#FF6B2C" fillRule="evenodd" />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 1200, height: 22, display: "flex" }}>
          <div style={{ flex: 1, background: "#2F5BFF" }} />
          <div style={{ flex: 1, background: "#FFE14D" }} />
          <div style={{ flex: 1, background: "#FF6B2C" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
            <svg width="44" height="44" viewBox="-54 -54 108 108">
              <path d={DOOR_PATH} fill="#FF6B2C" fillRule="evenodd" />
            </svg>
            onenept
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 120, fontSize: 76, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>
            <span>AI products</span>
            <span>for people who</span>
            <span style={{ color: "#FF6B2C" }}>never asked for AI.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
