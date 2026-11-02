/** WebGL plumbing shared by the 3D scenes, so each scene only holds what makes it different. */

export type Tier = "low" | "mid" | "high";
export type GL = WebGL2RenderingContext;

export const GLYPHS = ["{", "}", "<", ">", "/", ";", "0", "1"];

/** Gives the browser a chance to handle input between the heavier setup steps. */
export const nextTask = (ms = 0) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function startCompile(gl: GL, vertex: string, fragment: string) {
  const program = gl.createProgram();
  const parts = [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const;

  for (const [type, source] of parts) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }

  gl.linkProgram(program);
  return program;
}

export function finishCompile(gl: GL, program: WebGLProgram) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Shader link failed");
  }

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i)!.name;
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
}

/** Where the browser supports it, shaders compile off the main thread and this only waits. */
export async function waitForCompile(gl: GL, programs: WebGLProgram[]) {
  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  if (!parallel) return;
  while (programs.some((program) => !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR))) {
    await nextTask(20);
  }
}

export function drawGlyphAtlas(gl: GL) {
  const cell = 64;
  const canvas = document.createElement("canvas");
  canvas.width = cell * 4;
  canvas.height = cell * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "600 50px ui-monospace, SFMono-Regular, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  GLYPHS.forEach((glyph, i) => {
    ctx.fillText(glyph, (i % 4) * cell + cell / 2, Math.floor(i / 4) * cell + cell / 2);
  });

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

export function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

/** Rotation around X then Y, followed by a translation */
export function transform(out: Float32Array, rx: number, ry: number, tx: number, ty: number, tz: number) {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  out[0] = cy;
  out[1] = sx * sy;
  out[2] = -cx * sy;
  out[3] = 0;
  out[4] = 0;
  out[5] = cx;
  out[6] = sx;
  out[7] = 0;
  out[8] = sy;
  out[9] = -sx * cy;
  out[10] = cx * cy;
  out[11] = 0;
  out[12] = tx;
  out[13] = ty;
  out[14] = tz;
  out[15] = 1;
  return out;
}

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface LoopOptions {
  canvas: HTMLCanvasElement;
  halfRate: boolean;
  still: boolean;
  draw: (now: number) => void;
  /** Called while the device keeps falling behind, so the scene can give up some detail */
  degrade: () => void;
  /** Whether the scene is at a point where it can stop and stay as a finished still image */
  canSettle: (now: number) => boolean;
  onReady: () => void;
  onFail: () => void;
}

/**
 * Runs a scene only while it is on screen, and watches real frame times to keep it smooth.
 * If giving up detail is not enough, the scene settles into a finished still image.
 */
export function createLoop({ canvas, halfRate, still, draw, degrade, canSettle, onReady, onFail }: LoopOptions) {
  let frameId = 0;
  let running = false;
  let lastFrame = 0;
  let tick = 0;
  let readyFired = false;
  let slowSteps = 0;
  let sampleTime = 0;
  let sampleCount = 0;
  let settling = false;

  function adapt(delta: number) {
    if (delta > 200) return;
    sampleTime += delta;
    sampleCount++;
    if (sampleCount < 40) return;
    const average = sampleTime / sampleCount;
    sampleTime = 0;
    sampleCount = 0;
    if (average <= 24) return;
    slowSteps++;
    if (slowSteps > 3) {
      settling = true;
      return;
    }
    degrade();
  }

  function frame(now: number) {
    if (!running) return;
    frameId = requestAnimationFrame(frame);
    const delta = now - lastFrame;
    lastFrame = now;
    tick++;
    if (halfRate && tick % 2) return;
    draw(now);
    if (!readyFired) {
      readyFired = true;
      onReady();
    }
    adapt(halfRate ? delta * 0.5 : delta);
    if (settling && canSettle(now)) stop();
  }

  function start() {
    if (running || still) return;
    running = true;
    lastFrame = performance.now();
    frameId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
  }

  let onScreen = true;
  const applyVisibility = () => {
    if (onScreen && !document.hidden && !settling) start();
    else stop();
  };

  const visibility = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      applyVisibility();
    },
    { rootMargin: "80px" },
  );
  visibility.observe(canvas);
  document.addEventListener("visibilitychange", applyVisibility);

  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
    onFail();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  if (still) {
    draw(performance.now());
    onReady();
  }

  return {
    /** True once the scene has stopped animating for good */
    get stopped() {
      return still || (settling && !running);
    },
    destroy() {
      stop();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", applyVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
    },
  };
}
