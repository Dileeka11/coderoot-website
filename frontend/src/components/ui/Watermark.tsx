/** The oversized ghost brackets the brand kit uses on dark covers. */
export function Watermark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`swing-3d pointer-events-none absolute text-white/[0.035] ${className}`}
      viewBox="8 30 224 124"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M86 40v24L52 92l34 28v24L24 98q-6-6 0-12z" />
      <path d="M154 40v24l34 28-34 28v24l62-46q6-6 0-12z" />
    </svg>
  );
}
