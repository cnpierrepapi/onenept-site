import { ImageResponse } from "next/og";
import { DOOR_PATH } from "./brand";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8EE", borderRadius: 14 }}>
        <svg width="54" height="54" viewBox="-54 -54 108 108">
          <path d={DOOR_PATH} fill="#FF6B2C" fillRule="evenodd" />
        </svg>
      </div>
    ),
    size,
  );
}
