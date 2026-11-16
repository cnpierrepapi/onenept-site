// The clay look as ordinary rasterised meshes: one material for every object, and soft blob shadows on
// the paper. Replaces the raymarched version, which ran at about 2 fps on a laptop GPU (16 Nov 2026).
import { Geometry, Mesh, Program, Plane, Sphere, Cylinder, Torus, Transform, Vec3, Quat, type OGLRenderingContext } from "ogl";
import { meshSDF, type SDF } from "@/lib/mesh";

/* palette in linear light (sRGB hex in the comments) */
export const C = {
  orange: [1.0, 0.147, 0.025],  // #FF6B2C
  cobalt: [0.024, 0.104, 1.0],  // #2F5BFF
  lemon: [1.0, 0.759, 0.072],   // #FFE14D
  ink: [0.022, 0.018, 0.015],   // #15120F, lifted a touch
  cream: [0.9, 0.82, 0.7],
  red: [0.807, 0.048, 0.02],    // #E8402B
} as const;
export type Colour = readonly [number, number, number];

const CLAY_VERT = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vN;
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CLAY_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uEmissive;
uniform float uClipY;
uniform vec3 cameraPosition;
varying vec3 vN;
varying vec3 vW;
void main() {
  if (vW.y < uClipY) discard;              // things sink through the paper
  vec3 n = normalize(vN);
  vec3 L = normalize(vec3(-0.55, 0.9, 0.6));
  vec3 V = normalize(cameraPosition - vW);
  float dif = clamp(dot(n, L) * 0.6 + 0.4, 0.0, 1.0);
  float hemi = n.y * 0.5 + 0.5;
  float fre = pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 3.0);
  float spec = pow(clamp(dot(reflect(-L, n), V), 0.0, 1.0), 18.0);
  vec3 col = uColor * (0.30 + 0.16 * hemi + 0.72 * dif) + vec3(1.0, 0.82, 0.68) * fre * 0.10 + vec3(1.0, 0.92, 0.82) * spec * 0.06;
  col = mix(col, uColor * 1.25 + 0.08, uEmissive);
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}
`;

const SHADOW_VERT = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const SHADOW_FRAG = /* glsl */ `
precision highp float;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  float d = length(vUv * 2.0 - 1.0);
  float a = pow(clamp(1.0 - d, 0.0, 1.0), 1.6) * uOpacity;
  gl_FragColor = vec4(0.47, 0.42, 0.37, a);   // warm grey, the paper's own shadow
}
`;

export type ClayMesh = Mesh & { program: Program };

export class Kit {
  gl: OGLRenderingContext;
  private unitCyl: Geometry;
  private unitSphere: Geometry;
  private plane: Geometry;
  constructor(gl: OGLRenderingContext) {
    this.gl = gl;
    this.unitCyl = new Cylinder(gl, { radiusTop: 1, radiusBottom: 1, height: 1, radialSegments: 18, heightSegments: 1 });
    this.unitSphere = new Sphere(gl, { radius: 1, widthSegments: 24, heightSegments: 16 });
    this.plane = new Plane(gl, { width: 1, height: 1 });
  }
  program(colour: Colour, emissive = 0) {
    return new Program(this.gl, {
      vertex: CLAY_VERT,
      fragment: CLAY_FRAG,
      uniforms: { uColor: { value: [...colour] }, uEmissive: { value: emissive }, uClipY: { value: -100 } },
      cullFace: false,
    });
  }
  /** a mesh from a distance function, built once */
  sdf(f: SDF, min: [number, number, number], max: [number, number, number], step: number, colour: Colour, parent?: Transform) {
    const d = meshSDF(f, min, max, step);
    const g = new Geometry(this.gl, { position: { size: 3, data: d.position }, normal: { size: 3, data: d.normal }, index: { data: d.index } });
    return this.wrap(g, colour, parent);
  }
  torus(radius: number, tube: number, colour: Colour, parent?: Transform) {
    return this.wrap(new Torus(this.gl, { radius, tube, radialSegments: 16, tubularSegments: 56 }), colour, parent);
  }
  sphere(colour: Colour, parent?: Transform) {
    return this.wrap(this.unitSphere, colour, parent);
  }
  /** a unit cylinder (height 1 along y); place it with stretch() */
  rod(colour: Colour, parent?: Transform) {
    return this.wrap(this.unitCyl, colour, parent);
  }
  wrap(g: Geometry, colour: Colour, parent?: Transform) {
    const m = new Mesh(this.gl, { geometry: g, program: this.program(colour) }) as ClayMesh;
    if (parent) m.setParent(parent);
    return m;
  }
  /** a soft round shadow lying on the paper */
  shadow(parent?: Transform) {
    const p = new Program(this.gl, { vertex: SHADOW_VERT, fragment: SHADOW_FRAG, uniforms: { uOpacity: { value: 0.32 } }, transparent: true, depthWrite: false, cullFace: false });
    p.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    const m = new Mesh(this.gl, { geometry: this.plane, program: p }) as ClayMesh;
    m.rotation.x = -Math.PI / 2;
    if (parent) m.setParent(parent);
    return m;
  }
}

const UP = new Vec3(0, 1, 0);
const tmpA = new Vec3(), tmpB = new Vec3();
/** stretch a unit rod between two points with a radius; a zero-length rod is hidden */
export function stretch(m: Mesh, a: number[], b: number[], r: number) {
  tmpA.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = tmpA.len();
  m.visible = len > 1e-4 && r > 0;
  if (!m.visible) return;
  m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
  tmpA.normalize();
  const dot = UP.dot(tmpA);
  if (dot > 0.9999) m.quaternion.set(0, 0, 0, 1);
  else if (dot < -0.9999) m.quaternion.fromAxisAngle(new Vec3(1, 0, 0), Math.PI);
  else {
    tmpB.cross(UP, tmpA).normalize();
    m.quaternion.fromAxisAngle(tmpB, Math.acos(dot));
  }
  m.scale.set(r, len, r);
}

export function setColour(m: ClayMesh, c: Colour, emissive = 0) {
  m.program.uniforms.uColor.value = [...c];
  m.program.uniforms.uEmissive.value = emissive;
}

export const ease = (x: number) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
export const smooth = (a: number, b: number, x: number) => ease((x - a) / (b - a));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export { Quat, Transform, Vec3 };
