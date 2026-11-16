/* The onenept door (logo, 16 Nov 2026): a thick ring, an arched doorway cut through the bottom of the band.
   One path, even-odd fill, so it needs no mask and works in icons and OG images too. */
export const DOOR_PATH =
  "M 9 49.18 A 50 50 0 1 0 -9 49.18 L -9 39 A 9 9 0 0 1 9 39 Z M 26 0 A 26 26 0 1 0 -26 0 A 26 26 0 1 0 26 0 Z";

export function DoorMark({ className = "h-7 w-7", color = "var(--orange)", title }: { className?: string; color?: string; title?: string }) {
  return (
    <svg viewBox="-54 -54 108 108" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={DOOR_PATH} fill={color} fillRule="evenodd" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-extrabold tracking-[-0.04em] ${className}`}>
      <DoorMark className="h-[1.05em] w-[1.05em]" />
      onenept
    </span>
  );
}
