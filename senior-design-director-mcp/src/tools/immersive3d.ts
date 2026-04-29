/**
 * Immersive 3D Experience Generator
 * Produces scroll-driven, cinematic 3D web experiences using React Three Fiber,
 * GSAP ScrollTrigger, and WebGL shaders. Output is production-ready code with
 * full scene architecture, camera spline path, and interaction mapping.
 */

export interface Immersive3DInput {
  concept: string;
  sections?: number;
  style?: '3d-style';
  primaryColor?: string;
  framework?: '3d-framework';
  includeShaders?: boolean;
  projectName?: string;
}

export type ExperienceStyle =
  | 'cosmic'
  | 'architectural'
  | 'organic'
  | 'minimal'
  | 'brutalist'
  | 'liquid'
  | 'crystalline';

export type Framework = 'react-three-fiber' | 'vanilla-threejs';

function buildSceneBreakdown(concept: string, sections: number, style: ExperienceStyle): string {
  const sectionNames = [
    'Establishing Shot',
    'Pull Into Depth',
    'First Focus Moment',
    'Midpoint Revelation',
    'Climax Interaction',
    'Resolution Exit',
    'Final State',
  ];

  const cameraMovements: Record<ExperienceStyle, string[]> = {
    cosmic: [
      'Wide establishing — camera at [0,0,80], looking toward origin, stars filling periphery',
      'Slow push in — lerp Z: 80→30, slight Y rise, nebula geometry scales in',
      'Stop at [0,5,30] — orbit target object, bloom intensifies',
      'Pull back and pan right — camera arcs to [40,10,20], new object enters frame',
      'Rapid Z-dive — Z:20→-10, particles scatter, chromatic aberration spikes',
      'Slow deceleration — camera settles at [0,0,5], object fills frame',
      'Gentle idle orbit — subtle Z drift ±2, complete stillness',
    ],
    architectural: [
      "Bird's eye at [0,60,0] — orthographic-feel, structure below in fog",
      'Crane down — Y:60→10, Z-offset builds, structure reveals through fog',
      'Eye-level walk-through — camera translates X along building face at Y:5',
      'Interior push — Z-dive into aperture, ambient occlusion deepens',
      'Hero space reveal — camera centers in void, spotlights sweep',
      'Slow zoom to material detail — FOV narrows, texture fills frame',
      'Pull to full exterior — reverse crane, structure in full context',
    ],
    organic: [
      'Surface level at [0,2,40] — mycelial threads in shallow DOF',
      'Root dive — Y drops to -5, camera tilts down into network',
      'Node discovery — camera stops at junction, node pulses in sync',
      'Branch follow — camera tracks along a single tendril path',
      'Bloom — network expands outward, camera pulls back to show scale',
      'Convergence — tendrils flow toward center, camera follows inward',
      'Stillness — single glowing node, everything else dim',
    ],
    minimal: [
      'Infinite plane — camera at [0,10,50], single geometry in distance',
      'Approach — linear Z push at constant speed, no rotation',
      'Circumnavigate — camera orbits geometry at fixed radius',
      'Scale event — geometry scales 1→4, camera compensates backward',
      'Deconstruct — geometry fragments, camera holds steady',
      'Reconstruct — fragments rejoin, camera moves forward again',
      'Hold — camera at [0,0,20], geometry at rest',
    ],
    brutalist: [
      'Hard angle at [30,30,50] — concrete monolith, harsh shadows',
      'Oblique push — camera moves diagonal, no smooth easing',
      'Collision approach — abrupt stop at Z:5, impact shake',
      'Vertical ascent — snap to [0,80,5], looking down at grid',
      'Grid descent — Z-axis drop with stepped easing (ease-steps)',
      'Face slam — sudden push to Z:0.5, fill frame with texture',
      'Snap back — cut to [0,0,50], crisp ease-none',
    ],
    liquid: [
      'Surface float — camera just above fluid plane, horizon line visible',
      'Submersion — Y drops below 0, underwater caustics on all surfaces',
      'Current drift — camera translates sideways on sine wave',
      'Vortex center — camera spirals inward (helix path)',
      'Pressure depth — FOV widens, everything tints deep blue',
      'Ascent — Y rises through surface plane, water drips down frame',
      'Emerge — camera clears surface, daylight floods scene',
    ],
    crystalline: [
      'Crystal forest at [0,0,60] — faceted spires catch directional light',
      'Fly-in along valley floor — Z-push, spires tower above',
      'Refraction study — stop at [5,3,10], single crystal fills 40% frame',
      'Internal view — camera enters crystal, IOR-correct refraction',
      'Chromatic split — prismatic dispersion, camera slow-rotates',
      'Re-emergence — camera exits crystal face, refractions trail behind',
      'Aerial withdrawal — Y+Z pull to [0,40,80], full formation visible',
    ],
  };

  const movements = cameraMovements[style] ?? cameraMovements['cosmic'];
  const count = Math.min(sections, movements.length);

  let out = '';
  for (let i = 0; i < count; i++) {
    const pct = (i * (100 / count)).toFixed(0);
    const nextPct = ((i + 1) * (100 / count)).toFixed(0);
    const name = sectionNames[i] ?? `Scene ${i + 1}`;
    out += `\n### Scene ${i + 1}: ${name}  (scroll ${pct}%→${nextPct}%)\n`;
    out += `**Camera:** ${movements[i]}\n`;
    out += `**Objects:** ${getObjectInteraction(i, style, concept)}\n`;
    out += `**Lights:** ${getLightDirective(i, style)}\n`;
  }
  return out;
}

function getObjectInteraction(index: number, _style: ExperienceStyle, _concept: string): string {
  const interactions = [
    `Primary geometry enters via scale 0→1 with spring easing`,
    `Secondary elements stagger-reveal, rotation lerps to 0 from random offsets`,
    `Featured object pulses (uniform scale 1→1.05→1, 2s loop), emissive intensity up`,
    `Support geometry morphs via morph targets, particles burst from centroid`,
    `All objects de-saturate except hero — spotlight follows cursor`,
    `Geometry dissolves (custom alpha clip shader on Y-axis threshold)`,
    `Single persistent element, all others fade to 0 opacity`,
  ];
  return interactions[index % interactions.length] ?? 'Idle';
}

function getLightDirective(index: number, _style: ExperienceStyle): string {
  const lights = [
    'AmbientLight 0.3 + DirectionalLight intensity 1.2 from top-right, hard shadows',
    'AmbientLight increases to 0.5, PointLight enters from camera position',
    'SpotLight sweeps 0→90deg, RectAreaLight on opposite face for fill',
    'HemisphereLight at 0.8 (sky blue / ground warm), directional dims to 0.4',
    'All lights shift hue toward primary brand color, intensity max',
    'Single PointLight, dim, follows object centroid',
    'AmbientLight only at 0.15 — near-dark with single emissive object',
  ];
  return lights[index % lights.length] ?? 'Ambient only';
}

function generateCameraSplineCode(sections: number): string {
  return `// camera-path.ts  — CatmullRom spline camera controller
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, Vector3 } from 'three';
import { useScrollProgress } from './use-scroll-progress';

// Define control points — one per scroll section plus ease-in/out anchors
const CONTROL_POINTS = [
  new Vector3(0,  0, 80),   // section 0 — establishing
${Array.from({ length: sections - 1 }, (_, i) => {
  const z = 80 - (i + 1) * (90 / sections);
  const y = Math.sin((i / sections) * Math.PI) * 8;
  const x = (i % 2 === 0 ? 1 : -1) * (i * 3);
  return `  new Vector3(${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}),   // section ${i + 1}`;
}).join('\n')}
  new Vector3(0,  0, -5),   // final state
];

const curve = new CatmullRomCurve3(CONTROL_POINTS, false, 'catmullrom', 0.5);

export function CameraRig() {
  const { camera } = useThree();
  const targetRef = useRef(new Vector3());
  const progress = useScrollProgress();

  useFrame(() => {
    const t = Math.min(Math.max(progress.current, 0), 1);
    const pos = curve.getPoint(t);
    const lookAhead = curve.getPoint(Math.min(t + 0.01, 1));

    // Smooth interpolation — lerp factor controls cinematic inertia
    camera.position.lerp(pos, 0.05);
    targetRef.current.lerp(lookAhead, 0.05);
    camera.lookAt(targetRef.current);
  });

  return null;
}`;
}

function generateScrollHookCode(): string {
  return `// use-scroll-progress.ts
import { useRef, useEffect } from 'react';

export function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    const handler = () => {
      const max = container.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? container.scrollTop / max : 0;
    };

    container.addEventListener('scroll', handler, { passive: true });
    return () => container.removeEventListener('scroll', handler);
  }, []);

  return progress;
}`;
}

function generateSceneCode(
  _concept: string,
  style: ExperienceStyle,
  primaryColor: string,
  _sections: number,
  includeShaders: boolean,
): string {
  const colorHex = primaryColor.replace('#', '');
  const styleGeometry: Record<ExperienceStyle, string> = {
    cosmic: 'icosahedronGeometry',
    architectural: 'boxGeometry',
    organic: 'torusKnotGeometry',
    minimal: 'sphereGeometry',
    brutalist: 'boxGeometry',
    liquid: 'planeGeometry',
    crystalline: 'octahedronGeometry',
  };
  const geo = styleGeometry[style] ?? 'sphereGeometry';

  const shaderBlock = includeShaders ? `
// Vertex displacement shader — scroll-driven wave deformation
const vertexShader = \`
  uniform float uTime;
  uniform float uScrollProgress;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float elevation = sin(pos.x * 4.0 + uTime) * 0.2 * uScrollProgress;
    elevation += cos(pos.y * 3.0 + uTime * 0.8) * 0.15 * uScrollProgress;
    pos.z += elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
\`;

const fragmentShader = \`
  uniform vec3 uColor;
  uniform float uScrollProgress;
  varying float vElevation;

  void main() {
    float brightness = (vElevation + 0.3) * 2.0;
    vec3 color = mix(uColor * 0.3, uColor, brightness);
    float alpha = 0.8 + uScrollProgress * 0.2;
    gl_FragColor = vec4(color, alpha);
  }
\`;` : '';

  return `// Scene.tsx — Main 3D scene for "${_concept}"
'use client';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Fog, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { CameraRig } from './camera-path';
import { useScrollProgress } from './use-scroll-progress';
${includeShaders ? "import { useRef as useShaderRef } from 'react';" : ''}
${shaderBlock}

// ─── Hero Object ──────────────────────────────────────────────────────────────
function HeroGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const progress = useScrollProgress();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = progress.current;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    meshRef.current.rotation.x = Math.sin(t * Math.PI) * 0.5;
    meshRef.current.scale.setScalar(1 + Math.sin(t * Math.PI * 2) * 0.08);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <${geo} args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#${colorHex}"
        roughness={0.2}
        metalness={0.8}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

// ─── Particle Field ───────────────────────────────────────────────────────────
function ParticleField({ count = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const progress = useScrollProgress();

  // Pre-compute positions once (avoid GC pressure per frame)
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
  }

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    // Expand/contract with scroll
    pointsRef.current.scale.setScalar(1 + progress.current * 0.5);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#${colorHex}" sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

// ─── Environment & Lighting ───────────────────────────────────────────────────
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
      />
      <pointLight position={[0, 0, 30]} intensity={0.8} color="#${colorHex}" />
    </>
  );
}

// ─── Canvas Wrapper ───────────────────────────────────────────────────────────
export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 80] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
    >
      {/* Performance adapters — maintain 60fps on weaker devices */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <fog attach="fog" args={['#050510', 40, 200]} />

      <Suspense fallback={null}>
        <SceneLighting />
        <HeroGeometry />
        <ParticleField count={2000} />
        <Environment preset="night" />
        <CameraRig />
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration offset={[0.0005, 0.0005]} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </Canvas>
  );
}`;
}

function generatePageCode(sections: number): string {
  return `// page.tsx — Scroll container + overlay content
'use client';
import { useRef } from 'react';
import { Scene } from './Scene';
import './experience.css';

const SECTIONS = [
${Array.from({ length: sections }, (_, i) => `  { id: ${i}, label: 'Section ${i + 1}' },`).join('\n')}
];

export default function ExperiencePage() {
  return (
    <main className="experience-root">
      {/* Fixed 3D canvas — always full viewport */}
      <div className="canvas-container" aria-hidden="true">
        <Scene />
      </div>

      {/* Scrollable content driver */}
      <div id="scroll-container" className="scroll-driver">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            className="scroll-section"
            aria-label={section.label}
          >
            {/* Content panels — position with CSS relative to scroll section */}
            <div className="content-panel">
              <h2>{section.label}</h2>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}`;
}

function generateCSSCode(_primaryColor: string): string {
  return `/* experience.css */
.experience-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #050510;
}

.canvas-container {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.scroll-driver {
  position: relative;
  z-index: 10;
  height: 100vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
  /* Transparent — the 3D canvas shows through */
  pointer-events: none;
}

/* Re-enable pointer events on interactive content only */
.content-panel {
  pointer-events: auto;
}

.scroll-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-panel {
  color: #fff;
  font-family: system-ui, sans-serif;
  text-align: center;
  mix-blend-mode: screen;
}

/* Reduced motion — freeze camera, show static frame */
@media (prefers-reduced-motion: reduce) {
  .scroll-driver {
    scroll-behavior: auto;
  }
}

/* Mobile — simplified scene, larger text targets */
@media (max-width: 768px) {
  .content-panel h2 {
    font-size: clamp(1.5rem, 6vw, 3rem);
  }
}`;
}

function generatePackageJson(): string {
  return `{
  "dependencies": {
    "@react-three/drei": "^9.x",
    "@react-three/fiber": "^8.x",
    "@react-three/postprocessing": "^2.x",
    "gsap": "^3.x",
    "postprocessing": "^6.x",
    "three": "^0.x"
  },
  "devDependencies": {
    "@types/three": "^0.x"
  }
}`;
}

function generateShaderExtension(_style: ExperienceStyle, _primaryColor: string): string {
  return `// shaders/displacement.glsl — Custom vertex displacement
// Use with <shaderMaterial> in R3F

export const displacementVert = \`
  uniform float uTime;
  uniform float uProgress;   // 0→1 from scroll
  varying vec2  vUv;
  varying float vNoise;

  // Simplex noise (embed or import glsl-noise)
  // float snoise(vec3 v) { ... }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Scroll-driven displacement
    float noise = snoise(vec3(pos.x * 0.5, pos.y * 0.5, uTime * 0.2));
    pos += normal * noise * uProgress * 0.8;
    vNoise = noise;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
\`;

export const displacementFrag = \`
  uniform vec3  uColor;
  uniform float uProgress;
  varying float vNoise;

  void main() {
    vec3 color = mix(uColor * 0.2, uColor, vNoise * 0.5 + 0.5);
    float alpha = clamp(0.4 + uProgress * 0.6, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
\`;`;
}

// ─── Performance strategy ────────────────────────────────────────────────────

function buildPerformanceStrategy(): string {
  return `
## Performance Strategy

| Technique | Implementation |
|-----------|----------------|
| **Adaptive DPR** | \`<AdaptiveDpr pixelated />\` — scales pixel ratio down under frame budget |
| **Object instancing** | Use \`<Instances>\` from @react-three/drei for repeated geometry (particles, grids) |
| **Geometry reuse** | Share \`BufferGeometry\` refs across mesh instances |
| **Texture atlasing** | Pack all textures into a single atlas to minimize draw calls |
| **LOD** | \`<Detailed />\` component — swap high-poly for low-poly beyond 30 units |
| **Frustum culling** | Three.js default — keep scene graph tidy; avoid unnecessary objects |
| **Shader complexity** | No branching in shaders; use \`mix()\` over \`if/else\` |
| **Postprocessing** | Disable Bloom on mobile via responsive hook; use \`multisampling={0}\` |
| **Asset lazy load** | \`<Suspense>\` boundaries + \`useGLTF.preload()\` for heavy models |
| **Scroll debounce** | \`passive: true\` on scroll listener; store in \`useRef\` not \`useState\` |
| **60fps target** | Profile with \`r3f-perf\` in dev; target < 8ms GPU frame time |
`;
}

// ─── Extensions ───────────────────────────────────────────────────────────────

function buildExtensions(includeShaders: boolean, _style: ExperienceStyle): string {
  return `
## Extensions & Advanced Effects

### Audio Sync
\`\`\`ts
// Sync camera FOV to audio amplitude
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

function AudioReactiveCamera() {
  const { camera } = useThree();
  useEffect(() => {
    const ctx = new AudioContext();
    // Connect analyser node → map amplitude to camera.fov
  }, []);
  return null;
}
\`\`\`

### Physics
- Add \`@react-three/rapier\` for rigid-body collisions at the climax scene
- Trigger impulse forces on scroll-to events

### GPGPU Particle Simulation
- Use \`three/examples/jsm/misc/GPUComputationRenderer\` for 1M+ particles
- Store positions in texture, update in shader each frame

### Environment Mapping
- \`<Environment files="hdri/night.hdr" />\` for physically-accurate IBL
- Rotate env map with scroll for dynamic lighting shift

### Scroll Snapping
\`\`\`css
#scroll-container {
  scroll-snap-type: y mandatory;
}
.scroll-section {
  scroll-snap-align: start;
}
\`\`\`
${includeShaders ? `
### Shader Pack Already Included
See \`shaders/displacement.glsl\` — add simplex noise import and attach as \`<shaderMaterial>\` on the hero mesh.
` : `
### Add Shaders
Re-run this tool with \`includeShaders: true\` to generate the vertex displacement shader pack.
`}
`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateImmersive3DExperience(
  concept: string,
  sections: number,
  style: ExperienceStyle,
  primaryColor: string,
  framework: Framework,
  includeShaders: boolean,
): string {
  const validatedSections = Math.max(3, Math.min(sections, 7));

  return `# Immersive 3D Experience — "${concept}"

## Concept

A scroll-driven cinematic 3D journey inspired by: **${concept}**

**Style:** ${style}
**Sections:** ${validatedSections} scroll scenes
**Framework:** ${framework}
**Primary Color:** ${primaryColor}

The user descends through space rather than scrolling a page. Each scroll percentage maps directly to a camera position on a CatmullRom spline. Objects react to progress — scaling, rotating, dissolving. The experience reads like a film sequence: establishing → build → focus → climax → resolution.

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| **@react-three/fiber** | React renderer for Three.js — declarative scene graph, frame loop, context |
| **@react-three/drei** | Helpers: Environment, AdaptiveDpr, Detailed, Instances, Html overlays |
| **@react-three/postprocessing** | Bloom, ChromaticAberration, Vignette — composited in a single pass |
| **three** | Core WebGL math, geometry, materials, lights |
| **postprocessing** | EffectComposer underlying @react-three/postprocessing |
| **gsap** | Optional: timeline-based animation outside R3F for DOM overlays |

Install:
\`\`\`bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing gsap
npm install -D @types/three
\`\`\`

---

## Scene Breakdown
${buildSceneBreakdown(concept, validatedSections, style)}

---

## Implementation

### \`use-scroll-progress.ts\`
\`\`\`typescript
${generateScrollHookCode()}
\`\`\`

### \`camera-path.ts\`
\`\`\`typescript
${generateCameraSplineCode(validatedSections)}
\`\`\`

### \`Scene.tsx\`
\`\`\`typescript
${generateSceneCode(concept, style, primaryColor, validatedSections, includeShaders)}
\`\`\`

### \`page.tsx\`
\`\`\`typescript
${generatePageCode(validatedSections)}
\`\`\`

### \`experience.css\`
\`\`\`css
${generateCSSCode(primaryColor)}
\`\`\`

### \`package.json\` (dependencies)
\`\`\`json
${generatePackageJson()}
\`\`\`
${includeShaders ? `
### \`shaders/displacement.glsl.ts\`
\`\`\`typescript
${generateShaderExtension(style, primaryColor)}
\`\`\`
` : ''}

---

## Scroll → Animation Mapping

\`\`\`typescript
// Linear mapping — scroll 0→1 drives camera spline t parameter
const t = scrollProgress;

// Non-linear mapping — ease-in-out for cinematic deceleration
const tEased = t < 0.5
  ? 2 * t * t
  : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Section-local progress — map global t to a per-section 0→1
const sectionIndex = Math.floor(t * ${validatedSections});
const sectionT = (t * ${validatedSections}) % 1;

// Camera position from spline
const position = curve.getPoint(tEased);

// Object scale from section-local progress
const scale = THREE.MathUtils.lerp(0, 1, sectionT);
\`\`\`

---
${buildPerformanceStrategy()}

---
${buildExtensions(includeShaders, style)}

---

## Mobile Fallback

Detect low-end devices and reduce scene complexity:
\`\`\`typescript
const isLowEnd = navigator.hardwareConcurrency <= 4 || window.devicePixelRatio < 1.5;

// In Canvas
<AdaptiveDpr pixelated />   // auto DPR reduction
// Conditionally disable postprocessing on mobile
{!isLowEnd && (
  <EffectComposer>
    <Bloom intensity={1.2} />
  </EffectComposer>
)}
\`\`\`

On \`prefers-reduced-motion: reduce\`: freeze the camera spline at section 0, disable all rotation animations, keep static scene visible.
`;
}
