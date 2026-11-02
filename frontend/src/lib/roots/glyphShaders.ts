/**
 * Every shape is one draw call of small code characters, and all the movement happens in
 * the vertex shader: the points only need uploading once, so morphing costs the CPU nothing.
 */
export const GLYPH_VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec4 aFrom; // x, y, z, glow
layout(location=1) in vec4 aTo;
layout(location=2) in vec3 aData; // size, seed, glyph (negative = plain dot)

uniform mat4 uProj;
uniform mat4 uModel;
uniform float uMorph;
uniform float uTime;
uniform float uSize;
uniform float uCameraDistance;
uniform float uAspect;
uniform float uScatter;
uniform vec2 uRoll;
uniform vec3 uPointer; // x, y in clip space, strength

out float vLight;
out float vSpark;
out float vGlyph;

vec2 turn(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  float seed = aData.y;
  float angle = seed * 6.283;

  // Every point leaves at its own moment, so a shape dissolves instead of sliding as one block.
  float m = smoothstep(seed * .5, seed * .5 + .5, uMorph);
  float flight = m * (1. - m) * 4.;

  float glow = mix(aFrom.w, aTo.w, m);

  vec3 p = mix(vec3(turn(aFrom.xy, uRoll.x), aFrom.z), vec3(turn(aTo.xy, uRoll.y), aTo.z), m);
  p += vec3(cos(angle * 3. + uTime * .5), sin(angle * 5.), sin(angle * 7. + uTime * .4)) * flight * .5;
  p += vec3(sin(uTime * .7 + angle), cos(uTime * .6 + angle * 2.), sin(uTime * .5 + angle * 3.)) * .012;
  p += normalize(p + vec3(.001)) * uScatter * (.3 + seed);

  vec4 clip = uProj * uModel * vec4(p, 1.);

  // The cursor parts the cloud as it passes through.
  vec2 away = clip.xy / clip.w - uPointer.xy;
  away.x *= uAspect;
  float close = exp(-dot(away, away) * 14.) * uPointer.z;
  vec2 push = normalize(away + vec2(.0001)) * close * .13;
  push.x /= uAspect;
  clip.xy += push * clip.w;

  gl_Position = clip;
  gl_PointSize = aData.x * (.72 + glow * .28) * uSize * uCameraDistance / clip.w;

  // A band of light keeps sweeping through the shape.
  float wave = fract(p.x * .16 + p.y * .22 - uTime * .13 + seed * .04);
  vSpark = pow(wave, 26.) + flight * .4 + close * .5;
  vLight = clamp(.74 - (clip.w - uCameraDistance) * .36, .2, 1.) * glow;
  vGlyph = aData.z;
}`;

export const GLYPH_FRAGMENT = `#version 300 es
precision mediump float;
in float vLight;
in float vSpark;
in float vGlyph;

uniform sampler2D uAtlas;
uniform vec3 uNear;
uniform vec3 uFar;
uniform vec3 uSpark;

out vec4 outColor;

void main() {
  float shape;
  if (vGlyph < 0.) {
    float d = length(gl_PointCoord - .5) * 2.;
    shape = smoothstep(.62, .3, d);
  } else {
    float column = mod(vGlyph, 4.);
    float row = floor(vGlyph / 4.);
    shape = smoothstep(.1, .6, texture(uAtlas, (vec2(column, row) + gl_PointCoord) / vec2(4., 2.)).r);
  }
  vec3 color = mix(uFar, uNear, vLight) + uSpark * vSpark;
  float alpha = min(shape * (vLight * .8 + .2 + vSpark * .3), 1.);
  if (alpha < .01) discard;
  outColor = vec4(color * alpha, alpha);
}`;
