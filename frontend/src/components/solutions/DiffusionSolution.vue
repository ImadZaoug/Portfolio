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
let testTube, diffusionMesh;
let particleSystems = [];
let disposed = false;
let animationFrameId = null;

const diffusionVertexShader = `
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

const diffusionFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  // Existing noise functions remain the same
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // Enhanced color mixing based on 3D noise
    float n1 = snoise(vec3(vPosition * 3.0 + time * 0.2)) * 0.5 + 0.5;
    float n2 = snoise(vec3(vPosition * 2.0 - vec3(100.0) + time * 0.15)) * 0.5 + 0.5;
    float n3 = snoise(vec3(vPosition * 4.0 + vec3(-100.0) + time * 0.1)) * 0.5 + 0.5;

    // Improved color mixing
    vec3 mixColor1 = mix(color1, color2, n1);
    vec3 mixColor2 = mix(mixColor1, color3, n2 * n3);

    // Add dynamic swirl effect
    float swirl = snoise(vec3(
      vPosition.x * 2.0 + time * 0.3,
      vPosition.y * 2.0,
      vPosition.z * 2.0 + time * 0.2
    )) * 0.5 + 0.5;
    
    mixColor2 *= 1.0 + swirl * 0.3;

    // Enhanced edge highlighting with fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 3.0);
    
    // Smooth height-based transitions
    float heightFactor = smoothstep(-1.2, 1.2, vPosition.y);
    float opacity = mix(0.85, 0.6, heightFactor);
    
    // Add bottom fade effect
    float bottomFade = smoothstep(-1.2, -1.0, vPosition.y);
    opacity *= bottomFade;

    // Combine all effects
    vec3 finalColor = mixColor2 + fresnel * 0.3;
    finalColor += mix(color1, color2, fresnel) * 0.2;
    
    gl_FragColor = vec4(finalColor, opacity + fresnel * 0.15);
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  
  const mainLight = new THREE.SpotLight(0xffffff, 2.0);
  mainLight.position.set(3, 3, 5);
  mainLight.angle = Math.PI / 6;
  mainLight.penumbra = 0.3;
  scene.add(mainLight);

  const fillLight = new THREE.PointLight(0x6699ff, 1.5);
  fillLight.position.set(-3, -2, -2);
  scene.add(fillLight);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const radius = 3;
    const light = new THREE.PointLight(0x6699ff, 0.8);
    light.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    scene.add(light);
  }

  createTestTube();
  createDiffusionEffect();
  createParticles();
  
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

const createDiffusionEffect = () => {
  const geometry = new THREE.CylinderGeometry(0.25, 0.25, 2.3, 32, 32, true);
  const material = new THREE.ShaderMaterial({
    vertexShader: diffusionVertexShader,
    fragmentShader: diffusionFragmentShader,
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x6600ff) },
      color2: { value: new THREE.Color(0x00ffcc) },
      color3: { value: new THREE.Color(0x66ff33) },
      cameraPosition: { value: camera.position }
    },
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide
  });

  diffusionMesh = new THREE.Mesh(geometry, material);
  diffusionMesh.position.y = -0.1;
  diffusionMesh.renderOrder = 1;
  scene.add(diffusionMesh);
};

const createParticles = () => {
  const createParticleSystem = (count, size, speed) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      const radius = Math.random() * 0.2;
      const theta = Math.random() * Math.PI * 2;
      const y = Math.random() * 2.0 - 1.0;
      
      positions[i] = radius * Math.cos(theta);
      positions[i + 1] = y;
      positions[i + 2] = radius * Math.sin(theta);
      
      colors[i] = 0.4 + Math.random() * 0.6;
      colors[i + 1] = 0.4 + Math.random() * 0.6;
      colors[i + 2] = 0.8 + Math.random() * 0.2;
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
    particles.userData.speed = speed;
    particles.renderOrder = 3;
    scene.add(particles);
    particleSystems.push(particles);
  };

  createParticleSystem(100, 0.015, 1.0);
  createParticleSystem(50, 0.02, 0.7);
  createParticleSystem(25, 0.025, 0.5);
};

const animate = () => {
  if (disposed) return;
  
  animationFrameId = requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;

  if (diffusionMesh) {
    diffusionMesh.material.uniforms.time.value = time;
    diffusionMesh.material.uniforms.cameraPosition.value.copy(camera.position);
    diffusionMesh.rotation.y = Math.sin(time * 0.2) * 0.1;
  }

  particleSystems.forEach(particles => {
    const positions = particles.geometry.attributes.position.array;
    const speed = particles.userData.speed;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Enhanced spiral motion
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Calculate current radius and angle
      const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      
      // Add varying speeds based on height
      const heightFactor = (y + 1.0) / 2.0;
      const rotationSpeed = (0.02 + heightFactor * 0.03) * speed;
      
      // Update position with spiral motion
      const newAngle = angle + rotationSpeed;
      positions[i] = Math.cos(newAngle) * radius;
      positions[i + 2] = Math.sin(newAngle) * radius;
      
      // Add vertical motion
      positions[i + 1] += (Math.sin(time * 2 + radius * 5) * 0.001 * speed);
      
      // Keep particles within bounds
      if (positions[i + 1] > 1.0) {
        positions[i + 1] = -1.0;
        // Randomize horizontal position when respawning
        const newRadius = Math.random() * 0.2;
        const newAngle = Math.random() * Math.PI * 2;
        positions[i] = Math.cos(newAngle) * newRadius;
        positions[i + 2] = Math.sin(newAngle) * newRadius;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = time * 0.1 * speed;
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
  diffusionMesh = null;
  particleSystems = [];
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