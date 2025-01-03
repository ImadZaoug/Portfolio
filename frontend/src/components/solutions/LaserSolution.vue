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
  let testTube, laserCore;
  let laserBeam, energyField;
  let laserParticles = [];
  let disposed = false;
  let animationFrameId = null;
  
  // Shader for the laser beam effect
  const laserVertexShader = `
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
  
  const laserFragmentShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
  
    float laserPattern(vec3 p) {
      float beam = abs(p.x) + abs(p.z);
      beam = smoothstep(0.0, 0.15, 0.15 - beam);
      
      float pulse = sin(p.y * 20.0 + time * 5.0) * 0.5 + 0.5;
      beam *= 0.8 + pulse * 0.2;
      
      float noise = fract(sin(dot(p.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      beam *= 0.9 + noise * 0.1;
      
      return beam;
    }
  
    void main() {
      vec3 baseColor = vec3(0.0, 1.0, 1.0);
      float pattern = laserPattern(vPosition);
      float colorPulse = sin(time * 3.0) * 0.5 + 0.5;
      vec3 pulseColor = mix(baseColor, vec3(0.5, 1.0, 1.0), colorPulse);
      vec3 finalColor = pulseColor * pattern;
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      finalColor += baseColor * fresnel * pattern;
      
      float alpha = pattern * (0.6 + fresnel * 0.4);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;
  
  const init = () => {
    if (!container.value || !canvas.value) return;
  
    // Scene setup
    scene = new THREE.Scene();
    scene.background = null;
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
      45,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 0.5;
    
    // Renderer setup
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
  
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.SpotLight(0x00ffff, 2.0);
    mainLight.position.set(3, 3, 5);
    mainLight.angle = Math.PI / 6;
    mainLight.penumbra = 0.3;
    scene.add(mainLight);
  
    const fillLight = new THREE.PointLight(0x00ffff, 1.5);
    fillLight.position.set(-3, -2, -2);
    scene.add(fillLight);
  
    // Add accent lights
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 3;
      const light = new THREE.PointLight(0x00ffff, 1.0);
      light.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
      scene.add(light);
    }
  
    // Create objects
    createTestTube();
    createLaserCore();
    createLaserBeam();
    createEnergyField();
    createLaserParticles();
    
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
  
  const createLaserCore = () => {
    const geometry = new THREE.CylinderGeometry(0.25, 0.25, 2.3, 32, 32, true);
    const material = new THREE.ShaderMaterial({
      vertexShader: laserVertexShader,
      fragmentShader: laserFragmentShader,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
  
    laserCore = new THREE.Mesh(geometry, material);
    laserCore.position.y = -0.1;
    laserCore.renderOrder = 1;
    scene.add(laserCore);
  
    const bottomGeometry = new THREE.SphereGeometry(0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const bottomMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      metalness: 0.3,
      roughness: 0.2,
      transmission: 0.4,
      transparent: true,
      opacity: 0.8,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
      depthWrite: true,
      depthTest: true
    });
    const coreBottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
    coreBottom.position.y = -1.2;
    coreBottom.renderOrder = 1;
    scene.add(coreBottom);
  };
  
  const createLaserBeam = () => {
    const beamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2.3, 8, 1);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    laserBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    laserBeam.position.y = -0.1;
    laserBeam.renderOrder = 3;
    scene.add(laserBeam);
  };
  
  const createEnergyField = () => {
    const fieldGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.3, 16, 1, true);
    const fieldMaterial = new THREE.ShaderMaterial({
      vertexShader: laserVertexShader,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float energy = abs(sin(vPosition.y * 20.0 + time * 3.0));
          energy *= (1.0 - abs(vPosition.y));
          vec3 color = vec3(0.0, 1.0, 1.0) * energy;
          float alpha = energy * 0.3;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    
    energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    energyField.position.y = -0.1;
    energyField.renderOrder = 3;
    scene.add(energyField);
  };
  
  const createLaserParticles = () => {
    const createParticleSystem = (count, size, radius) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        const y = Math.random() * 2.0 - 1.0;
        
        const index = i * 3;
        positions[index] = Math.cos(theta) * r;
        positions[index + 1] = y;
        positions[index + 2] = Math.sin(theta) * r;
        
        colors[index] = 0.0;
        colors[index + 1] = 1.0;
        colors[index + 2] = 1.0;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const particles = new THREE.Points(geometry, material);
      particles.renderOrder = 4;
      scene.add(particles);
      laserParticles.push(particles);
    };
  
    createParticleSystem(300, 0.01, 0.05);
    createParticleSystem(200, 0.015, 0.1);
    createParticleSystem(100, 0.02, 0.15);
  };
  
  const animate = () => {
    if (disposed) return;
    
    animationFrameId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
  
    if (laserCore) {
      laserCore.material.uniforms.time.value = time;
    }
  
    if (energyField) {
      energyField.material.uniforms.time.value = time;
      energyField.rotation.y = time * 0.5;
    }
  
    if (laserBeam) {
      laserBeam.material.opacity = 0.6 + Math.sin(time * 5) * 0.2;
    }
  
    laserParticles.forEach((particles, index) => {
      const positions = particles.geometry.attributes.position.array;
      const speed = 0.5 + index * 0.5;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        const radius = Math.sqrt(x * x + z * z);
        const angle = Math.atan2(z, x) + (0.02 * speed);
        
        positions[i] = Math.cos(angle) * radius;
        positions[i + 2] = Math.sin(angle) * radius;
        
        positions[i + 1] += 0.01 * speed;
        if (positions[i + 1] > 1.0) {
          positions[i + 1] = -1.0;
        }
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
    laserCore = null;
    laserBeam = null;
    energyField = null;
    laserParticles = [];
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