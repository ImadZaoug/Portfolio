<template>
  <div ref="container" class="solution-3d-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const container = ref(null);
const canvas = ref(null);
let renderer, scene, camera;
let flask, vortex, particles;
let vortexLines = [];
let disposed = false;
let animationFrameId = null;

// Shader for the vortex effect
const vortexVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const vortexFragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  float turbulence(vec3 p) {
    float t = -0.5;
    for (float f = 1.0; f <= 10.0; f++) {
      float power = pow(2.0, f);
      t += abs(fract(sin(power * p.x + time) * 43758.5453123 +
                    sin(power * p.y + time) * 23421.6312312 +
                    sin(power * p.z + time) * 13246.7654321) / power);
    }
    return t;
  }

  void main() {
    float height = vPosition.y * 0.5 + 0.5;
    vec3 turbColor = color + turbulence(vPosition * 2.0 + time * 0.1) * 0.15;
    
    // Enhanced swirl pattern
    float angle = atan(vPosition.x, vPosition.z);
    float radius = length(vPosition.xz);
    float swirl = sin(angle * 4.0 + time * 2.0 + radius * 5.0);
    turbColor += swirl * 0.1;

    // Smooth bottom transition
    float bottomFade = smoothstep(-1.15, -1.0, vPosition.y);
    float topFade = smoothstep(1.0, 1.15, vPosition.y);
    float verticalFade = (1.0 - topFade) * bottomFade;

    // Dynamic opacity based on height and position
    float baseOpacity = 0.85 * verticalFade;
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    
    // Add subtle glow at the bottom
    float bottomGlow = smoothstep(-1.2, -1.0, vPosition.y) * 0.3;
    vec3 finalColor = turbColor + fresnel * 0.3 + vec3(0.2, 0.4, 1.0) * bottomGlow;
    
    gl_FragColor = vec4(finalColor, baseOpacity + fresnel * 0.15);
  }
`;

const init = () => {
  if (!container.value || !canvas.value) return;

  scene = new THREE.Scene();
  scene.background = null;
  
  camera = new THREE.PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 0.5;
  
  // Enhanced renderer settings
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true
  });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.sortObjects = true;

  // Enhanced lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  
  const mainLight = new THREE.SpotLight(0xffffff, 3.0);
  mainLight.position.set(3, 3, 5);
  mainLight.angle = Math.PI / 6;
  mainLight.penumbra = 0.3;
  scene.add(mainLight);

  const fillLight = new THREE.PointLight(0x3366ff, 2.0);
  fillLight.position.set(-3, -2, -2);
  scene.add(fillLight);

  // Enhanced volumetric lighting
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const radius = 3;
    const light = new THREE.PointLight(0x3366ff, 1.0);
    light.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    scene.add(light);
  }

  createFlask();
  createVortex();
  createVortexLines();
  createParticles();
  
  animate();
};

const createFlask = () => {
  const tubeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 32, 1, true);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95,
    thickness: 0.02,
    transparent: true,
    opacity: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    depthWrite: false,
    depthTest: true
  });
  
  flask = new THREE.Mesh(tubeGeometry, glassMaterial);
  flask.renderOrder = 2;
  scene.add(flask);

  const bottomGeometry = new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
  bottom.position.y = -1.25;
  bottom.renderOrder = 2;
  scene.add(bottom);
};

const createVortex = () => {
  const geometry = new THREE.CylinderGeometry(0.25, 0.25, 2.3, 32, 32, true);
  const material = new THREE.ShaderMaterial({
    vertexShader: vortexVertexShader,
    fragmentShader: vortexFragmentShader,
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x3366ff) }
    },
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  vortex = new THREE.Mesh(geometry, material);
  vortex.position.y = -0.1;
  vortex.renderOrder = 1;
  scene.add(vortex);
  
  const bottomGeometry = new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottomMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x3366ff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.3,
    transparent: true,
    opacity: 0.8,
    emissive: 0x3366ff,
    emissiveIntensity: 0.5,
    depthWrite: true,
    depthTest: true
  });
  const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.position.y = -1.2;
  bottom.renderOrder = 1;
  scene.add(bottom);
};

const createVortexLines = () => {
  const lineCount = 8;
  const pointsPerLine = 100;
  
  for (let i = 0; i < lineCount; i++) {
    const points = [];
    const angleOffset = (i / lineCount) * Math.PI * 2;
    
    for (let j = 0; j < pointsPerLine; j++) {
      const t = j / (pointsPerLine - 1);
      const radius = 0.2;
      const angle = angleOffset + t * Math.PI * 6;
      const x = Math.cos(angle) * radius;
      const y = -1.1 + t * 2.2;
      const z = Math.sin(angle) * radius;
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x3366ff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 3;
    scene.add(line);
    vortexLines.push(line);
  }
};

const createParticles = () => {
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radiusBase = Math.random() * 0.2;
    const height = Math.random() * 2.0 - 1.0;
    
    positions[i * 3] = Math.cos(angle) * radiusBase;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radiusBase;
    
    colors[i * 3] = 0.2;
    colors[i * 3 + 1] = 0.4;
    colors[i * 3 + 2] = 1.0;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  particles = new THREE.Points(geometry, material);
  particles.renderOrder = 4;
  scene.add(particles);
};

const animate = () => {
  if (disposed) return;
  
  animationFrameId = requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;

  if (vortex) {
    vortex.material.uniforms.time.value = time;
    vortex.rotation.y = time * 0.2;
  }

  if (particles) {
    particles.rotation.y = time * 0.2;
    
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      
      const heightFactor = (y + 1.15) / 2.3;
      const speed = 0.5 + heightFactor * 2;
      const newAngle = angle + speed * 0.02;
      
      positions[i] = Math.cos(newAngle) * radius;
      positions[i + 2] = Math.sin(newAngle) * radius;
      
      positions[i + 1] -= 0.005;
      
      if (positions[i + 1] < -1.15) {
        positions[i + 1] = 1.15;
        const newRadius = 0.18 + Math.random() * 0.1;
        const randomAngle = Math.random() * Math.PI * 2;
        positions[i] = Math.cos(randomAngle) * newRadius;
        positions[i + 2] = Math.sin(randomAngle) * newRadius;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
  }

  vortexLines.forEach(line => {
    line.rotation.y = time * 0.2;
    const points = line.geometry.attributes.position.array;
    for (let i = 0; i < points.length; i += 3) {
      const t = (i / points.length) * Math.PI * 2;
      points[i + 1] += Math.sin(t + time) * 0.001;
    }
    line.geometry.attributes.position.needsUpdate = true;
  });
  
  renderer?.render(scene, camera);
};

const handleResize = () => {
  if (!container.value || !camera || !renderer) return;
  
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const cleanup = () => {
  disposed = true;
  cancelAnimationFrame(animationFrameId);
  
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer = null;
  }
  
  if (scene) {
    scene.traverse(object => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    scene = null;
  }
  
  camera = null;
  flask = null;
  vortex = null;
  particles = null;
  vortexLines = [];
};

onMounted(() => {
  init();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  cleanup();
});
</script>

<style scoped>
.solution-3d-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  outline: none;
  background: transparent;
}
</style>