import { POINT_STRIDE, sampleShape, type ShapeName } from "@/lib/roots/shapes";
import { GlyphScene } from "./GlyphScene";

const POSTER_DOTS = 170;
const SEED = 29;
const SPIN = 0.3;
const TILT = -0.05;
/** One viewBox unit is a hundredth of a world unit, so every coordinate can be a short integer. */
const VIEW = 178;

interface Dot {
  x: number;
  y: number;
}

function toPath(dots: Dot[]) {
  let px = 0;
  let py = 0;
  let d = "";
  for (const { x, y } of dots) {
    d += `m${x - px} ${y - py}h0`;
    px = x;
    py = y;
  }
  return d;
}

/**
 * A still of the shape as vector dots, rendered on the server. Zero-length lines with round
 * caps are the shortest way to write a dot, which keeps a poster under a kilobyte gzipped.
 */
function GlyphPoster({ shape, index }: { shape: ShapeName; index: number }) {
  const points = sampleShape(shape, POSTER_DOTS, SEED);
  const cy = Math.cos(SPIN);
  const sy = Math.sin(SPIN);
  const cx = Math.cos(TILT);
  const sx = Math.sin(TILT);
  const near: Dot[] = [];
  const far: Dot[] = [];

  for (let i = 0; i < POSTER_DOTS; i++) {
    const x = points[i * POINT_STRIDE];
    const y = points[i * POINT_STRIDE + 1];
    const z = points[i * POINT_STRIDE + 2];
    const rx = x * cy + z * sy;
    const rz1 = -x * sy + z * cy;
    const ry = y * cx - rz1 * sx;
    const rz = y * sx + rz1 * cx;
    const k = 6 / (6 - rz);
    (rz > 0 ? near : far).push({ x: Math.round(rx * k * 100), y: Math.round(-ry * k * 100) });
  }

  const order = (a: Dot, b: Dot) => Math.round(a.y / 40) - Math.round(b.y / 40) || a.x - b.x;
  near.sort(order);
  far.sort(order);

  return (
    <svg
      data-glyph-poster
      data-glyph-index={index}
      {...(index === 0 ? { "data-active": true } : {})}
      className="glyph-poster absolute inset-0 size-full"
      viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
      fill="none"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={toPath(far)} stroke="#0b8287" strokeWidth="3.4" />
      <path d={toPath(near)} stroke="#0fa9ad" strokeWidth="4.2" />
    </svg>
  );
}

interface GlyphViewProps {
  shapes: readonly ShapeName[];
  followScroll?: boolean;
  className?: string;
}

/** The poster and the live scene, stacked in one box. The scene fades in over the poster. */
export function GlyphView({ shapes, followScroll = false, className = "" }: GlyphViewProps) {
  return (
    <div className={className}>
      {shapes.map((shape, index) => (
        <GlyphPoster key={shape} shape={shape} index={index} />
      ))}
      <GlyphScene shapes={shapes} followScroll={followScroll} />
    </div>
  );
}
