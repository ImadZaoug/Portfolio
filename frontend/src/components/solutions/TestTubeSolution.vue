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
let liquidGlow = [];
let animationFrameId = null;
let disposed = false;

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
  camera.position.z = 4;
  camera.position.y = 0;
  
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

  // Enhanced lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  
  const mainLight = new THREE.SpotLight(0xffffff, 6.0);
  mainLight.position.set(3, 3, 5);
  mainLight.angle = Math.PI / 6;
  mainLight.penumbra = 0.3;
  scene.add(mainLight);

  const rimLight = new THREE.SpotLight(0x00ff00, 8.0);
  rimLight.position.set(-3, 0, -5);
  rimLight.angle = Math.PI / 4;
  rimLight.penumbra = 0.5;
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x00ff00, 4.0);
  fillLight.position.set(-2, -3, -2);
  scene.add(fillLight);
  
  const topLight = new THREE.PointLight(0x00ff00, 3.0);
  topLight.position.set(0, 5, 0);
  scene.add(topLight);

  // Enhanced volumetric lighting
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 3;
    const height = Math.sin(i * 0.8) * 2;
    
    const pointLight = new THREE.PointLight(0x00ff00, 1.5);
    pointLight.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    scene.add(pointLight);
  }
  
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
    thickness: 0.02,
    transparent: true,
    opacity: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    depthWrite: false,
    depthTest: true
  });
  
  testTube = new THREE.Mesh(tubeGeometry, glassMaterial);
  testTube.renderOrder = 2;
  scene.add(testTube);

  const bottomGeometry = new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bottom = new THREE.Mesh(bottomGeometry, glassMaterial);
  bottom.position.y = -1.25;
  bottom.renderOrder = 2;
  scene.add(bottom);
};

const createLiquid = () => {
  // Main liquid body with enhanced material
  const liquidGeometry = new THREE.CylinderGeometry(0.22, 0.22, 1.9, 32);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x00ff00).multiplyScalar(2),
    emissive: new THREE.Color(0x00ff00).multiplyScalar(1.5),
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.8,
    transparent: true,
    opacity: 0.9,
    depthWrite: true,
    depthTest: true
  });
  
  liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = -0.2;
  liquid.renderOrder = 1;
  scene.add(liquid);

  // Enhanced inner glow system
  const createGlowLayer = (radius, height, intensity, opacity) => {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x00ff00).multiplyScalar(intensity),
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.2;
    mesh.renderOrder = 1;
    scene.add(mesh);
    return mesh;
  };

  // Create multiple glow layers
  liquidGlow = [];
  for (let i = 0; i < 5; i++) {
    const radius = 0.15 + i * 0.015;
    const height = 1.8 + i * 0.02;
    const intensity = 2 - i * 0.3;
    const opacity = 0.4 - i * 0.06;
    
    const glow = createGlowLayer(radius, height, intensity, opacity);
    liquidGlow.push(glow);
  }

  // Enhanced liquid surface with fresnel effect
  const surfaceGeometry = new THREE.CircleGeometry(0.22, 32);
  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x00ff00).multiplyScalar(2),
    emissive: new THREE.Color(0x00ff00).multiplyScalar(1.5),
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 0.8;
  surface.renderOrder = 1;
  scene.add(surface);
};

const createParticles = () => {
  const particleCount = 200; // Increased particle count
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 0.2;
    const theta = Math.random() * Math.PI * 2;
    const y = Math.random() * 1.8 - 1;
    
    const index = i * 3;
    positions[index] = radius * Math.cos(theta);
    positions[index + 1] = y;
    positions[index + 2] = radius * Math.sin(theta);

    colors[index] = 0;
    colors[index + 1] = 1;
    colors[index + 2] = 0;
    
    sizes[i] = Math.random() * 0.01 + 0.005;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    size: 0.015,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    depthWrite: false,
    sizeAttenuation: true
  });
  
  particles = new THREE.Points(geometry, material);
  particles.renderOrder = 3;
  scene.add(particles);
};

const createBubbles = () => {
  const bubbleGeometry = new THREE.SphereGeometry(0.02, 12, 12); // Increased segments
  const bubbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.95,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    depthTest: true
  });

  for (let i = 0; i < 25; i++) { // Increased bubble count
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    resetBubble(bubble);
    bubble.renderOrder = 4;
    scene.add(bubble);
    bubbles.push({
      mesh: bubble,
      speed: Math.random() * 0.004 + 0.002,
      offset: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 2 + 1
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
  
  const time = Date.now() * 0.001;

  if (testTube && liquid && particles) {
    const rotation = Math.sin(time * 0.5) * 0.1;
    testTube.rotation.y = rotation;
    liquid.rotation.y = rotation;
    
    // Animate liquid and glow
    const liquidOffset = Math.sin(time) * 0.01;
    liquid.position.y = -0.2 + liquidOffset;
    liquidGlow.forEach((glow, index) => {
      glow.rotation.y = rotation + Math.sin(time * 0.3 + index * 0.2) * 0.05;
      glow.position.y = -0.2 + liquidOffset + Math.sin(time * 0.8 + index) * 0.005;
      glow.material.opacity = (0.4 - index * 0.06) * (0.8 + Math.sin(time * 2 + index) * 0.2);
    });

    // Enhanced particle animation
    const positions = particles.geometry.attributes.position.array;
    const sizes = particles.geometry.attributes.size.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Spiral motion
      const x = positions[i];
      const z = positions[i + 2];
      const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x) + 0.02;
      
      positions[i] = Math.cos(angle) * radius;
      positions[i + 2] = Math.sin(angle) * radius;
      
      // Vertical motion with varying speed
      positions[i + 1] += (0.002 + Math.sin(time + i) * 0.001);
      if (positions[i + 1] > 0.8) positions[i + 1] = -1;

      // Size pulsing
      const sizeIndex = i / 3;
      sizes[sizeIndex] = (Math.sin(time * 2 + sizeIndex) * 0.3 + 0.7) * 
                        (Math.random() * 0.01 + 0.005);

      // Contain particles
      if (radius > 0.19) {
        const theta = Math.atan2(z, x);
        positions[i] = Math.cos(theta) * 0.19;
        positions[i + 2] = Math.sin(theta) * 0.19;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.size.needsUpdate = true;

    // Enhanced bubble animation
    bubbles.forEach((bubble) => {
      bubble.mesh.position.y += bubble.speed;
      
      // Add wobble motion
      const wobble = Math.sin(time * bubble.wobbleSpeed + bubble.offset);
      bubble.mesh.position.x += Math.sin(time + bubble.offset) * 0.001 * wobble;
      bubble.mesh.position.z += Math.cos(time + bubble.offset) * 0.001 * wobble;
      
      // Scale variation
      bubble.mesh.scale.setScalar(
        (bubble.mesh.scale.x + Math.sin(time * 3 + bubble.offset) * 0.1)
        * (0.5 + Math.random() * 0.5)
      );

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
  liquidGlow = [];
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