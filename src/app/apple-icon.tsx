import { ImageResponse } from "next/og";
import { DOOR_PATH } from "./brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8EE" }}>
        <svg width="128" height="128" viewBox="-54 -54 108 108">
          <path d={DOOR_PATH} fill="#FF6B2C" fillRule="evenodd" />
        </svg>
      </div>
    ),
    size,
  );
}
