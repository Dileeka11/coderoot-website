import {
  BRACKET_DEPTH,
  BRACKET_FILL,
  BRACKET_OUTLINE,
  CAMERA,
  bracketPoint,
  cameraDistance,
  growRootSystem,
  type RootPath,
} from "./generate";
import {
  GLYPHS,
  createLoop,
  drawGlyphAtlas,
  easeOut,
  finishCompile,
  nextTask,
  perspective,
  startCompile,
  transform,
  waitForCompile,
  type GL,
  type Tier,
} from "./gl";
import {
  MOTE_FRAGMENT,
  MOTE_VERTEX,
  RIBBON_FRAGMENT,
  RIBBON_VERTEX,
  SOLID_FRAGMENT,
  SOLID_VERTEX,
} from "./shaders";

const TIERS: Record<Tier, { points: number; motes: number; dpr: number; maxPixels: number; halfRate: boolean }> = {
  low: { points: 1500, motes: 50, dpr: 1, maxPixels: 1_000_000, halfRate: true },
  mid: { points: 3400, motes: 110, dpr: 1.5, maxPixels: 2_200_000, halfRate: false },
  high: { points: 6200, motes: 190, dpr: 2, maxPixels: 3_600_000, halfRate: false },
};

const BACKGROUND = [30 / 255, 31 / 255, 34 / 255] as const;
const TEAL = [15 / 255, 169 / 255, 173 / 255] as const;
const DEEP_TEAL = [11 / 255, 130 / 255, 135 / 255] as const;
const SPARK = [0.55, 0.95, 0.95] as const;
const BRACKET_BASE = [0.135, 0.14, 0.155] as const;

const GROW_SECONDS = 3.4;

export interface RootsEngineOptions {
  canvas: HTMLCanvasElement;
  tier: Tier;
  seed: number;
  direction: -1 | 1;
  brackets: boolean;
  still: boolean;
  /** Where the scene sits, in clip space, for wide and for narrow viewports */
  shift: { wide: readonly [number, number]; narrow: readonly [number, number] };
  onReady: () => void;
  onFail: () => void;
}

export interface RootsEngine {
  /** 0 when the section is at rest, 1 when it has scrolled away */
  setScroll(progress: number): void;
  destroy(): void;
}

/** Each path point becomes two vertices, one on each side of the line. */
function buildRibbons(paths: ReadonlyArray<RootPath>) {
  const pointCount = paths.reduce((sum, p) => sum + p.radii.length, 0);
  const segmentCount = pointCount - paths.length;
  const vertices = new Float32Array(pointCount * 2 * 10);
  const indices = new Uint32Array(segmentCount * 6);
  let v = 0;
  let i = 0;
  let base = 0;

  for (const path of paths) {
    const n = path.radii.length;
    for (let k = 0; k < n; k++) {
      const a = Math.max(k - 1, 0) * 3;
      const b = Math.min(k + 1, n - 1) * 3;
      const p = path.points;
      const tx = p[b] - p[a];
      const ty = p[b + 1] - p[a + 1];
      const tz = p[b + 2] - p[a + 2];
      const len = Math.hypot(tx, ty, tz) || 1;

      for (const side of [-1, 1]) {
        vertices[v++] = p[k * 3];
        vertices[v++] = p[k * 3 + 1];
        vertices[v++] = p[k * 3 + 2];
        vertices[v++] = tx / len;
        vertices[v++] = ty / len;
        vertices[v++] = tz / len;
        vertices[v++] = side;
        vertices[v++] = path.radii[k];
        vertices[v++] = path.times[k];
        vertices[v++] = path.seed;
      }

      if (k < n - 1) {
        const c = base + k * 2;
        indices[i++] = c;
        indices[i++] = c + 1;
        indices[i++] = c + 2;
        indices[i++] = c + 1;
        indices[i++] = c + 3;
        indices[i++] = c + 2;
      }
    }
    base += n * 2;
  }

  return { vertices, indices };
}

function ribbonVao(gl: GL, ribbons: ReturnType<typeof buildRibbons>) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, ribbons.vertices, gl.STATIC_DRAW);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ribbons.indices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 40, 0);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 40, 12);
  gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 40, 24);
  gl.bindVertexArray(null);
  return { vao, vbo, ibo, count: ribbons.indices.length };
}

/** One bracket as a solid: two caps plus a wall for every edge of the outline. */
function buildBracketSolid(side: -1 | 1) {
  const data: number[] = [];
  const half = BRACKET_DEPTH / 2;
  const push = (i: number, z: number, nx: number, ny: number, nz: number) => {
    const [x, y] = bracketPoint(i, side);
    data.push(x, y, z, nx, ny, nz);
  };

  for (const [a, b, c] of BRACKET_FILL) {
    const order = side === -1 ? [a, c, b] : [a, b, c];
    for (const i of order) push(i, half, 0, 0, 1);
    for (const i of [...order].reverse()) push(i, -half, 0, 0, -1);
  }

  const n = BRACKET_OUTLINE.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const [ax, ay] = bracketPoint(i, side);
    const [bx, by] = bracketPoint(j, side);
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const flip = side === -1 ? -1 : 1;
    const nx = (flip * (by - ay)) / len;
    const ny = (flip * -(bx - ax)) / len;
    push(i, half, nx, ny, 0);
    push(i, -half, nx, ny, 0);
    push(j, half, nx, ny, 0);
    push(j, half, nx, ny, 0);
    push(i, -half, nx, ny, 0);
    push(j, -half, nx, ny, 0);
  }

  return new Float32Array(data);
}

/** The lit edges of a bracket, as thin ribbons the pulses can travel along. */
function bracketEdges(side: -1 | 1): RootPath[] {
  const half = BRACKET_DEPTH / 2;
  const n = BRACKET_OUTLINE.length;
  const radius = 0.0052;
  const paths: RootPath[] = [];

  for (const z of [half, -half]) {
    const points: number[] = [];
    const radii: number[] = [];
    const times: number[] = [];
    for (let i = 0; i <= n; i++) {
      const [x, y] = bracketPoint(i % n, side);
      points.push(x, y, z);
      radii.push(radius);
      times.push((i / n) * 0.3 + 0.001);
    }
    paths.push({ points, radii, times, depth: 0, seed: z > 0 ? 0.1 : 0.6 });
  }

  for (let i = 0; i < n; i++) {
    const [x, y] = bracketPoint(i, side);
    paths.push({
      points: [x, y, half, x, y, -half],
      radii: [radius, radius],
      times: [0.001, 0.001],
      depth: 1,
      seed: 0.3,
    });
  }
  return paths;
}

function buildMotes(paths: ReadonlyArray<RootPath>, count: number, direction: number, seed: number) {
  const data = new Float32Array(count * 7);
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };

  for (let i = 0; i < count; i++) {
    const path = paths[Math.floor(rnd() * paths.length)];
    const k = Math.floor(rnd() * path.radii.length) * 3;
    const glyph = rnd() < 0.42;
    const o = i * 7;
    data[o] = path.points[k];
    data[o + 1] = path.points[k + 1] + direction * 0.2;
    data[o + 2] = path.points[k + 2];
    data[o + 3] = glyph ? 0.09 + rnd() * 0.05 : 0.035 + rnd() * 0.05;
    data[o + 4] = 0.022 + rnd() * 0.035;
    data[o + 5] = rnd();
    data[o + 6] = glyph ? Math.floor(rnd() * GLYPHS.length) : -1;
  }
  return data;
}

export async function createRootsEngine(options: RootsEngineOptions): Promise<RootsEngine | null> {
  const { canvas, tier, seed, direction, brackets, still, shift, onReady, onFail } = options;
  const config = TIERS[tier];

  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: true,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  await nextTask();
  const programs = [
    startCompile(gl, RIBBON_VERTEX, RIBBON_FRAGMENT),
    startCompile(gl, SOLID_VERTEX, SOLID_FRAGMENT),
    startCompile(gl, MOTE_VERTEX, MOTE_FRAGMENT),
  ];
  await waitForCompile(gl, programs);
  const [ribbon, solid, mote] = programs.map((program) => finishCompile(gl, program));
  await nextTask();

  const paths = growRootSystem({ seed, maxPoints: config.points, direction });
  const rootsMesh = ribbonVao(gl, buildRibbons(paths));
  const edgesMesh = brackets ? [-1, 1].map((s) => ribbonVao(gl, buildRibbons(bracketEdges(s as -1 | 1)))) : [];
  const atlas = drawGlyphAtlas(gl);

  const solidMeshes = brackets
    ? [-1, 1].map((s) => {
        const data = buildBracketSolid(s as -1 | 1);
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
        gl.bindVertexArray(null);
        return { vao, vbo, count: data.length / 6 };
      })
    : [];

  const moteData = buildMotes(paths, config.motes, direction, seed * 9301 + 49297);
  const moteVao = gl.createVertexArray();
  gl.bindVertexArray(moteVao);
  const moteVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, moteVbo);
  gl.bufferData(gl.ARRAY_BUFFER, moteData, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 28, 0);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 28, 12);
  gl.bindVertexArray(null);

  gl.clearColor(BACKGROUND[0], BACKGROUND[1], BACKGROUND[2], 1);
  gl.enable(gl.DEPTH_TEST);

  let width = 0;
  let height = 0;
  let projection = new Float32Array(16);
  let camZ: number = CAMERA.distance;
  let sceneShift: readonly [number, number] = shift.wide;
  let dprScale = 1;
  let drawFraction = 1;
  let sizeDirty = true;

  const group = new Float32Array(16);
  const bracketL = new Float32Array(16);
  const bracketR = new Float32Array(16);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const budget = Math.sqrt(config.maxPixels / (width * height));
    const dpr = Math.min(window.devicePixelRatio || 1, config.dpr, budget) * dprScale;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    const aspect = width / height;
    camZ = cameraDistance(aspect);
    projection = perspective(CAMERA.fov, aspect, 0.5, 40);
    sceneShift = aspect > 1.15 ? shift.wide : shift.narrow;
    sizeDirty = false;
  }

  const observer = new ResizeObserver(() => {
    sizeDirty = true;
    if (still) draw(performance.now());
  });
  observer.observe(canvas);

  let scrollTarget = 0;
  let scroll = 0;
  let pointerX = 0;
  let pointerY = 0;
  let aimX = 0;
  let aimY = 0;

  const finePointer = !still && window.matchMedia("(pointer: fine)").matches;
  const onPointer = (e: PointerEvent) => {
    aimX = (e.clientX / window.innerWidth) * 2 - 1;
    aimY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });

  const started = performance.now();

  function bindCommon(p: ReturnType<typeof finishCompile>) {
    gl!.useProgram(p.program);
    gl!.uniformMatrix4fv(p.uniforms.uProj, false, projection);
    gl!.uniform2f(p.uniforms.uShift, sceneShift[0], sceneShift[1]);
  }

  function draw(now: number) {
    if (sizeDirty) resize();
    const g = gl!;
    const time = (now - started) / 1000;
    const growth = still ? 1 : Math.min(time / GROW_SECONDS, 1);
    const grow = 0.02 + easeOut(growth) * 1.05;
    const intro = still ? 1 : easeOut(Math.min(time / 2.2, 1));

    scroll += (scrollTarget - scroll) * (still ? 1 : 0.12);
    pointerX += (aimX - pointerX) * 0.05;
    pointerY += (aimY - pointerY) * 0.05;

    const spin = (still ? 0.25 : Math.sin(time * 0.11) * 0.42) + pointerX * 0.28 + scroll * 1.25;
    const tilt = 0.06 + pointerY * 0.1 - scroll * 0.2;
    const lift = scroll * 1.15;

    transform(group, tilt, spin, 0, lift, -camZ + scroll * 0.9);

    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);

    if (brackets) {
      const open = (1 - intro) * -0.5 + scroll * 1.6;
      const floatY = still ? 0 : Math.sin(time * 0.5) * 0.03;
      const swing = pointerX * 0.16 + (still ? 0 : Math.sin(time * 0.23) * 0.08);
      transform(bracketL, pointerY * 0.07, 0.3 + swing, -open, floatY + lift * 0.5, -camZ + scroll * 0.4);
      transform(bracketR, pointerY * 0.07, -0.3 + swing, open, -floatY + lift * 0.5, -camZ + scroll * 0.4);

      g.disable(g.BLEND);
      g.depthMask(true);
      bindCommon(solid);
      g.uniform3f(solid.uniforms.uBase, BRACKET_BASE[0], BRACKET_BASE[1], BRACKET_BASE[2]);
      g.uniform3f(solid.uniforms.uRim, TEAL[0], TEAL[1], TEAL[2]);
      g.uniform1f(solid.uniforms.uAlpha, 1);
      solidMeshes.forEach((m, i) => {
        g.uniformMatrix4fv(solid.uniforms.uModel, false, i === 0 ? bracketL : bracketR);
        g.bindVertexArray(m.vao);
        g.drawArrays(g.TRIANGLES, 0, m.count);
      });
    }

    g.enable(g.BLEND);
    g.blendFunc(g.ONE, g.ONE);
    g.depthMask(false);

    bindCommon(ribbon);
    g.uniform2f(ribbon.uniforms.uRes, canvas.width, canvas.height);
    g.uniform1f(ribbon.uniforms.uTime, time % 3600);
    g.uniform1f(ribbon.uniforms.uPhase, (time * 0.17) % 1);
    g.uniform1f(ribbon.uniforms.uCameraDistance, camZ);
    g.uniform1f(ribbon.uniforms.uPx, (canvas.height / (2 * Math.tan(CAMERA.fov / 2))) * 1);
    g.uniform3f(ribbon.uniforms.uRoot, TEAL[0], TEAL[1], TEAL[2]);
    g.uniform3f(ribbon.uniforms.uTip, DEEP_TEAL[0], DEEP_TEAL[1], DEEP_TEAL[2]);
    g.uniform3f(ribbon.uniforms.uSpark, SPARK[0], SPARK[1], SPARK[2]);

    if (brackets) {
      g.uniform1f(ribbon.uniforms.uGrow, Math.max(intro * 0.4, 0.002));
      g.uniform1f(ribbon.uniforms.uSway, 0);
      g.uniform1f(ribbon.uniforms.uAlpha, 0.62);
      edgesMesh.forEach((m, i) => {
        g.uniformMatrix4fv(ribbon.uniforms.uModel, false, i === 0 ? bracketL : bracketR);
        g.bindVertexArray(m.vao);
        g.drawElements(g.TRIANGLES, m.count, g.UNSIGNED_INT, 0);
      });
    }

    g.uniform1f(ribbon.uniforms.uGrow, grow);
    g.uniform1f(ribbon.uniforms.uSway, still ? 0 : 1);
    g.uniform1f(ribbon.uniforms.uAlpha, 1);
    g.uniformMatrix4fv(ribbon.uniforms.uModel, false, group);
    g.bindVertexArray(rootsMesh.vao);
    const visibleIndices = Math.floor((rootsMesh.count * drawFraction) / 6) * 6;
    g.drawElements(g.TRIANGLES, visibleIndices, g.UNSIGNED_INT, 0);

    if (config.motes > 0) {
      bindCommon(mote);
      g.uniformMatrix4fv(mote.uniforms.uModel, false, group);
      g.uniform1f(mote.uniforms.uTime, time % 3600);
      g.uniform1f(mote.uniforms.uPx, (canvas.height / (2 * Math.tan(CAMERA.fov / 2))) * 1);
      g.uniform1f(mote.uniforms.uGrow, grow);
      g.uniform1f(mote.uniforms.uRise, direction < 0 ? 1 : 1.2);
      g.uniform3f(mote.uniforms.uColor, TEAL[0] * 1.25, TEAL[1] * 1.25, TEAL[2] * 1.25);
      g.activeTexture(g.TEXTURE0);
      g.bindTexture(g.TEXTURE_2D, atlas);
      g.uniform1i(mote.uniforms.uAtlas, 0);
      g.bindVertexArray(moteVao);
      g.drawArrays(g.POINTS, 0, config.motes);
    }

    g.bindVertexArray(null);
  }

  const loop = createLoop({
    canvas,
    halfRate: config.halfRate,
    still,
    draw,
    degrade() {
      dprScale *= 0.8;
      drawFraction = Math.max(drawFraction * 0.72, 0.3);
      sizeDirty = true;
    },
    canSettle: (now) => now - started > GROW_SECONDS * 1000,
    onReady,
    onFail,
  });

  return {
    setScroll(progress) {
      scrollTarget = progress;
      if (still) draw(performance.now());
    },
    destroy() {
      loop.destroy();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
