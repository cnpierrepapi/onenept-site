import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#05060c" }}>
        <svg width="132" height="132" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="9.5" fill="none" stroke="#f3efe6" strokeWidth="2.6" />
          <circle cx="23" cy="9" r="4" fill="#ff6b2c" />
        </svg>
      </div>
    ),
    size,
  );
}
