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
let testTube, freezingMesh;
let crystals = [];
let iceParticles = [];
let disposed = false;
let animationFrameId = null;

const freezeVertexShader = `
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

const freezeFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  float crystalPattern(vec3 p) {
    float pattern = 0.0;
    p *= 2.0; // Scale up the pattern
    
    // Layered noise for crystal structure
    for(float i = 1.0; i < 4.0; i++) {
      float scale = pow(2.0, i);
      pattern += (sin(p.x * scale + time) * sin(p.y * scale + time) * sin(p.z * scale)) / scale;
    }
    return pattern * 0.5 + 0.5;
  }

  float icePattern(vec3 p) {
    return crystalPattern(p) * (0.8 + 0.2 * sin(time * 0.5));
  }

  void main() {
    // Enhanced ice color with slight blue variation
    vec3 baseColor = vec3(0.85, 0.92, 1.0);
    
    // Create crystalline pattern
    float pattern = icePattern(vPosition + time * 0.05);
    vec3 patternColor = mix(baseColor, vec3(1.0), pattern * 0.4);
    
    // Add depth-based coloring
    float depth = clamp((vWorldPosition.z + 1.0) * 0.5, 0.0, 1.0);
    patternColor = mix(patternColor, vec3(0.7, 0.85, 1.0), depth * 0.3);
    
    // Enhanced fresnel effect
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 3.0);
    
    // Height-based effects
    float heightFactor = smoothstep(-1.2, 1.2, vPosition.y);
    float opacity = mix(0.9, 0.6, heightFactor);
    
    // Add frost patterns
    float frost = smoothstep(0.3, 0.7, 
      sin(vPosition.x * 15.0 + time) * 
      sin(vPosition.y * 15.0 + time * 0.5) * 
      sin(vPosition.z * 15.0)
    );
    
    // Combine all effects
    vec3 finalColor = mix(patternColor, vec3(0.9, 0.95, 1.0), frost * 0.15);
    finalColor += vec3(0.8, 0.9, 1.0) * fresnel * 0.3;
    
    gl_FragColor = vec4(finalColor, opacity);
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

  // Enhanced lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  
  const mainLight = new THREE.SpotLight(0xffffff, 2.0);
  mainLight.position.set(3, 3, 5);
  mainLight.angle = Math.PI / 6;
  mainLight.penumbra = 0.3;
  scene.add(mainLight);

  const fillLight = new THREE.PointLight(0xadd8e6, 1.5);
  fillLight.position.set(-3, -2, -2);
  scene.add(fillLight);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const radius = 3;
    const light = new THREE.PointLight(0xadd8e6, 0.8);
    light.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    scene.add(light);
  }

  createTestTube();
  createFreezingEffect();
  createCrystals();
  createIceParticles();
  
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

const createFreezingEffect = () => {
  const geometry = new THREE.CylinderGeometry(0.25, 0.25, 2.3, 32, 32, true);
  const material = new THREE.ShaderMaterial({
    vertexShader: freezeVertexShader,
    fragmentShader: freezeFragmentShader,
    uniforms: {
      time: { value: 0 },
      cameraPosition: { value: camera.position }
    },
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide
  });

  freezingMesh = new THREE.Mesh(geometry, material);
  freezingMesh.position.y = -0.1;
  freezingMesh.renderOrder = 1;
  scene.add(freezingMesh);
};

const createCrystals = () => {
  const createCrystal = (size, position) => {
    const geometry = new THREE.ConeGeometry(size * 0.04, size * 0.15, 6);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.9,
      transparent: true,
      opacity: 0.6,
      depthWrite: true,
      depthTest: true
    });

    const crystal = new THREE.Mesh(geometry, material);
    crystal.position.copy(position);
    crystal.rotation.x = Math.random() * Math.PI;
    crystal.rotation.z = Math.random() * Math.PI;
    crystal.renderOrder = 3;
    
    scene.add(crystal);
    return crystal;
  };

  for (let i = 0; i < 20; i++) {
    const radius = Math.random() * 0.2;
    const angle = Math.random() * Math.PI * 2;
    const height = Math.random() * 2.0 - 1.0;
    
    const position = new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    
    const crystal = createCrystal(Math.random() + 0.5, position);
    crystals.push({
      mesh: crystal,
      initialPosition: position.clone(),
      rotationSpeed: (Math.random() - 0.5) * 0.02
    });
  }
};

const createIceParticles = () => {
  const createParticleSystem = (count, size) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      const radius = Math.random() * 0.2;
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 2.0 - 1.0;
      
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = height;
      positions[i + 2] = Math.sin(angle) * radius;
      
      colors[i] = 0.9;
      colors[i + 1] = 0.95;
      colors[i + 2] = 1.0;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: size,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.renderOrder = 4;
    scene.add(particles);
    iceParticles.push(particles);
  };

  createParticleSystem(100, 0.015);
  createParticleSystem(50, 0.02);
};

const animate = () => {
  if (disposed) return;
  
  animationFrameId = requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;

  if (freezingMesh) {
    freezingMesh.material.uniforms.time.value = time;
    freezingMesh.material.uniforms.cameraPosition.value.copy(camera.position);
    freezingMesh.rotation.y = Math.sin(time * 0.2) * 0.1;
  }

  crystals.forEach(crystal => {
    crystal.mesh.rotation.y += crystal.rotationSpeed;
    const pos = crystal.mesh.position;
    pos.y = crystal.initialPosition.y + Math.sin(time + crystal.initialPosition.x) * 0.05;
  });

  iceParticles.forEach(particles => {
    const positions = particles.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x) + 0.02;
      
      positions[i] = Math.cos(angle) * radius;
      positions[i + 2] = Math.sin(angle) * radius;
      
      positions[i + 1] += Math.sin(time + i) * 0.0005;
      
      if (positions[i + 1] > 0.8) {
        positions[i + 1] = -0.8;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = time * 0.05;
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
  freezingMesh = null;
  crystals = [];
  iceParticles = [];
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