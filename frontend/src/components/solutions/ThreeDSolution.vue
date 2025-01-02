# frontend/src/components/solutions/ThreeDSolution.vue
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
let jar, liquid, bubbles = [], particles;
let animationFrameId = null;
let disposed = false;

const init = () => {
  if (!container.value || !canvas.value) return;

  // Scene setup
  scene = new THREE.Scene();
  
  // Camera setup
  camera = new THREE.PerspectiveCamera(
    45,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;
  camera.position.y = 0.5;
  
  // Enhanced renderer setup
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
  
  // Enhanced lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0xffffff, 1.5);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x0088ff, 1);
  pointLight2.position.set(-5, -5, -5);
  scene.add(pointLight2);

  const rimLight = new THREE.SpotLight(0x0088ff, 2);
  rimLight.position.set(0, 3, -5);
  scene.add(rimLight);
  
  createJar();
  createLiquid();
  createParticles();
  createBubbles();
  
  animate();
};

const createJar = () => {
  const jarGeometry = new THREE.CylinderGeometry(0.7, 0.7, 2, 32, 1, true);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95,
    thickness: 0.5,
    transparent: true,
    opacity: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });
  
  jar = new THREE.Mesh(jarGeometry, glassMaterial);
  scene.add(jar);

  // Add jar neck
  const neckGeometry = new THREE.CylinderGeometry(0.4, 0.6, 0.4, 32);
  const neck = new THREE.Mesh(neckGeometry, glassMaterial);
  neck.position.y = 1.2;
  scene.add(neck);
  
  // Add jar cap
  const capGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 32);
  const capMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1
  });
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = 1.5;
  scene.add(cap);

  // Add bottom
  const bottomGeometry = new THREE.CircleGeometry(0.7, 32);
  const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = -1;
  scene.add(bottom);
};

const createLiquid = () => {
  // Main liquid body
  const liquidGeometry = new THREE.CylinderGeometry(0.65, 0.65, 1.8, 32);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00aaff,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.6,
    transparent: true,
    opacity: 0.8,
    emissive: 0x0044ff,
    emissiveIntensity: 0.2
  });
  
  liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = -0.6;
  scene.add(liquid);

  // Liquid surface
  const surfaceGeometry = new THREE.CircleGeometry(0.65, 32);
  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00aaff,
    metalness: 0.3,
    roughness: 0.2,
    transmission: 0.5,
    transparent: true,
    opacity: 0.9
  });
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 0.3;
  scene.add(surface);
};

const createParticles = () => {
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = Math.random() * 0.5;
    const theta = Math.random() * Math.PI * 2;
    const y = Math.random() * 1.6 - 0.8;
    
    positions[i] = radius * Math.cos(theta);
    positions[i + 1] = y;
    positions[i + 2] = radius * Math.sin(theta);

    colors[i] = 0;
    colors[i + 1] = 0.7 + Math.random() * 0.3;
    colors[i + 2] = 1;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    depthWrite: false
  });
  
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

const createBubbles = () => {
  const bubbleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
  const bubbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.3
  });

  for (let i = 0; i < 30; i++) {
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
  const radius = Math.random() * 0.4;
  const theta = Math.random() * Math.PI * 2;
  bubble.position.x = radius * Math.cos(theta);
  bubble.position.y = -0.8;
  bubble.position.z = radius * Math.sin(theta);
  bubble.scale.setScalar(Math.random() * 0.5 + 0.5);
};

const animate = () => {
  if (disposed) return;
  
  animationFrameId = requestAnimationFrame(animate);
  
  if (jar && liquid && particles) {
    const time = Date.now() * 0.001;
    
    // Gentle jar rotation
    jar.rotation.y = Math.sin(time * 0.5) * 0.1;
    
    // Liquid movement
    liquid.rotation.y = Math.sin(time * 0.5) * 0.1;
    liquid.position.y = -0.6 + Math.sin(time) * 0.02;
    
    // Particle animation
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + i) * 0.001;
      positions[i + 1] += Math.cos(time + i) * 0.001;
      positions[i + 2] += Math.sin(time + i) * 0.001;
      
      // Keep particles within bounds
      const radius = Math.sqrt(
        positions[i] * positions[i] + 
        positions[i + 2] * positions[i + 2]
      );
      
      if (radius > 0.5 || positions[i + 1] > 0.3 || positions[i + 1] < -0.8) {
        const theta = Math.random() * Math.PI * 2;
        positions[i] = Math.cos(theta) * 0.4;
        positions[i + 1] = Math.random() * 1.1 - 0.8;
        positions[i + 2] = Math.sin(theta) * 0.4;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Bubble animation
    bubbles.forEach((bubble) => {
      bubble.mesh.position.y += bubble.speed;
      bubble.mesh.position.x += Math.sin(time + bubble.offset) * 0.002;
      bubble.mesh.position.z += Math.cos(time + bubble.offset) * 0.002;

      if (bubble.mesh.position.y > 0.3) {
        resetBubble(bubble.mesh);
      }
    });
  }
  
  renderer?.render(scene, camera);
};

// Rest of the code (handleResize, cleanup, etc.) remains the same...
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
  jar = null;
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