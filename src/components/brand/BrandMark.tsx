/**
 * BrandMark — the permanent personal identity for Manikanta R.
 *
 * A purely geometric monogram constructed on a 64×64 grid.
 * • Left vertical stroke + rising diagonal + descending peak + right stem
 *   draws the letter M, with its right side rising HIGHER than the left
 *   to encode an upward analytics trajectory.
 * • Right stem + half-circle bowl draws the letter R.
 * • A small arrowhead at the apex affirms the upward growth motif.
 *
 * No gradients, no effects, no font dependency. Renders in `currentColor`
 * so the same mark works in dark mode (white) and light mode (charcoal),
 * at any size from 16×16 favicon to billboard.
 */
export function BrandMark({
  size = 64,
  title = "Manikanta R",
  strokeWidth = 7,
  className,
}: {
  size?: number | string;
  title?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {/* M with right side rising = analytics uptrend */}
      <polyline points="9,53 9,17 24,37 43,8 43,53" />
      {/* R bowl */}
      <path d="M43 17 Q58 17 58 25 Q58 33 43 33" />
      {/* R diagonal leg — what distinguishes R from P */}
      <line x1="43" y1="33" x2="58" y2="53" />
      {/* Arrowhead at the apex (subtle growth marker) */}
      <polyline points="35,12 43,8 46,17" strokeLinejoin="round" />

    </svg>
  );
}

/**
 * Static SVG markup for use outside React (favicon data URI, OG, email
 * signature). Accepts a color string for the stroke; default `#0d0d0d`
 * for light mode, pass `#ffffff` for dark mode.
 */
export function brandMarkSvg(color = "#0d0d0d"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="square" stroke-linejoin="miter"><polyline points="9,53 9,17 24,37 43,8 43,53"/><path d="M43 17 Q58 17 58 25 Q58 33 43 33"/><line x1="43" y1="33" x2="58" y2="53"/><polyline points="35,12 43,8 46,17" stroke-linejoin="round"/></svg>`;
}

export function brandMarkFaviconHref(color = "#0d0d0d"): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(brandMarkSvg(color))}`;
}
