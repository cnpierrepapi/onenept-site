import * as THREE from "three";

/* Five small WebGL scenes, one per section. Each is built from code (no
   model files), renders only while on screen, and holds still for people
   who ask for reduced motion. */

export type SceneKey = "field" | "globe" | "orbits" | "wave" | "merge";

const C = {
  cobalt: new THREE.Color("#3b5bff"),
  ice: new THREE.Color("#b8c6ff"),
  violet: new THREE.Color("#8a63ff"),
  signal: new THREE.Color("#ff6b2c"),
  cream: new THREE.Color("#f3efe6"),
};

type Pointer = { x: number; y: number };
type Built = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (t: number, p: Pointer) => void;
};
type Opts = { small: boolean };

/* deterministic random, so every visit draws the same picture */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SOFT_POINT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float s = smoothstep(0.5, 0.0, r);
    gl_FragColor = vec4(vColor, s * s * vAlpha);
  }
`;

function additive(mat: THREE.Material) {
  mat.transparent = true;
  mat.depthWrite = false;
  mat.blending = THREE.AdditiveBlending;
  return mat;
}

/* ------------------------------------------------------------------ */
/* field: public data as a moving surface of points. An agent picks a
   path through it and leaves a lit trace behind. */

function fieldHeight(x: number, z: number, t: number) {
  return (
    Math.sin(x * 0.18 + t * 0.35) * 1.1 +
    Math.sin(z * 0.23 - t * 0.25) * 0.9 +
    Math.sin((x + z) * 0.11 + t * 0.2) * 1.4
  );
}

function field({ small }: Opts): Built {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);

  const cols = small ? 110 : 190;
  const rows = small ? 70 : 120;
  const n = cols * rows;
  const pos = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  const r = rng(7);
  let i = 0;
  for (let a = 0; a < rows; a++) {
    for (let b = 0; b < cols; b++) {
      pos[i * 3] = (b / (cols - 1) - 0.5) * 64 + (r() - 0.5) * 0.25;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = -44 + (a / (rows - 1)) * 52 + (r() - 0.5) * 0.25;
      seed[i] = r();
      i++;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPR: { value: 1 },
    uA: { value: C.cobalt },
    uB: { value: C.ice },
  };
  const mat = additive(
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uPR;
        uniform vec3 uA; uniform vec3 uB;
        attribute float aSeed;
        varying vec3 vColor; varying float vAlpha;
        float h(vec2 p, float t) {
          return sin(p.x * 0.18 + t * 0.35) * 1.1
               + sin(p.y * 0.23 - t * 0.25) * 0.9
               + sin((p.x + p.y) * 0.11 + t * 0.2) * 1.4;
        }
        void main() {
          vec3 p = position;
          p.y += h(p.xz, uTime);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float d = -mv.z;
          gl_PointSize = uPR * (1.0 + aSeed * 1.6) * (95.0 / d);
          float crest = smoothstep(1.2, 3.1, p.y);
          vColor = mix(uA, uB, crest);
          vAlpha = smoothstep(64.0, 4.0, d) * (0.45 + 0.55 * aSeed) * (0.8 + 0.9 * crest);
        }
      `,
      fragmentShader: SOFT_POINT,
    }),
  );
  scene.add(new THREE.Points(geo, mat));

  /* the agent's trace: nodes on the surface joined by a line that draws
     itself, then a receipt ring where it ends */
  const NODES = 8;
  const SUB = 28;
  const linePos = new Float32Array((NODES - 1) * SUB * 3 + 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  const lineMat = additive(
    new THREE.LineBasicMaterial({ color: C.signal, opacity: 0.95 }),
  );
  scene.add(new THREE.Line(lineGeo, lineMat));

  const nodePos = new Float32Array(NODES * 3);
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
  const nodeLit = new Float32Array(NODES);
  nodeGeo.setAttribute("aLit", new THREE.BufferAttribute(nodeLit, 1));
  const nodeU = { uPR: uniforms.uPR, uColor: { value: C.signal } };
  const nodeMat = additive(
    new THREE.ShaderMaterial({
      uniforms: nodeU,
      vertexShader: /* glsl */ `
        uniform float uPR; uniform vec3 uColor;
        attribute float aLit;
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uPR * (5.0 + aLit * 14.0) * (32.0 / -mv.z);
          vColor = uColor;
          vAlpha = 0.25 + aLit * 0.9;
        }
      `,
      fragmentShader: SOFT_POINT,
    }),
  );
  scene.add(new THREE.Points(nodeGeo, nodeMat));

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.92, 1, 64),
    additive(
      new THREE.MeshBasicMaterial({
        color: C.signal,
        side: THREE.DoubleSide,
        opacity: 0,
      }),
    ),
  );
  ring.rotation.x = -Math.PI / 2;
  scene.add(ring);

  let path: [number, number][] = [];
  let cycle = -1;
  const CYCLE = 9;
  const pr = rng(31);
  function newPath() {
    path = [];
    const x0 = 1 + pr() * 3;
    for (let k = 0; k < NODES; k++) {
      path.push([x0 + k * (2.4 + pr() * 1.0), -5 - pr() * 12]);
    }
  }

  return {
    scene,
    camera,
    update(t, p) {
      uniforms.uTime.value = t;
      const c = Math.floor(t / CYCLE);
      if (c !== cycle) {
        cycle = c;
        newPath();
      }
      const local = (t % CYCLE) / CYCLE;
      const grow = Math.min(1, local / 0.6);
      const fade = local > 0.85 ? 1 - (local - 0.85) / 0.15 : 1;

      let v = 0;
      for (let k = 0; k < NODES - 1; k++) {
        const [ax, az] = path[k];
        const [bx, bz] = path[k + 1];
        for (let s = 0; s < SUB; s++) {
          const f = s / SUB;
          const x = ax + (bx - ax) * f;
          const z = az + (bz - az) * f;
          linePos[v++] = x;
          linePos[v++] = fieldHeight(x, z, t) + 0.12;
          linePos[v++] = z;
        }
      }
      const [lx, lz] = path[NODES - 1];
      linePos[v++] = lx;
      linePos[v++] = fieldHeight(lx, lz, t) + 0.12;
      linePos[v++] = lz;
      lineGeo.attributes.position.needsUpdate = true;
      const total = (NODES - 1) * SUB + 1;
      lineGeo.setDrawRange(0, Math.max(2, Math.floor(total * grow)));
      lineMat.opacity = 0.9 * fade;

      for (let k = 0; k < NODES; k++) {
        const [x, z] = path[k];
        nodePos[k * 3] = x;
        nodePos[k * 3 + 1] = fieldHeight(x, z, t) + 0.12;
        nodePos[k * 3 + 2] = z;
        const reached = grow * (NODES - 1) >= k - 0.01;
        nodeLit[k] = (reached ? 1 : 0) * fade;
      }
      nodeGeo.attributes.position.needsUpdate = true;
      nodeGeo.attributes.aLit.needsUpdate = true;

      const done = grow >= 1 ? (local - 0.6) / 0.25 : -1;
      if (done >= 0) {
        const e = Math.min(1, done);
        ring.position.set(lx, fieldHeight(lx, lz, t) + 0.14, lz);
        ring.scale.setScalar(0.4 + e * 2.6);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - e) * fade;
      } else {
        (ring.material as THREE.MeshBasicMaterial).opacity = 0;
      }

      /* portrait screens look further down so the field fills them */
      const tall = camera.aspect < 1;
      camera.position.set(p.x * 2.4 + Math.sin(t * 0.05) * 1.5, (tall ? 11 : 6.5) + p.y * 1.2, tall ? 12 : 15);
      camera.lookAt(tall ? 3 : 0, tall ? -1 : 0.5, -9);
    },
  };
}

/* ------------------------------------------------------------------ */
/* globe: businesses in every city, a few lighting up as leads, arcs
   from the person doing the work to the place that needs it */

function hash3(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}
function fbm(x: number, y: number, z: number) {
  return (
    vnoise(x, y, z) * 0.55 +
    vnoise(x * 2.1, y * 2.1, z * 2.1) * 0.3 +
    vnoise(x * 4.3, y * 4.3, z * 4.3) * 0.15
  );
}

function globe({ small }: Opts): Built {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const R = 5;
  const group = new THREE.Group();
  group.rotation.z = 0.32;
  scene.add(group);

  const N = small ? 9000 : 16000;
  const pos: number[] = [];
  const kind: number[] = [];
  const phase: number[] = [];
  const hot: THREE.Vector3[] = [];
  const r = rng(11);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < N; k++) {
    const y = 1 - (k / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * k;
    const x = Math.cos(th) * rad;
    const z = Math.sin(th) * rad;
    const land = fbm(x * 1.15 + 3, y * 1.15 + 1, z * 1.15 + 7) > 0.53;
    if (!land && k % 6 !== 0) continue;
    pos.push(x * R, y * R, z * R);
    let kd = land ? 1 : 0;
    if (land && r() < 0.012 && Math.abs(y) < 0.85) {
      kd = 2;
      hot.push(new THREE.Vector3(x * R, y * R, z * R));
    }
    kind.push(kd);
    phase.push(r());
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("aKind", new THREE.Float32BufferAttribute(kind, 1));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));

  const uniforms = {
    uTime: { value: 0 },
    uPR: { value: 1 },
    uR: { value: R },
    uLand: { value: C.ice },
    uSea: { value: C.cobalt },
    uHot: { value: C.signal },
  };
  const mat = additive(
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uPR; uniform float uR;
        uniform vec3 uLand; uniform vec3 uSea; uniform vec3 uHot;
        attribute float aKind; attribute float aPhase;
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vec4 c = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          gl_Position = projectionMatrix * mv;
          float front = (mv.z - c.z) / uR;
          float vis = 0.08 + 0.92 * smoothstep(-0.35, 0.55, front);
          float isHot = step(1.5, aKind);
          float isLand = step(0.5, aKind) - isHot;
          float pulse = pow(max(0.0, sin(uTime * 0.9 + aPhase * 6.2831)), 10.0);
          float size = mix(1.4, 2.1, isLand) + isHot * (2.4 + pulse * 7.0);
          gl_PointSize = uPR * size * (14.0 / -mv.z) * 1.6;
          vColor = isHot > 0.5 ? uHot : mix(uSea, uLand, isLand);
          vAlpha = vis * (isHot > 0.5 ? 0.6 + pulse * 0.6 : mix(0.12, 0.85, isLand));
        }
      `,
      fragmentShader: SOFT_POINT,
    }),
  );
  group.add(new THREE.Points(geo, mat));

  /* atmosphere: a rim glow on a slightly bigger back-facing sphere */
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.035, 64, 64),
    additive(
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: C.cobalt } },
        vertexShader: /* glsl */ `
          varying float vRim;
          void main() {
            vec3 n = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 v = normalize(-mv.xyz);
            vRim = pow(1.0 - max(dot(n, v), 0.0), 3.5);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; varying float vRim;
          void main() { gl_FragColor = vec4(uColor, vRim * 0.9); }
        `,
      }),
    ),
  );
  scene.add(atmo);

  /* arcs */
  const ARCS = small ? 4 : 7;
  const SEG = 64;
  const arcs = Array.from({ length: ARCS }, (_, k) => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array((SEG + 1) * 3);
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const m = additive(new THREE.LineBasicMaterial({ color: C.signal, opacity: 0 }));
    const line = new THREE.Line(g, m);
    group.add(line);
    return { g, p, m, born: -k * 1.1, life: 4.2 };
  });
  const ar = rng(5);
  function aim(a: (typeof arcs)[number]) {
    const s = hot[Math.floor(ar() * hot.length)];
    const e = hot[Math.floor(ar() * hot.length)];
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const lift = R * (1.12 + s.distanceTo(e) / (R * 3.2));
    mid.setLength(lift);
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
    const pts = curve.getPoints(SEG);
    pts.forEach((q, j) => {
      a.p[j * 3] = q.x;
      a.p[j * 3 + 1] = q.y;
      a.p[j * 3 + 2] = q.z;
    });
    a.g.attributes.position.needsUpdate = true;
  }

  return {
    scene,
    camera,
    update(t, p) {
      uniforms.uTime.value = t;
      group.rotation.y = t * 0.07 + p.x * 0.25;
      group.rotation.x = p.y * 0.12;
      for (const a of arcs) {
        let age = t - a.born;
        if (age > a.life) {
          a.born = t;
          age = 0;
          aim(a);
        }
        if (age < 0) {
          a.m.opacity = 0;
          continue;
        }
        if (age === 0 || a.g.drawRange.count === Infinity) aim(a);
        const f = age / a.life;
        const head = Math.min(1, f / 0.45);
        const tail = Math.max(0, (f - 0.55) / 0.45);
        const start = Math.floor(tail * SEG);
        const end = Math.max(start + 2, Math.floor(head * SEG) + 1);
        a.g.setDrawRange(start, end - start);
        a.m.opacity = 0.85;
      }
      camera.position.set(0, 0, 17.5);
      camera.lookAt(0, 0, 0);
    },
  };
}

/* ------------------------------------------------------------------ */
/* orbits: two audiences as rings of points that cross, three bodies
   that line up every few seconds. A syzygy is that line. */

function orbits({ small }: Opts): Built {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const sys = new THREE.Group();
  sys.rotation.x = 0.42;
  scene.add(sys);

  const uniforms = { uTime: { value: 0 }, uPR: { value: 1 } };
  function ring(radius: number, spread: number, color: THREE.Color, seed: number) {
    const n = small ? 3500 : 6500;
    const p = new Float32Array(n * 3);
    const s = new Float32Array(n);
    const r = rng(seed);
    for (let k = 0; k < n; k++) {
      const a = r() * Math.PI * 2;
      const g = (r() + r() + r() - 1.5) * spread;
      const rr = radius + g;
      p[k * 3] = Math.cos(a) * rr;
      p[k * 3 + 1] = (r() + r() - 1) * spread * 0.35;
      p[k * 3 + 2] = Math.sin(a) * rr;
      s[k] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(s, 1));
    const m = additive(
      new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uColor: { value: color } },
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPR; uniform vec3 uColor;
          attribute float aSeed;
          varying vec3 vColor; varying float vAlpha;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uPR * (1.2 + aSeed * 2.2) * (30.0 / -mv.z);
            vColor = uColor;
            vAlpha = 0.35 + 0.6 * aSeed * (0.6 + 0.4 * sin(uTime * 1.3 + aSeed * 40.0));
          }
        `,
        fragmentShader: SOFT_POINT,
      }),
    );
    return new THREE.Points(g, m);
  }
  const ringA = ring(4.2, 0.9, C.cobalt, 3);
  ringA.rotation.set(0.5, 0, 0.35);
  const ringB = ring(4.2, 0.9, C.violet, 9);
  ringB.rotation.set(-0.45, 0, -0.4);
  sys.add(ringA, ringB);

  /* bodies. Halos are sprites, so no GPU point-size limit can clip them */
  const halo = (() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 128;
    const g = cv.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(cv);
  })();
  function glowSprite(color: THREE.Color, size: number) {
    const sp = new THREE.Sprite(
      additive(new THREE.SpriteMaterial({ map: halo, color, opacity: 0.8 })) as THREE.SpriteMaterial,
    );
    sp.scale.setScalar(size / 22);
    return sp;
  }
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 48, 48),
    new THREE.MeshBasicMaterial({ color: C.cream }),
  );
  sys.add(core, glowSprite(C.ice, 90), glowSprite(C.cream, 34));
  const sun = new THREE.PointLight(0xfff1e0, 90, 0, 2);
  sys.add(sun);
  scene.add(new THREE.AmbientLight(0x3b5bff, 0.25));

  const RADII = [1.9, 3.3, 5.6];
  const K = [3, 2, 1];
  const PERIOD = 14;
  const bodies = RADII.map((rad, k) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 + k * 0.08, 48, 48),
      new THREE.MeshStandardMaterial({
        color: k === 1 ? C.signal : C.ice,
        roughness: 0.55,
        metalness: 0.1,
        emissive: k === 1 ? C.signal : C.cobalt,
        emissiveIntensity: 0.12,
      }),
    );
    const halo = glowSprite(k === 1 ? C.signal : C.ice, 16 + k * 5);
    const o = new THREE.Group();
    o.add(m, halo);
    sys.add(o);
    const track = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, rad, rad).getPoints(160).map((q) => new THREE.Vector3(q.x, 0, q.y)),
      ),
      additive(new THREE.LineBasicMaterial({ color: C.ice, opacity: 0.12 })),
    );
    sys.add(track);
    return o;
  });

  const alignGeo = new THREE.BufferGeometry();
  alignGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
  const alignMat = additive(new THREE.LineBasicMaterial({ color: C.signal, opacity: 0 }));
  sys.add(new THREE.Line(alignGeo, alignMat));

  return {
    scene,
    camera,
    update(t, p) {
      uniforms.uTime.value = t;
      ringA.rotation.y = t * 0.06;
      ringB.rotation.y = -t * 0.05;
      const base = 0.6;
      bodies.forEach((b, k) => {
        const a = base + ((Math.PI * 2 * K[k]) / PERIOD) * t * 0.5;
        b.position.set(Math.cos(a) * RADII[k], 0, Math.sin(a) * RADII[k]);
      });
      /* how close to a straight line are they */
      const ang = bodies.map((b) => Math.atan2(b.position.z, b.position.x));
      const off = (x: number, y: number) => {
        const d = Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y)));
        return d;
      };
      const spread = Math.max(off(ang[0], ang[1]), off(ang[1], ang[2]), off(ang[0], ang[2]));
      const near = Math.max(0, 1 - spread / 0.35);
      alignMat.opacity = near * near * 0.95;
      const far = bodies[2].position.clone().multiplyScalar(1.25);
      const a = alignGeo.attributes.position as THREE.BufferAttribute;
      a.setXYZ(0, 0, 0, 0);
      a.setXYZ(1, far.x, far.y, far.z);
      a.needsUpdate = true;

      sys.rotation.y = p.x * 0.3;
      camera.position.set(0, 3.2 + p.y * 1.5, 13.5);
      camera.lookAt(0, 0, 0);
    },
  };
}

/* ------------------------------------------------------------------ */
/* wave: rows of a call's audio. Most of them talk. One band is flat,
   apart from the beep. That band is the voicemail the API called done. */

function wave({ small }: Opts): Built {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  const ROWS = small ? 30 : 48;
  const COLS = small ? 160 : 260;
  const uniforms = {
    uTime: { value: 0 },
    uVoice: { value: C.ice },
    uFlat: { value: C.signal },
  };
  const mat = additive(
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime; uniform vec3 uVoice; uniform vec3 uFlat;
        attribute float aRow;
        varying vec3 vColor; varying float vAlpha;
        float speech(float x, float r, float t) {
          float env = exp(-pow(x / 7.0, 2.0));
          float s = sin(x * 2.3 + t * 2.6 + r * 9.0) * 0.5
                  + sin(x * 5.3 - t * 3.7 + r * 17.0) * 0.28
                  + sin(x * 0.9 + t * 1.1 + r * 3.0) * 0.6;
          float burst = smoothstep(0.25, 0.95, sin(x * 0.42 - t * 0.8 + r * 5.0) * 0.5 + 0.5);
          return env * s * burst * 2.1;
        }
        void main() {
          vec3 p = position;
          float isFlat = step(0.9, aRow) * step(aRow, 0.97);
          float beepX = mod(uTime * 2.2, 34.0) - 17.0;
          float beep = exp(-pow((p.x - beepX) * 2.2, 2.0)) * 0.55 * sin(p.x * 30.0);
          p.y += mix(speech(p.x, aRow, uTime), beep, isFlat);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          vColor = mix(uVoice, uFlat, isFlat);
          float edge = smoothstep(16.0, 11.0, abs(p.x));
          vAlpha = edge * mix(0.22 + 0.6 * aRow, 1.0, isFlat);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor; varying float vAlpha;
        void main() { gl_FragColor = vec4(vColor, vAlpha); }
      `,
    }),
  );
  for (let rw = 0; rw < ROWS; rw++) {
    const f = rw / (ROWS - 1);
    const p = new Float32Array(COLS * 3);
    const a = new Float32Array(COLS).fill(f);
    for (let c = 0; c < COLS; c++) {
      p[c * 3] = (c / (COLS - 1) - 0.5) * 34;
      p[c * 3 + 1] = 0;
      p[c * 3 + 2] = -14 + f * 18;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("aRow", new THREE.BufferAttribute(a, 1));
    scene.add(new THREE.Line(g, mat));
  }
  return {
    scene,
    camera,
    update(t, p) {
      uniforms.uTime.value = t;
      camera.position.set(p.x * 1.8, 6.2 + p.y * 1.2, 12.5);
      camera.lookAt(0, -0.5, -4);
    },
  };
}

/* ------------------------------------------------------------------ */
/* merge: a main line with three branches that leave and come back.
   Light runs along them; the three merge points burn. */

function merge({ small }: Opts): Built {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const group = new THREE.Group();
  scene.add(group);
  const uniforms = {
    uTime: { value: 0 },
    uPR: { value: 1 },
    uBase: { value: C.cobalt },
    uHi: { value: C.signal },
  };
  const lineMat = (offset: number) =>
    additive(
      new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uOff: { value: offset } },
        vertexShader: /* glsl */ `
          attribute float aT; varying float vT;
          void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform float uOff; uniform vec3 uBase; uniform vec3 uHi;
          varying float vT;
          void main() {
            float d = fract(vT - uTime * 0.11 + uOff);
            float glow = smoothstep(0.12, 0.0, d) ;
            vec3 col = mix(uBase, uHi, glow);
            gl_FragColor = vec4(col, 0.6 + glow * 0.4);
          }
        `,
      }),
    );
  function addCurve(curve: THREE.Curve<THREE.Vector3>, offset: number, radius: number) {
    const g = new THREE.TubeGeometry(curve, 260, radius, 10, false);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    const t = new Float32Array(uv.count);
    for (let k = 0; k < uv.count; k++) t[k] = uv.getX(k);
    g.setAttribute("aT", new THREE.BufferAttribute(t, 1));
    group.add(new THREE.Mesh(g, lineMat(offset)));
    return curve.getPoints(220);
  }
  const L = 18;
  const main = new THREE.LineCurve3(new THREE.Vector3(-L, 0, 0), new THREE.Vector3(L, 0, 0));
  const mainPts = addCurve(main, 0, 0.07);

  const BR: [number, number, number, number][] = [
    [-13, -6, 2.4, -1.5],
    [-4, 2.5, 2.9, 1.8],
    [5, 12, 2.2, -2.2],
  ];
  const merges: THREE.Vector3[] = [];
  const commits: THREE.Vector3[] = [];
  BR.forEach(([a, b, h, zz], k) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(a, 0, 0),
      new THREE.Vector3(a + 1.2, h * 0.8, zz * 0.7),
      new THREE.Vector3((a + b) / 2, h, zz),
      new THREE.Vector3(b - 1.2, h * 0.8, zz * 0.7),
      new THREE.Vector3(b, 0, 0),
    ]);
    const pts = addCurve(curve, 0.3 * (k + 1), 0.05);
    merges.push(new THREE.Vector3(b, 0, 0));
    for (let j = 1; j < 4; j++) commits.push(pts[Math.floor((pts.length * j) / 4)]);
  });
  for (let j = 0; j < 22; j++) commits.push(mainPts[Math.floor((mainPts.length * (j + 0.5)) / 22)]);

  function dots(list: THREE.Vector3[], size: number, color: THREE.Color, pulse: boolean) {
    const g = new THREE.BufferGeometry().setFromPoints(list);
    g.setAttribute("aPhase", new THREE.Float32BufferAttribute(list.map((_, k) => k * 0.37), 1));
    const m = additive(
      new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uColor: { value: color }, uSize: { value: size }, uPulse: { value: pulse ? 1 : 0 } },
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPR; uniform vec3 uColor; uniform float uSize; uniform float uPulse;
          attribute float aPhase;
          varying vec3 vColor; varying float vAlpha;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            float b = 0.75 + 0.25 * sin(uTime * 2.0 + aPhase * 6.0) * uPulse;
            gl_PointSize = uPR * uSize * b * (20.0 / -mv.z);
            vColor = uColor; vAlpha = 0.9 * b;
          }
        `,
        fragmentShader: SOFT_POINT,
      }),
    );
    group.add(new THREE.Points(g, m));
  }
  dots(commits, 6, C.ice, false);
  dots(merges, 40, C.signal, true);
  /* a soft glow on each merge, drawn as a sprite so it can be big */
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const g2 = cv.getContext("2d")!;
  const grd = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,0.9)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.25)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g2.fillStyle = grd;
  g2.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(cv);
  const glows = merges.map((m) => {
    const sp = new THREE.Sprite(
      additive(new THREE.SpriteMaterial({ map: glowTex, color: C.signal, opacity: 0.7 })) as THREE.SpriteMaterial,
    );
    sp.position.copy(m);
    sp.scale.setScalar(2.4);
    group.add(sp);
    return sp;
  });

  /* dust */
  const n = small ? 600 : 1400;
  const dp = new Float32Array(n * 3);
  const dr = rng(2);
  for (let k = 0; k < n; k++) {
    dp[k * 3] = (dr() - 0.5) * 44;
    dp[k * 3 + 1] = (dr() - 0.5) * 14;
    dp[k * 3 + 2] = (dr() - 0.5) * 16 - 4;
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  scene.add(
    new THREE.Points(
      dg,
      additive(new THREE.PointsMaterial({ color: C.cobalt, size: 0.06, opacity: 0.6 })),
    ),
  );

  return {
    scene,
    camera,
    update(t, p) {
      uniforms.uTime.value = t;
      glows.forEach((g, k) => g.scale.setScalar(2.2 + Math.sin(t * 2 + k * 2.1) * 0.5));
      group.rotation.y = Math.sin(t * 0.12) * 0.18 + p.x * 0.2;
      group.rotation.x = 0.18 + p.y * 0.08;
      camera.position.set(0, 2.4, 15.5);
      camera.lookAt(0, 1.1, 0);
    },
  };
}

const BUILDERS: Record<SceneKey, (o: Opts) => Built> = {
  field,
  globe,
  orbits,
  wave,
  merge,
};

export function mount(key: SceneKey, host: HTMLElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return () => {};
  }
  const pr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(pr);
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  host.appendChild(canvas);

  const small = Math.min(window.innerWidth, host.clientWidth) < 700;
  const built = BUILDERS[key]({ small });
  built.scene.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.ShaderMaterial | undefined;
    if (m && "uniforms" in m && m.uniforms?.uPR) m.uniforms.uPR.value = pr;
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let visible = false;
  let t = 6;
  let last = 0;

  const frame = () => {
    built.update(t, pointer);
    renderer.render(built.scene, built.camera);
  };
  const size = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    built.camera.aspect = w / h;
    built.camera.updateProjectionMatrix();
    if (reduce || !visible) frame();
  };
  const ro = new ResizeObserver(size);
  ro.observe(host);
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      last = 0;
    },
    { rootMargin: "150px" },
  );
  io.observe(host);
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    target.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  size();
  if (!reduce) {
    renderer.setAnimationLoop((ts: number) => {
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      t += dt;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      pointer.x += (clamp(target.x) - pointer.x) * 0.04;
      pointer.y += (clamp(target.y) - pointer.y) * 0.04;
      frame();
    });
  }

  return () => {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    built.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    renderer.dispose();
    canvas.remove();
  };
}
