/**
 * Grows the "root system" used by the 3D scenes and their static SVG posters.
 *
 * No DOM or WebGL in here, so the server can run it to draw the poster and the browser can
 * run it to build the live scene. The same seed gives the same shape on both, and branches
 * are produced breadth first, so cutting the budget removes fine tips and keeps main roots.
 */

const TAU = Math.PI * 2;
const STEP = 0.058;
const MAX_DEPTH = 4;

export interface RootPath {
  /** x, y, z of every point along the branch */
  points: number[];
  /** Radius in world units at each point */
  radii: number[];
  /** When the growth front reaches each point, from 0 to 1 */
  times: number[];
  depth: number;
  seed: number;
}

export interface GrowOptions {
  seed: number;
  /** Total points across all branches */
  maxPoints: number;
  /** -1 grows downward like roots, 1 grows upward like a tree */
  direction: -1 | 1;
}

interface Bud {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  length: number;
  radius: number;
  depth: number;
  arc: number;
}

export function createRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Three strands twist around each other before they split, echoing the interlaced
 * flame in the logo. Everything else in the system grows from the ends of these strands.
 */
function growTrunk(rnd: () => number, direction: -1 | 1, paths: RootPath[], queue: Bud[]) {
  const strands = 3;
  const steps = 22;
  const length = 1.05;
  const startY = -direction * 1.42;

  for (let s = 0; s < strands; s++) {
    const points: number[] = [];
    const radii: number[] = [];
    const times: number[] = [];
    const start = (s / strands) * TAU;
    let arc = 0;
    let px = 0;
    let py = 0;
    let pz = 0;
    let angle = start;
    let spread = 0;

    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      angle = start + u * TAU * 1.15;
      spread = 0.015 + 0.2 * u * u;
      const x = Math.cos(angle) * spread;
      const y = startY + direction * u * length;
      const z = Math.sin(angle) * spread;
      if (i > 0) arc += Math.hypot(x - px, y - py, z - pz);
      points.push(x, y, z);
      radii.push(0.019 - 0.005 * u);
      times.push(arc);
      px = x;
      py = y;
      pz = z;
    }

    paths.push({ points, radii, times, depth: 0, seed: rnd() });

    const primaries = 3;
    for (let p = 0; p < primaries; p++) {
      const a = angle + (p - 1) * (0.62 + rnd() * 0.5);
      const out = 0.72 + rnd() * 0.5;
      const dir = normalize(Math.cos(a) * out, direction * (0.62 + rnd() * 0.4), Math.sin(a) * out);
      queue.push({
        x: px,
        y: py,
        z: pz,
        dx: dir[0],
        dy: dir[1],
        dz: dir[2],
        length: 2.3 + rnd() * 1.4,
        radius: 0.0135 + rnd() * 0.003,
        depth: 1,
        arc,
      });
    }
  }
}

function normalize(x: number, y: number, z: number): [number, number, number] {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

export function growRootSystem({ seed, maxPoints, direction }: GrowOptions): RootPath[] {
  const rnd = createRandom(seed);
  const paths: RootPath[] = [];
  const queue: Bud[] = [];

  growTrunk(rnd, direction, paths, queue);

  let used = paths.reduce((sum, p) => sum + p.radii.length, 0);
  let maxArc = 1;

  for (let head = 0; head < queue.length && used < maxPoints; head++) {
    const b = queue[head];
    const steps = Math.max(4, Math.round(b.length / STEP));
    const freqA = 0.7 + rnd() * 1.3;
    const freqB = 0.7 + rnd() * 1.3;
    const phaseA = rnd() * TAU;
    const phaseB = rnd() * TAU;
    const wander = 0.085 + b.depth * 0.03;
    const pull = direction * (0.014 - b.depth * 0.002);
    const branchChance = [0, 0.125, 0.105, 0.07, 0][b.depth] ?? 0;

    const points: number[] = [];
    const radii: number[] = [];
    const times: number[] = [];
    let { x, y, z, dx, dy, dz, arc } = b;

    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const radius = b.radius * Math.pow(1 - u, 0.72) + 0.0016;

      points.push(x, y, z);
      radii.push(radius);
      times.push(arc);

      if (i === steps) break;

      if (b.depth < MAX_DEPTH && i > 1 && rnd() < branchChance) {
        const side = rnd() * TAU;
        const swing = 0.55 + rnd() * 0.65;
        const child = normalize(
          dx + Math.cos(side) * swing,
          dy * 0.75 + (rnd() - 0.5) * 0.4,
          dz + Math.sin(side) * swing,
        );
        queue.push({
          x,
          y,
          z,
          dx: child[0],
          dy: child[1],
          dz: child[2],
          length: b.length * (0.42 + rnd() * 0.3) * (1 - u * 0.4),
          radius: radius * 0.78,
          depth: b.depth + 1,
          arc,
        });
      }

      dx += Math.sin(u * freqA * TAU + phaseA) * wander;
      dy += pull;
      dz += Math.cos(u * freqB * TAU + phaseB) * wander;

      const reach = Math.hypot(x, z);
      if (reach > 2.1) {
        dx -= (x / reach) * 0.1;
        dz -= (z / reach) * 0.1;
      }

      const limit = direction < 0 ? y < -2.15 : y > 2.15;
      if (limit) dy -= direction * 0.09;

      [dx, dy, dz] = normalize(dx, dy, dz);

      x += dx * STEP;
      y += dy * STEP;
      z += dz * STEP;
      arc += STEP;
    }

    if (arc > maxArc) maxArc = arc;
    used += radii.length;
    paths.push({ points, radii, times, depth: b.depth, seed: rnd() });
  }

  for (const path of paths) {
    for (let i = 0; i < path.times.length; i++) path.times[i] /= maxArc;
  }

  return paths;
}

/**
 * The bracket shape from the logo, in the logo's own units. Used as a 3D form and in the
 * poster, the same way the brand kit uses it as an oversized watermark on dark covers.
 */
export const BRACKET_OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [86, 40],
  [86, 64],
  [52, 92],
  [86, 120],
  [86, 144],
  [24, 98],
  [21, 92],
  [24, 86],
];

/** Triangles that fill BRACKET_OUTLINE. It is concave, so this is written out by hand. */
export const BRACKET_FILL: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [0, 2, 7],
  [7, 2, 6],
  [6, 2, 5],
  [5, 2, 3],
  [5, 3, 4],
];

export const BRACKET_SCALE = 1 / 42;
export const BRACKET_DEPTH = 0.15;
export const BRACKET_LIFT = -0.05;

/** Bracket outline as world x, y. side is -1 for "<" and 1 for ">" */
export function bracketPoint(index: number, side: -1 | 1): [number, number] {
  const [px, py] = BRACKET_OUTLINE[index];
  return [-side * (120 - px) * BRACKET_SCALE, (92 - py) * BRACKET_SCALE + BRACKET_LIFT];
}

export const CAMERA = {
  fov: (32 * Math.PI) / 180,
  distance: 6.4,
  /** Half the width that must stay on screen on narrow, tall viewports */
  minHalfWidth: 1.85,
} as const;

export function cameraDistance(aspect: number) {
  const tan = Math.tan(CAMERA.fov / 2);
  return Math.max(CAMERA.distance, CAMERA.minHalfWidth / (tan * aspect));
}
