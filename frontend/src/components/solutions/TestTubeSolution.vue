# frontend/src/components/solutions/TestTubeSolution.vue

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
let testTube, liquid, bubbles = [], particles;
let animationFrameId = null;
let disposed = false;

const init = () => {
  if (!container.value || !canvas.value) return;

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;
  camera.position.y = 0;
  
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  
  // Enhanced lighting for better liquid visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const mainLight = new THREE.PointLight(0xffffff, 2);
  mainLight.position.set(2, 2, 4);
  scene.add(mainLight);

  const fillLight = new THREE.PointLight(0x66ffff, 2); // Cyan tinted light
  fillLight.position.set(-2, -1, -2);
  scene.add(fillLight);

  const rimLight = new THREE.SpotLight(0x00ffff, 3); // Bright cyan rim light
  rimLight.position.set(-3, 0, -5);
  scene.add(rimLight);
  
  createTestTube();
  createLiquid();
  createParticles();
  createBubbles();
  
  animate();
};

const createTestTube = () => {
  const tubeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 32, 1, true);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95,
    thickness: 0.2,
    transparent: true,
    opacity: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });
  
  testTube = new THREE.Mesh(tubeGeometry, glassMaterial);
  scene.add(testTube);

  // Add rounded bottom
  const bottomGeometry = new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
  bottom.position.y = -1.25;
  scene.add(bottom);
};

const createLiquid = () => {
  // Main liquid body with vibrant cyan color
  const liquidGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2, 32);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff, // Bright cyan base color
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.4,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00ffff, // Cyan glow
    emissiveIntensity: 0.5
  });
  
  liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = -0.2;
  scene.add(liquid);

  // Rounded bottom of liquid
  const bottomLiquidGeometry = new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottomLiquid = new THREE.Mesh(bottomLiquidGeometry, liquidMaterial);
  bottomLiquid.position.y = -1.2;
  scene.add(bottomLiquid);

  // Liquid surface with enhanced glow
  const surfaceGeometry = new THREE.CircleGeometry(0.25, 32);
  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    metalness: 0.3,
    roughness: 0.2,
    transmission: 0.3,
    transparent: true,
    opacity: 0.9,
    emissive: 0x00ffff,
    emissiveIntensity: 0.8
  });
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 0.8;
  scene.add(surface);
};

const createParticles = () => {
  const particleCount = 150;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = Math.random() * 0.2;
    const theta = Math.random() * Math.PI * 2;
    const y = Math.random() * 1.8 - 1;
    
    positions[i] = radius * Math.cos(theta);
    positions[i + 1] = y;
    positions[i + 2] = radius * Math.sin(theta);

    // Brighter particle colors
    colors[i] = 0;     // R
    colors[i + 1] = 1; // G
    colors[i + 2] = 1; // B
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.015,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    depthWrite: false
  });
  
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

const createBubbles = () => {
  const bubbleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const bubbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.4,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5
  });

  for (let i = 0; i < 20; i++) {
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    resetBubble(bubble);
    scene.add(bubble);
    bubbles.push({
      mesh: bubble,
      speed: Math.random() * 0.004 + 0.002,
      offset: Math.random() * Math.PI * 2
    });
  }
};

const resetBubble = (bubble) => {
  const radius = Math.random() * 0.15;
  const theta = Math.random() * Math.PI * 2;
  bubble.position.x = radius * Math.cos(theta);
  bubble.position.y = -1;
  bubble.position.z = radius * Math.sin(theta);
  bubble.scale.setScalar(Math.random() * 0.5 + 0.5);
};

const animate = () => {
  if (disposed) return;
  
  animationFrameId = requestAnimationFrame(animate);
  
  if (testTube && liquid && particles) {
    const time = Date.now() * 0.001;
    
    // Gentle tube rotation
    testTube.rotation.y = Math.sin(time * 0.5) * 0.1;
    
    // Liquid movement
    liquid.rotation.y = Math.sin(time * 0.5) * 0.1;
    liquid.position.y = -0.2 + Math.sin(time) * 0.01;
    
    // Particle animation
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + i) * 0.0005;
      positions[i + 1] += Math.cos(time + i) * 0.001;
      if (positions[i + 1] > 0.8) positions[i + 1] = -1;
      
      const radius = Math.sqrt(
        positions[i] * positions[i] + 
        positions[i + 2] * positions[i + 2]
      );
      
      if (radius > 0.2) {
        const theta = Math.atan2(positions[i + 2], positions[i]);
        positions[i] = Math.cos(theta) * 0.19;
        positions[i + 2] = Math.sin(theta) * 0.19;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Bubble animation
    bubbles.forEach((bubble) => {
      bubble.mesh.position.y += bubble.speed;
      bubble.mesh.position.x += Math.sin(time + bubble.offset) * 0.001;
      bubble.mesh.position.z += Math.cos(time + bubble.offset) * 0.001;

      if (bubble.mesh.position.y > 0.8) {
        resetBubble(bubble.mesh);
      }
    });
  }
  
  renderer?.render(scene, camera);
};

const handleResize = () => {
  if (!container.value || !camera || !renderer) return;
  
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
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
  testTube = null;
  liquid = null;
  particles = null;
  bubbles = [];
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
}
</style>