/**
 * The shapes the glyph scenes can take, each one built from scattered points. No DOM or
 * WebGL in here either, so the server can draw the same shapes as static posters.
 *
 * A shape is a list of weighted parts. A heavier part gets more points, which is how edges
 * stay crisp, and filled areas are drawn fainter so the outline is what the eye reads. Parts
 * sit at different depths on purpose, because that makes a flat drawing read as 3D once it turns.
 */

import { BRACKET_FILL, BRACKET_OUTLINE, bracketPoint, createRandom, growRootSystem } from "./generate";

export type ShapeName =
  | "browser"
  | "stack"
  | "gear"
  | "tree"
  | "bubble"
  | "gallery"
  | "brackets"
  | "flow"
  | "question"
  | "sheet"
  | "storefront"
  | "tag";

type Vec3 = [number, number, number];
type Random = () => number;
type Sampler = (rnd: Random) => Vec3;
type Part = readonly [weight: number, at: Sampler, glow?: number];
type Point2 = readonly [number, number];

const TAU = Math.PI * 2;
const FAINT = 0.42;

/** Each point is x, y, z and how brightly it glows */
export const POINT_STRIDE = 4;

/** How fast each shape turns around its own axis, in radians per second */
export const SHAPE_ROLL: Partial<Record<ShapeName, number>> = { gear: 0.24 };

function segment(a: Vec3, b: Vec3): Sampler {
  return (rnd) => {
    const t = rnd();
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  };
}

/** Points along a closed line, spread evenly by length. depth gives the line some thickness. */
function outline(points: ReadonlyArray<Point2>, z: number, depth = 0): Sampler {
  const ends: number[] = [];
  let total = 0;
  points.forEach(([ax, ay], i) => {
    const [bx, by] = points[(i + 1) % points.length];
    total += Math.hypot(bx - ax, by - ay);
    ends.push(total);
  });

  return (rnd) => {
    const at = rnd() * total;
    const i = ends.findIndex((end) => end >= at);
    const [ax, ay] = points[i];
    const [bx, by] = points[(i + 1) % points.length];
    const start = i ? ends[i - 1] : 0;
    const t = (at - start) / (ends[i] - start || 1);
    return [ax + (bx - ax) * t, ay + (by - ay) * t, z + (rnd() - 0.5) * depth];
  };
}

function arc(cx: number, cy: number, r: number, from: number, to: number, steps = 4): Point2[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / steps;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
}

function roundedRect(cx: number, cy: number, w: number, h: number, r: number): Point2[] {
  const x = w / 2 - r;
  const y = h / 2 - r;
  return [
    ...arc(cx - x, cy + y, r, Math.PI, Math.PI / 2),
    ...arc(cx + x, cy + y, r, Math.PI / 2, 0),
    ...arc(cx + x, cy - y, r, 0, -Math.PI / 2),
    ...arc(cx - x, cy - y, r, -Math.PI / 2, -Math.PI),
  ];
}

function fill(cx: number, cy: number, z: number, w: number, h: number): Sampler {
  return (rnd) => [cx + (rnd() - 0.5) * w, cy + (rnd() - 0.5) * h, z];
}

function disc(cx: number, cy: number, z: number, r: number): Sampler {
  return (rnd) => {
    const a = rnd() * TAU;
    const k = Math.sqrt(rnd()) * r;
    return [cx + Math.cos(a) * k, cy + Math.sin(a) * k, z];
  };
}

function tilted(at: Sampler, angle: number): Sampler {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return (rnd) => {
    const [x, y, z] = at(rnd);
    return [x, y * c - z * s, y * s + z * c];
  };
}

/** A smooth line through the given stops, as many short straight pieces. */
function smooth(stops: ReadonlyArray<Vec3>): Vec3[] {
  const line: Vec3[] = [];
  const at = (i: number) => stops[Math.min(Math.max(i, 0), stops.length - 1)];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let k = 0; k < 14; k++) {
      const t = k / 14;
      line.push(
        [0, 1, 2].map(
          (a) =>
            0.5 *
            (2 * p1[a] +
              (p2[a] - p0[a]) * t +
              (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t * t +
              (3 * p1[a] - p0[a] - 3 * p2[a] + p3[a]) * t * t * t),
        ) as Vec3,
      );
    }
  }
  line.push(at(stops.length - 1));
  return line;
}

/** Points along an open line in 3D, spread evenly by length. width gives it some body. */
function trail(line: ReadonlyArray<Vec3>, width = 0): Sampler {
  const ends: number[] = [];
  let total = 0;
  for (let i = 0; i < line.length - 1; i++) {
    total += Math.hypot(line[i + 1][0] - line[i][0], line[i + 1][1] - line[i][1], line[i + 1][2] - line[i][2]);
    ends.push(total);
  }

  return (rnd) => {
    const at = rnd() * total;
    const i = Math.max(ends.findIndex((end) => end >= at), 0);
    const start = i ? ends[i - 1] : 0;
    const t = (at - start) / (ends[i] - start || 1);
    const jitter = () => (rnd() - 0.5) * width;
    return [
      line[i][0] + (line[i + 1][0] - line[i][0]) * t + jitter(),
      line[i][1] + (line[i + 1][1] - line[i][1]) * t + jitter(),
      line[i][2] + (line[i + 1][2] - line[i][2]) * t + jitter(),
    ];
  };
}

/** A small window: frame, title bar and an image area. */
function card(cx: number, cy: number, z: number, w: number, h: number, weight: number): Part[] {
  const barY = cy + h / 2 - 0.18;
  return [
    [weight * 3, outline(roundedRect(cx, cy, w, h, 0.07), z, 0.03)],
    [weight * 0.7, segment([cx - w / 2, barY, z], [cx + w / 2, barY, z])],
    [weight * 3, fill(cx, cy - 0.09, z, w - 0.14, h - 0.32), FAINT],
  ];
}

/** Websites: a browser window with its page floating forward in layers. */
function browser(): Part[] {
  return [
    [23, outline(roundedRect(0, 0, 2.95, 2.05, 0.14), 0, 0.05)],
    [5, segment([-1.47, 0.67, 0], [1.47, 0.67, 0])],
    [1.3, disc(-1.25, 0.85, 0.03, 0.055)],
    [1.3, disc(-1.07, 0.85, 0.03, 0.055)],
    [1.3, disc(-0.89, 0.85, 0.03, 0.055)],
    [5, outline(roundedRect(0.25, 0.85, 1.55, 0.17, 0.08), 0.03)],
    [8, fill(-0.68, 0.36, 0.24, 1.18, 0.15)],
    [4, fill(-0.82, 0.11, 0.18, 0.9, 0.06), FAINT],
    [3, fill(-0.92, -0.04, 0.18, 0.7, 0.06), FAINT],
    [3, fill(-1.02, -0.3, 0.32, 0.5, 0.14)],
    [7, outline(roundedRect(0.72, 0.13, 1.02, 0.74, 0.05), 0.38)],
    [6, fill(0.72, 0.13, 0.38, 0.94, 0.66), FAINT],
    ...[-0.9, 0, 0.9].flatMap((x, i) => [
      [4, outline(roundedRect(x, -0.71, 0.78, 0.42, 0.04), 0.14 + i * 0.09)] as const,
      [3, fill(x, -0.71, 0.14 + i * 0.09, 0.7, 0.34), FAINT] as const,
    ]),
  ];
}

/** Web apps: three floating layers, from the screens people use down to the data underneath. */
function stack(): Part[] {
  const s = 1.46;
  const tilt = 0.42;
  const gap = 0.98;
  const diamond: Point2[] = [
    [s, 0],
    [0, s],
    [-s, 0],
    [0, -s],
  ];
  const lay = (at: Sampler, y: number): Sampler =>
    tilted((rnd) => {
      const [u, v, lift] = at(rnd);
      return [u, y + lift, v];
    }, tilt);
  const face = (scale: number, u = 0, v = 0): Sampler => (rnd) => {
    const a = rnd();
    const b = rnd();
    return [u + (a - b) * s * scale, v + (a + b - 1) * s * scale, 0];
  };
  const tile = (u: number, v: number): Part => [3.4, lay(face(0.22, u, v), gap + 0.1)];

  return [
    [15, lay(outline(diamond, 0, 0.03), gap)],
    tile(0, 0.68),
    tile(-0.68, 0),
    tile(0.68, 0),
    tile(0, -0.68),
    tile(0, 0),
    [15, lay(outline(diamond, 0, 0.03), 0)],
    [3, lay(segment([-s, 0, 0], [s, 0, 0]), 0.03)],
    [3, lay(segment([0, -s, 0], [0, s, 0]), 0.03)],
    [3, lay(disc(0, 0, 0, 0.3), 0.04)],
    [15, lay(outline(diamond, 0, 0.03), -gap)],
    [20, lay(face(1), -gap), FAINT],
  ];
}

/** Custom software: one solid gear that turns. */
function gear(): Part[] {
  const teeth = 11;
  const root = 1.06;
  const tip = 1.42;
  const hole = 0.44;
  const pitch = TAU / teeth;
  const profile: Point2[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * pitch;
    for (const [r, offset] of [
      [root, -0.3],
      [tip, -0.15],
      [tip, 0.15],
      [root, 0.3],
    ] as const) {
      profile.push([Math.cos(a + offset * pitch) * r, Math.sin(a + offset * pitch) * r]);
    }
  }

  const face = (z: number): Sampler => (rnd) => {
    const a = rnd() * TAU;
    const r = Math.sqrt(hole * hole + rnd() * (root * root - hole * hole));
    return [Math.cos(a) * r, Math.sin(a) * r, z];
  };
  return [
    [15, outline(profile, 0.17)],
    [15, outline(profile, -0.17)],
    [12, outline(profile, 0, 0.34)],
    [11, face(0.17), FAINT],
    [7, face(-0.17), FAINT],
    [6, outline(arc(0, 0, hole, 0, TAU, 28), 0, 0.34)],
    ...[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i / 6) * TAU;
      return [1.3, disc(Math.cos(a) * 0.74, Math.sin(a) * 0.74, 0.2, 0.075)] as const;
    }),
  ];
}

/** About: the tagline as an object, a tree above the ground and its roots below. */
function tree(): Part[] {
  const scale = 0.43;
  const spread = 0.58;
  const grown = (direction: -1 | 1, seed: number): Sampler => {
    const paths = growRootSystem({ seed, maxPoints: 2000, direction });
    const points = paths.flatMap((path) => path.points);
    const count = points.length / 3;
    const lift = direction * 1.42;
    return (rnd) => {
      const i = Math.floor(rnd() * count) * 3;
      return [points[i] * spread, (points[i + 1] + lift) * scale, points[i + 2] * spread];
    };
  };

  return [
    [46, grown(1, 113)],
    [46, grown(-1, 41)],
    [
      9,
      (rnd) => {
        const a = rnd() * TAU;
        const r = Math.pow(rnd(), 0.7) * 1.5;
        return [Math.cos(a) * r, (rnd() - 0.5) * 0.03, Math.sin(a) * r];
      },
      0.6,
    ],
  ];
}

/** Contact: a speech bubble, mid-sentence. */
function bubble(): Part[] {
  const body: Point2[] = [
    ...arc(-1.13, 0.75, 0.33, Math.PI, Math.PI / 2),
    ...arc(1.13, 0.75, 0.33, Math.PI / 2, 0),
    ...arc(1.13, -0.36, 0.33, 0, -Math.PI / 2),
    [-0.32, -0.69],
    [-1.14, -1.24],
    [-0.86, -0.69],
    ...arc(-1.13, -0.36, 0.33, -Math.PI / 2, -Math.PI),
  ];

  return [
    [30, outline(body, 0, 0.2)],
    [9, fill(0, 0.2, -0.1, 2.7, 1.6), FAINT],
    [10, disc(-0.68, 0.19, 0.24, 0.2)],
    [10, disc(0, 0.19, 0.24, 0.2)],
    [10, disc(0.68, 0.19, 0.24, 0.2)],
  ];
}

/** Projects: finished windows, fanned out one behind another. */
function gallery(): Part[] {
  return [
    ...card(-0.72, 0.5, -0.65, 1.8, 1.2, 2.6),
    ...card(0, 0, 0, 1.9, 1.28, 3.4),
    ...card(0.72, -0.5, 0.65, 2, 1.36, 4.2),
  ];
}

/** The brand's own brackets from the logo, with a slash between them. */
function brackets(): Part[] {
  const scale = 0.68;
  const bracket = (side: -1 | 1, z: number): Sampler =>
    outline(
      BRACKET_OUTLINE.map((_, i) => {
        const [x, y] = bracketPoint(i, side);
        return [x * scale, y * scale] as const;
      }),
      z,
    );
  const body = (side: -1 | 1): Sampler => (rnd) => {
    const [a, b, c] = BRACKET_FILL[Math.floor(rnd() * BRACKET_FILL.length)];
    const u = Math.sqrt(rnd());
    const v = rnd();
    const pa = bracketPoint(a, side);
    const pb = bracketPoint(b, side);
    const pc = bracketPoint(c, side);
    const mix = (k: 0 | 1) => (pa[k] * (1 - u) + pb[k] * u * (1 - v) + pc[k] * u * v) * scale;
    return [mix(0), mix(1), (rnd() - 0.5) * 0.22];
  };
  const slash: Sampler = (rnd) => {
    const t = rnd() - 0.5;
    const w = (rnd() - 0.5) * 0.17;
    return [-t * 0.84 + w, t * 2.05, (rnd() - 0.5) * 0.22];
  };

  return ([-1, 1] as const).flatMap((side) => [
    [12, bracket(side, 0.11)] as const,
    [12, bracket(side, -0.11)] as const,
    [15, body(side), FAINT] as const,
    [7, slash] as const,
  ]);
}

/** How we work: six stops on one path, with the last one bigger because it never ends. */
function flow(): Part[] {
  const stops: Vec3[] = [
    [-1.2, 1.3, -0.3],
    [0.45, 1.12, 0.22],
    [1.25, 0.3, -0.18],
    [-0.3, -0.02, 0.32],
    [-1.25, -0.82, -0.12],
    [0.72, -1.25, 0.36],
  ];

  return [
    [26, trail(smooth(stops), 0.035)],
    ...stops.flatMap(([x, y, z], i) => {
      const r = i === stops.length - 1 ? 0.32 : 0.21;
      return [
        [7, outline(arc(x, y, r, 0, TAU, 20), z)] as const,
        [3, disc(x, y, z, r * 0.42)] as const,
      ];
    }),
  ];
}

/** FAQ: a question mark, solid enough to turn. */
function question(): Part[] {
  const hook = smooth(
    [
      ...arc(0, 0.62, 0.78, Math.PI * 1.04, -Math.PI * 0.26, 9),
      [0.14, -0.3],
      [0.02, -0.68],
    ].map(([x, y]): Vec3 => [x, y, 0]),
  );

  return [
    [72, trail(hook, 0.26)],
    [16, (rnd) => {
      const [x, y, z] = disc(0.02, -1.22, 0, 0.2)(rnd);
      return [x, y, z + (rnd() - 0.5) * 0.26];
    }],
  ];
}

/** Insights: a written page with its corner folded, and another one behind it. */
function sheet(): Part[] {
  const page: Point2[] = [
    [-0.98, 1.4],
    [0.46, 1.4],
    [0.98, 0.88],
    [0.98, -1.4],
    [-0.98, -1.4],
  ];
  const lines = [0.42, 0.14, -0.14, -0.42, -0.7, -0.98];

  return [
    [24, outline(page, 0.12, 0.03)],
    [3, trail([[0.46, 1.4, 0.12], [0.46, 0.88, 0.12], [0.98, 0.88, 0.12]])],
    [8, fill(-0.2, 0.86, 0.2, 1.1, 0.16)],
    ...lines.map((y, i) => [3.4, fill(i % 3 === 2 ? -0.28 : 0, y, 0.2, i % 3 === 2 ? 1.04 : 1.6, 0.07), FAINT] as const),
    [9, outline(roundedRect(-0.46, -0.16, 1.96, 2.72, 0.03), -0.42), FAINT],
  ];
}

/** Who we help: a shop front, with its awning, door and window. */
function storefront(): Part[] {
  const awning: Point2[] = [
    [-1.5, 0.58],
    [-1.2, 1.26],
    [1.2, 1.26],
    [1.5, 0.58],
  ];

  return [
    [20, outline(roundedRect(0, -0.42, 2.56, 2, 0.05), 0, 0.04)],
    [16, outline(awning, 0.3)],
    ...[-0.72, 0, 0.72].map((x) => [2.6, segment([x * 0.8, 1.26, 0.3], [x, 0.58, 0.3])] as const),
    ...[-1.2, -0.6, 0, 0.6, 1.2].map((x) => [4, outline(arc(x, 0.58, 0.3, Math.PI, TAU, 8), 0.3)] as const),
    [10, outline(roundedRect(-0.66, -0.72, 0.68, 1.36, 0.04), 0.14)],
    [2, disc(-0.44, -0.72, 0.2, 0.05)],
    [10, outline(roundedRect(0.52, -0.3, 1.04, 0.78, 0.04), 0.14)],
    [5, fill(0.52, -0.3, 0.14, 0.94, 0.68), FAINT],
    [4, fill(0, -1.36, 0.08, 2.5, 0.05), FAINT],
  ];
}

/** Pricing: a price tag on its string, with the amount written across it. */
function tag(): Part[] {
  const body: Point2[] = [
    [-1.62, 0],
    [-0.86, 0.9],
    [1.42, 0.9],
    [1.42, -0.9],
    [-0.86, -0.9],
  ];
  const angle = -0.42;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const turned = (at: Sampler): Sampler => (rnd) => {
    const [x, y, z] = at(rnd);
    return [x * c - y * s, x * s + y * c, z];
  };

  return [
    [24, turned(outline(body, 0.13))],
    [14, turned(outline(body, -0.13))],
    [8, turned(outline(body, 0, 0.26))],
    [12, turned(fill(0.2, 0, -0.13, 2.3, 1.7)), FAINT],
    [6, turned(outline(arc(-0.92, 0, 0.17, 0, TAU, 20), 0.13, 0.26))],
    [9, turned(fill(0.32, 0.3, 0.28, 1.5, 0.2))],
    [4, turned(fill(0.14, -0.08, 0.2, 1.14, 0.08)), FAINT],
    [3, turned(fill(0.02, -0.36, 0.2, 0.9, 0.08)), FAINT],
    [6, turned(trail(smooth([[-0.92, 0, 0.13], [-1.3, 0.62, 0.3], [-0.98, 1.2, 0.05], [-1.42, 1.62, -0.2]]), 0.02))],
  ];
}

const BUILDERS: Record<ShapeName, () => Part[]> = {
  browser,
  stack,
  gear,
  tree,
  bubble,
  gallery,
  brackets,
  flow,
  question,
  sheet,
  storefront,
  tag,
};

function shuffled(data: Float32Array, rnd: Random) {
  for (let i = data.length / POINT_STRIDE - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    for (let k = 0; k < POINT_STRIDE; k++) {
      const value = data[i * POINT_STRIDE + k];
      data[i * POINT_STRIDE + k] = data[j * POINT_STRIDE + k];
      data[j * POINT_STRIDE + k] = value;
    }
  }
  return data;
}

/**
 * Exactly count points for a shape, in random order. The order matters: a slow device can
 * draw only the first part of the list and still get the whole shape, just thinner.
 */
export function sampleShape(name: ShapeName, count: number, seed: number) {
  const rnd = createRandom(seed);
  const parts = BUILDERS[name]();
  const total = parts.reduce((sum, [weight]) => sum + weight, 0);
  const data = new Float32Array(count * POINT_STRIDE);
  let written = 0;

  parts.forEach(([weight, at, glow = 1], index) => {
    const share = index === parts.length - 1 ? count - written : Math.round((count * weight) / total);
    for (let i = 0; i < share && written < count; i++, written++) {
      data.set(at(rnd), written * POINT_STRIDE);
      data[written * POINT_STRIDE + 3] = glow;
    }
  });

  return shuffled(data, rnd);
}

/** The loose cloud every scene assembles itself out of when it first appears. */
export function sampleCloud(count: number, seed: number) {
  const rnd = createRandom(seed);
  const data = new Float32Array(count * POINT_STRIDE);
  for (let i = 0; i < count; i++) {
    const a = rnd() * TAU;
    const y = rnd() * 2 - 1;
    const r = 1.9 + rnd() * 1.1;
    const flat = Math.sqrt(1 - y * y);
    data.set([Math.cos(a) * flat * r, y * r, Math.sin(a) * flat * r, FAINT], i * POINT_STRIDE);
  }
  return data;
}
