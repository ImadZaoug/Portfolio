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
let testTube, reactionCore;
let reactionParticles = [], energyRings = [];
let disposed = false;
let animationFrameId = null;

const reactionVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const reactionFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  float energyWave(vec3 p) {
    float wave = sin(p.y * 10.0 + time * 2.0) * 
                 sin(p.x * 8.0 + time * 1.5) * 
                 sin(p.z * 6.0 + time);
    
    // Add more detailed wave patterns
    wave += 0.5 * sin(p.y * 20.0 + time * 3.0) * 
                  sin(p.x * 16.0 + time * 2.5) * 
                  sin(p.z * 12.0 + time * 2.0);
    
    return wave;
  }

  float energyField(vec3 p) {
    float field = 0.0;
    float scale = 1.0;
    float intensity = 1.0;
    
    for(int i = 0; i < 3; i++) {
      field += energyWave(p * scale + time * 0.1) * intensity;
      scale *= 2.0;
      intensity *= 0.5;
    }
    
    return field * 0.5 + 0.5;
  }

  void main() {
    // Enhanced dynamic energy colors
    vec3 baseColor = vec3(1.0, 0.3, 0.1);    // Orange-red base
    vec3 pulseColor = vec3(1.0, 0.8, 0.2);   // Yellow pulse
    vec3 glowColor = vec3(1.0, 0.5, 0.15);   // Intense orange glow
    
    // Complex energy field effect
    float energy = energyField(vPosition);
    float heightFactor = smoothstep(-1.2, 1.2, vPosition.y);
    
    // Enhanced pulsing effect
    float mainPulse = sin(time * 3.0) * 0.5 + 0.5;
    float secondaryPulse = sin(time * 5.0 + energy * 4.0) * 0.5 + 0.5;
    float combinedPulse = mix(mainPulse, secondaryPulse, 0.3);
    
    // Mix colors based on energy field and pulses
    vec3 energyColor = mix(baseColor, pulseColor, energy * combinedPulse);
    energyColor = mix(energyColor, glowColor, secondaryPulse * energy);
    
    // Add enhanced edge highlighting
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 3.0);
    energyColor += vec3(1.0, 0.8, 0.4) * fresnel * combinedPulse;
    
    // Dynamic opacity based on height and energy
    float baseOpacity = mix(0.9, 0.6, heightFactor);
    float energyOpacity = energy * 0.3;
    float bottomFade = smoothstep(-1.2, -1.0, vPosition.y);
    
    // Combine all opacity factors
    float finalOpacity = (baseOpacity + energyOpacity + fresnel * 0.2) * bottomFade;
    
    gl_FragColor = vec4(energyColor, finalOpacity);
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const mainLight = new THREE.SpotLight(0xff7700, 2.0);
  mainLight.position.set(3, 3, 5);
  mainLight.angle = Math.PI / 6;
  mainLight.penumbra = 0.3;
  scene.add(mainLight);

  const fillLight = new THREE.PointLight(0xff3300, 1.5);
  fillLight.position.set(-3, -2, -2);
  scene.add(fillLight);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const radius = 3;
    const light = new THREE.PointLight(0xff9900, 0.8);
    light.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    scene.add(light);
  }

  createTestTube();
  createReactionCore();
  createEnergyRings();
  createReactionParticles();
  
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

const createReactionCore = () => {
  const geometry = new THREE.CylinderGeometry(0.25, 0.25, 2.3, 32, 32, true);
  const material = new THREE.ShaderMaterial({
    vertexShader: reactionVertexShader,
    fragmentShader: reactionFragmentShader,
    uniforms: {
      time: { value: 0 },
      cameraPosition: { value: camera.position }
    },
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide
  });

  reactionCore = new THREE.Mesh(geometry, material);
  reactionCore.position.y = -0.1;
  reactionCore.renderOrder = 1;
  scene.add(reactionCore);
};

const createEnergyRings = () => {
  const createRing = () => {
    const geometry = new THREE.TorusGeometry(0.2, 0.01, 16, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const ring = new THREE.Mesh(geometry, material);
    ring.userData = {
      initialScale: 0.1,
      growth: 0.02,
      opacity: 1.0
    };
    ring.renderOrder = 3;
    
    scene.add(ring);
    return ring;
  };

  for (let i = 0; i < 5; i++) {
    energyRings.push(createRing());
  }
};

const createReactionParticles = () => {
  const createParticleSystem = (count, size, speed) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 0.2;
      const theta = Math.random() * Math.PI * 2;
      const y = Math.random() * 2.0 - 1.0;
      
      const index = i * 3;
      positions[index] = Math.cos(theta) * radius;
      positions[index + 1] = y;
      positions[index + 2] = Math.sin(theta) * radius;
      
      colors[index] = 1.0;
      colors[index + 1] = 0.3 + Math.random() * 0.4;
      colors[index + 2] = 0.1;
      
      velocities[index] = (Math.random() - 0.5) * speed;
      velocities[index + 1] = (Math.random() - 0.5) * speed;
      velocities[index + 2] = (Math.random() - 0.5) * speed;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: size,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData.velocities = velocities;
    particles.renderOrder = 4;
    scene.add(particles);
    reactionParticles.push(particles);
  };

  createParticleSystem(200, 0.015, 0.02);
  createParticleSystem(100, 0.02, 0.015);
  createParticleSystem(50, 0.025, 0.01);
};

const animate = () => {
  if (disposed) return;
  
  animationFrameId = requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;

  if (reactionCore) {
    reactionCore.material.uniforms.time.value = time;
    reactionCore.material.uniforms.cameraPosition.value.copy(camera.position);
    reactionCore.rotation.y = Math.sin(time * 0.2) * 0.1;
  }

  // Animate energy rings
  energyRings.forEach((ring, index) => {
    const phaseOffset = index * (Math.PI * 2) / energyRings.length;
    const scale = ring.userData.initialScale + 
                 Math.sin(time * 2.0 + phaseOffset) * 0.5;
    
    ring.scale.set(scale, scale, scale);
    ring.rotation.x = time * 0.5 + phaseOffset;
    ring.rotation.y = time * 0.3 + phaseOffset;
    
    ring.material.opacity = 
      (Math.sin(time * 3.0 + phaseOffset) * 0.5 + 0.5) * 0.6;
  });

  // Animate reaction particles
  reactionParticles.forEach(particles => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.userData.velocities;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Update positions with enhanced motion
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      const radius = Math.sqrt(x * x + z * z);
      if (radius > 0.2) {
        const angle = Math.atan2(z, x);
        positions[i] = Math.cos(angle) * 0.2;
        positions[i + 2] = Math.sin(angle) * 0.2;
        
        // Enhanced velocity reflection
        velocities[i] *= -0.8;
        velocities[i + 2] *= -0.8;
        
        // Add some spin
        const tangentialSpeed = 0.01;
        velocities[i] += -Math.sin(angle) * tangentialSpeed;
        velocities[i + 2] += Math.cos(angle) * tangentialSpeed;
      }
      
      // Enhanced bounce behavior
      if (Math.abs(y) > 1.0) {
        positions[i + 1] = Math.sign(y) * 1.0;
        velocities[i + 1] *= -0.8;
        
        // Add horizontal scatter on bounce
        velocities[i] += (Math.random() - 0.5) * 0.02;
        velocities[i + 2] += (Math.random() - 0.5) * 0.02;
      }
      
      // Add chaotic motion with energy-based fluctuation
      const energyFactor = 1.0 + Math.sin(time * 3.0 + y) * 0.5;
      velocities[i] += (Math.random() - 0.5) * 0.001 * energyFactor;
      velocities[i + 1] += (Math.random() - 0.5) * 0.001 * energyFactor;
      velocities[i + 2] += (Math.random() - 0.5) * 0.001 * energyFactor;
      
      // Apply drag force
      velocities[i] *= 0.99;
      velocities[i + 1] *= 0.99;
      velocities[i + 2] *= 0.99;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = time * 0.1;
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
  testTube = null;
  reactionCore = null;
  reactionParticles = [];
  energyRings = [];
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