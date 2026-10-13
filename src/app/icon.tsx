import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#05060c", borderRadius: 14 }}>
        <svg width="64" height="64" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="9.5" fill="none" stroke="#f3efe6" strokeWidth="2.8" />
          <circle cx="23" cy="9" r="4" fill="#ff6b2c" />
        </svg>
      </div>
    ),
    size,
  );
}
