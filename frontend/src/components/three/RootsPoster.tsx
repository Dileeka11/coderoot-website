import {
  BRACKET_OUTLINE,
  CAMERA,
  bracketPoint,
  growRootSystem,
} from "@/lib/roots/generate";

interface RootsPosterProps {
  seed: number;
  direction?: -1 | 1;
  brackets?: boolean;
  points?: number;
  className?: string;
}

const HALF_HEIGHT = Math.tan(CAMERA.fov / 2) * CAMERA.distance;
const HALF_WIDTH = HALF_HEIGHT * 2;
const SPIN = 0.25;
const TILT = 0.06;

function project(x: number, y: number, z: number) {
  const cy = Math.cos(SPIN);
  const sy = Math.sin(SPIN);
  const cx = Math.cos(TILT);
  const sx = Math.sin(TILT);
  const rx = x * cy + z * sy;
  const rz1 = -x * sy + z * cy;
  const ry = y * cx - rz1 * sx;
  const rz = y * sx + rz1 * cx;
  const k = CAMERA.distance / (CAMERA.distance - rz);
  return `${(rx * k).toFixed(2)} ${(-ry * k).toFixed(2)}`;
}

/**
 * A still drawing of the same root system as the live scene, rendered on the server.
 * It paints with the HTML, works with no JavaScript, and is what slow devices keep.
 * As plain vector paths it can't become the LCP element either.
 */
export function RootsPoster({ seed, direction = -1, brackets = false, points = 700, className = "" }: RootsPosterProps) {
  const paths = growRootSystem({ seed, maxPoints: points, direction });

  const byDepth = new Map<number, { d: string[]; radius: number; count: number }>();
  for (const path of paths) {
    const bucket = byDepth.get(path.depth) ?? { d: [], radius: 0, count: 0 };
    const segments: string[] = [];
    for (let i = 0; i < path.radii.length; i += 2) {
      const at = i * 3;
      segments.push(project(path.points[at], path.points[at + 1], path.points[at + 2]));
      bucket.radius += path.radii[i];
      bucket.count++;
    }
    bucket.d.push(`M${segments.join("L")}`);
    byDepth.set(path.depth, bucket);
  }

  const bracketPaths = ([-1, 1] as const).map((side) => {
    const corners = BRACKET_OUTLINE.map((_, i) => {
      const [x, y] = bracketPoint(i, side);
      return project(x, y, 0.075);
    });
    return `M${corners.join("L")}Z`;
  });

  return (
    <svg
      className={`overflow-visible ${className}`}
      viewBox={`${-HALF_WIDTH} ${-HALF_HEIGHT} ${HALF_WIDTH * 2} ${HALF_HEIGHT * 2}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {brackets &&
        bracketPaths.map((d) => <path key={d} d={d} fill="#26282d" stroke="#0fa9ad" strokeOpacity="0.5" strokeWidth="0.01" />)}
      {[...byDepth.entries()].map(([depth, bucket]) => (
        <path
          key={depth}
          d={bucket.d.join("")}
          stroke={depth < 2 ? "#0fa9ad" : "#0b8287"}
          strokeOpacity={1 - depth * 0.14}
          strokeWidth={Math.max(bucket.radius / bucket.count, 0.005).toFixed(3)}
        />
      ))}
    </svg>
  );
}
