/** The angled teal band from the brand kit's proposal and invoice covers. */
export function SlantDivider({ to = "#ffffff" }: { to?: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-[-1px] block h-[clamp(52px,8.5vw,128px)] w-full"
      viewBox="0 0 1440 128"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon fill={to} points="0,128 0,118 1440,28 1440,128" />
      <polygon className="slant-band" fill="var(--color-teal)" points="0,92 1440,0 1440,28 0,118" />
    </svg>
  );
}
