import {
  GLYPHS,
  createLoop,
  drawGlyphAtlas,
  finishCompile,
  nextTask,
  perspective,
  startCompile,
  transform,
  waitForCompile,
  type Tier,
} from "./gl";
import { GLYPH_FRAGMENT, GLYPH_VERTEX } from "./glyphShaders";
import { POINT_STRIDE, SHAPE_ROLL, sampleCloud, sampleShape, type ShapeName } from "./shapes";

const TIERS: Record<Tier, { count: number; dpr: number; maxPixels: number; halfRate: boolean }> = {
  low: { count: 1100, dpr: 1, maxPixels: 600_000, halfRate: true },
  mid: { count: 2400, dpr: 1.5, maxPixels: 1_400_000, halfRate: false },
  high: { count: 3800, dpr: 2, maxPixels: 2_600_000, halfRate: false },
};

const NEAR = [15 / 255, 169 / 255, 173 / 255] as const;
const FAR = [11 / 255, 130 / 255, 135 / 255] as const;
const SPARK = [0.55, 0.8, 0.8] as const;

const FOV = (32 * Math.PI) / 180;
/** The space every shape has to fit inside, from the centre out */
const FIT = 1.78;
const MORPH_SECONDS = 1.35;
const INTRO_SECONDS = 1.8;

export interface GlyphEngineOptions {
  canvas: HTMLCanvasElement;
  tier: Tier;
  shapes: readonly ShapeName[];
  seed: number;
  still: boolean;
  onReady: () => void;
  onFail: () => void;
}

export interface GlyphEngine {
  /** Moves to another shape. If one change is already running, the latest request waits for it. */
  show(index: number): void;
  /** 0 when the section is at rest, 1 when it has scrolled away */
  setScroll(progress: number): void;
  destroy(): void;
}

export async function createGlyphEngine(options: GlyphEngineOptions): Promise<GlyphEngine | null> {
  const { canvas, tier, shapes, seed, still, onReady, onFail } = options;
  const config = TIERS[tier];

  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  await nextTask();
  const compiling = startCompile(gl, GLYPH_VERTEX, GLYPH_FRAGMENT);
  await waitForCompile(gl, [compiling]);
  const { program, uniforms } = finishCompile(gl, compiling);

  const cloud = shapes.length;
  const buffers: (WebGLBuffer | null)[] = [];
  for (const name of [...shapes, null]) {
    await nextTask();
    const points = name ? sampleShape(name, config.count, seed) : sampleCloud(config.count, seed + 1);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    buffers.push(buffer);
  }

  const atlas = drawGlyphAtlas(gl);
  const pointData = new Float32Array(config.count * 3);
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < config.count; i++) {
    const dot = rnd() < 0.22;
    pointData[i * 3] = dot ? 0.35 + rnd() * 0.25 : 0.85 + rnd() * 0.5;
    pointData[i * 3 + 1] = rnd();
    pointData[i * 3 + 2] = dot ? -1 : Math.floor(rnd() * GLYPHS.length);
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const dataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  let fromIndex = still ? 0 : cloud;
  let toIndex = 0;
  let morph = still ? 1 : 0;
  let morphSeconds = INTRO_SECONDS;
  let queued: number | null = null;

  function bindShapes() {
    gl!.bindVertexArray(vao);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers[fromIndex]);
    gl!.vertexAttribPointer(0, POINT_STRIDE, gl!.FLOAT, false, 0, 0);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers[toIndex]);
    gl!.vertexAttribPointer(1, POINT_STRIDE, gl!.FLOAT, false, 0, 0);
  }
  bindShapes();

  function begin(index: number) {
    fromIndex = toIndex;
    toIndex = index;
    morph = 0;
    morphSeconds = MORPH_SECONDS;
    queued = null;
    bindShapes();
  }

  gl.clearColor(0, 0, 0, 0);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, atlas);
  gl.uniform1i(uniforms.uAtlas, 0);
  gl.uniform3f(uniforms.uNear, NEAR[0], NEAR[1], NEAR[2]);
  gl.uniform3f(uniforms.uFar, FAR[0], FAR[1], FAR[2]);
  gl.uniform3f(uniforms.uSpark, SPARK[0], SPARK[1], SPARK[2]);

  let camZ = 6;
  let dprScale = 1;
  let drawFraction = 1;
  let sizeDirty = true;
  const model = new Float32Array(16);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const budget = Math.sqrt(config.maxPixels / (width * height));
    const dpr = Math.min(window.devicePixelRatio || 1, config.dpr, budget) * dprScale;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    const aspect = width / height;
    const tan = Math.tan(FOV / 2);
    camZ = Math.max(FIT / tan, FIT / (tan * aspect));
    gl!.uniformMatrix4fv(uniforms.uProj, false, perspective(FOV, aspect, 0.5, 40));
    gl!.uniform1f(uniforms.uAspect, aspect);
    gl!.uniform1f(uniforms.uCameraDistance, camZ);
    // Characters stay a readable size however big the canvas is, so a small canvas isn't just a blur.
    gl!.uniform1f(uniforms.uSize, Math.min(Math.max(Math.min(width, height) / 62, 6.5), 11) * dpr);
    sizeDirty = false;
  }

  const observer = new ResizeObserver(() => {
    sizeDirty = true;
    if (still) draw(performance.now());
  });
  observer.observe(canvas);

  let scrollTarget = 0;
  let scroll = 0;
  let aimX = 0;
  let aimY = 0;
  let turnX = 0;
  let turnY = 0;
  let clientX = 0;
  let clientY = 0;
  let pointerDirty = false;
  let pushX = 0;
  let pushY = 0;
  let pushAim = 0;
  let push = 0;

  const finePointer = !still && window.matchMedia("(pointer: fine)").matches;
  const onPointer = (e: PointerEvent) => {
    aimX = (e.clientX / window.innerWidth) * 2 - 1;
    aimY = (e.clientY / window.innerHeight) * 2 - 1;
    clientX = e.clientX;
    clientY = e.clientY;
    pointerDirty = true;
  };
  if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });

  const started = performance.now();
  let previous = started;

  function draw(now: number) {
    if (sizeDirty) resize();
    const g = gl!;
    const time = (now - started) / 1000;
    const delta = Math.min((now - previous) / 1000, 0.1);
    previous = now;

    if (morph < 1) {
      morph = Math.min(morph + delta / morphSeconds, 1);
    } else if (queued !== null) {
      if (queued === toIndex) queued = null;
      else begin(queued);
    }

    scroll += (scrollTarget - scroll) * (still ? 1 : 0.1);
    turnX += (aimX - turnX) * 0.05;
    turnY += (aimY - turnY) * 0.05;

    if (pointerDirty) {
      pointerDirty = false;
      const rect = canvas.getBoundingClientRect();
      pushX = ((clientX - rect.left) / rect.width) * 2 - 1;
      pushY = 1 - ((clientY - rect.top) / rect.height) * 2;
      pushAim = Math.abs(pushX) < 1.05 && Math.abs(pushY) < 1.05 ? 1 : 0;
    }
    push += (pushAim - push) * 0.09;

    const spin = (still ? 0.3 : Math.sin(time * 0.36) * 0.46) + turnX * 0.32 + scroll * 0.8;
    const tilt = -0.05 + turnY * 0.18 - scroll * 0.2;
    transform(model, tilt, spin, 0, scroll * 0.5, -camZ);

    g.clear(g.COLOR_BUFFER_BIT);
    g.uniformMatrix4fv(uniforms.uModel, false, model);
    g.uniform1f(uniforms.uTime, time % 3600);
    g.uniform1f(uniforms.uMorph, morph);
    g.uniform1f(uniforms.uScatter, scroll * 0.9);
    g.uniform2f(
      uniforms.uRoll,
      (SHAPE_ROLL[shapes[fromIndex]] ?? 0) * time,
      (SHAPE_ROLL[shapes[toIndex]] ?? 0) * time,
    );
    g.uniform3f(uniforms.uPointer, pushX, pushY, push);
    g.drawArrays(g.POINTS, 0, Math.floor(config.count * drawFraction));
  }

  const loop = createLoop({
    canvas,
    halfRate: config.halfRate,
    still,
    draw,
    degrade() {
      dprScale *= 0.8;
      drawFraction = Math.max(drawFraction * 0.72, 0.35);
      sizeDirty = true;
    },
    canSettle: () => morph >= 1 && queued === null,
    onReady,
    onFail,
  });

  return {
    show(index) {
      if (loop.stopped) {
        fromIndex = index;
        toIndex = index;
        morph = 1;
        bindShapes();
        draw(performance.now());
        return;
      }
      if (morph < 1) queued = index;
      else if (index !== toIndex) begin(index);
    },
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
