/**
 * Ribbons are real triangles widened in screen space, so root thickness tapers smoothly
 * and stays sharp at any resolution. Glow comes from the falloff across the ribbon rather
 * than a post-processing pass, which is what keeps this cheap on phones.
 */
export const RIBBON_VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aTan;
layout(location=2) in vec4 aData; // side, radius, time, seed

uniform mat4 uProj;
uniform mat4 uModel;
uniform vec2 uRes;
uniform vec2 uShift;
uniform float uGrow;
uniform float uTime;
uniform float uPx;
uniform float uSway;
uniform float uCameraDistance;

out float vSide;
out float vT;
out float vSeed;
out float vLight;

vec3 sway(vec3 p) {
  float s = aData.w * 6.283;
  return p + vec3(sin(uTime * .32 + p.y * 2.1 + s), 0., cos(uTime * .27 + p.y * 1.7 + s)) * .03 * aData.z * uSway;
}

void main() {
  float reached = uGrow - aData.z;
  if (reached <= 0.) {
    gl_Position = vec4(2., 2., 2., 1.);
    return;
  }

  vec4 world = uModel * vec4(sway(aPos), 1.);
  vec4 ahead = uModel * vec4(sway(aPos + aTan * .03), 1.);
  vec4 a = uProj * world;
  vec4 b = uProj * ahead;

  vec2 dir = (b.xy / b.w - a.xy / a.w) * uRes;
  float len = length(dir);
  dir = len > 1e-4 ? dir / len : vec2(1., 0.);
  vec2 normal = vec2(-dir.y, dir.x);

  float front = smoothstep(0., .035, reached);
  float width = max(aData.y * front * uPx / a.w, .55);

  // The ribbon is drawn three times wider than the line so the outer part can carry the glow.
  a.xy += normal * aData.x * width * 3. * 2. / uRes * a.w;
  a.xy += uShift * a.w;
  gl_Position = a;

  vSide = aData.x;
  vT = aData.z;
  vSeed = aData.w;
  float depthFade = clamp(.78 - (a.w - uCameraDistance) * .17, .2, 1.);
  float tipGlow = 1. - smoothstep(0., .05, reached);
  vLight = depthFade + tipGlow * 1.6;
}`;

export const RIBBON_FRAGMENT = `#version 300 es
precision mediump float;
in float vSide;
in float vT;
in float vSeed;
in float vLight;

uniform float uPhase;
uniform float uAlpha;
uniform vec3 uRoot;
uniform vec3 uTip;
uniform vec3 uSpark;

out vec4 outColor;

void main() {
  float d = abs(vSide);
  float core = smoothstep(.42, .24, d);
  float halo = pow(1. - d, 3.) * .3;

  // A bright head with a fading tail, travelling from the trunk toward the tips.
  float wave = fract(vT * 3. - uPhase + vSeed * 7.);
  float pulse = pow(wave, 20.) * smoothstep(1., .99, wave);

  vec3 color = mix(uRoot, uTip, smoothstep(.1, .85, vT)) + uSpark * pulse * .95;
  float alpha = (core + halo) * vLight * uAlpha;
  outColor = vec4(color * alpha, alpha);
}`;

export const SOLID_VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNor;

uniform mat4 uProj;
uniform mat4 uModel;
uniform vec2 uShift;

out vec3 vNormal;
out vec3 vView;

void main() {
  vec4 world = uModel * vec4(aPos, 1.);
  vec4 clip = uProj * world;
  clip.xy += uShift * clip.w;
  gl_Position = clip;
  vNormal = mat3(uModel) * aNor;
  vView = -world.xyz;
}`;

export const SOLID_FRAGMENT = `#version 300 es
precision mediump float;
in vec3 vNormal;
in vec3 vView;

uniform vec3 uBase;
uniform vec3 uRim;
uniform float uAlpha;

out vec4 outColor;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float diffuse = max(dot(n, normalize(vec3(-.45, .7, .55))), 0.);
  float rim = pow(1. - max(dot(n, v), 0.), 2.6);
  vec3 color = uBase * (.82 + diffuse * .85) + uRim * rim * .5;
  outColor = vec4(color * uAlpha, uAlpha);
}`;

export const MOTE_VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec4 aData; // size, speed, phase, glyph (negative = plain dot)

uniform mat4 uProj;
uniform mat4 uModel;
uniform vec2 uShift;
uniform float uTime;
uniform float uPx;
uniform float uGrow;
uniform float uRise;

out float vAlpha;
out float vGlyph;

void main() {
  float life = fract(uTime * aData.y + aData.z);
  vec3 p = aPos;
  p.y += (life - .5) * 2.4 * uRise;
  p.x += sin(uTime * .35 + aData.z * 40.) * .07;
  p.z += cos(uTime * .29 + aData.z * 30.) * .07;

  vec4 clip = uProj * uModel * vec4(p, 1.);
  clip.xy += uShift * clip.w;
  gl_Position = clip;
  gl_PointSize = aData.x * uPx / clip.w;

  float appear = smoothstep(.15, .6, uGrow);
  vAlpha = smoothstep(0., .18, life) * smoothstep(1., .65, life) * appear;
  vGlyph = aData.w;
}`;

export const MOTE_FRAGMENT = `#version 300 es
precision mediump float;
in float vAlpha;
in float vGlyph;

uniform sampler2D uAtlas;
uniform vec3 uColor;

out vec4 outColor;

void main() {
  float shape;
  if (vGlyph < 0.) {
    float d = length(gl_PointCoord - .5) * 2.;
    shape = pow(max(1. - d, 0.), 2.);
  } else {
    float column = mod(vGlyph, 4.);
    float row = floor(vGlyph / 4.);
    shape = texture(uAtlas, (vec2(column, row) + gl_PointCoord) / vec2(4., 2.)).r;
  }
  float alpha = shape * vAlpha;
  outColor = vec4(uColor * alpha, alpha);
}`;
