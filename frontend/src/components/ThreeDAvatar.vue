<template>
    <div class="avatar-container">
      <canvas ref="canvas" />
      <div v-if="!loaded" class="loading">Loading avatar...</div>
      <button 
        @click="handleThemeToggle" 
        class="theme-toggle" 
        :class="{ 'dark': isDarkTheme }" 
        :disabled="isTransitioning"
      >
        {{ isDarkTheme ? 'Light Mode' : 'Dark Mode' }}
      </button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
  import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  
  export default {
    name: 'ThreeDAvatar',
    props: {
      currentSection: {
        type: Number,
        default: 0
      }
    },
    setup(props) {
      const canvas = ref(null)
      const loaded = ref(false)
      const isDarkTheme = ref(false)
      const isTransitioning = ref(false)
      let scene, camera, renderer, model, mixer, controls
      let currentAnimation = null
      const clock = new THREE.Clock()
      const animations = {}
  
      const createLightningPath = (startX, startY, width, intensity = 1) => {
          const path = [];
          let x = startX;
          let y = startY;
          path.push(`M ${x} ${y}`);
  
          // More dynamic segments for lightning effect
          const numSegments = Math.floor(Math.random() * 5) + 4;
          const baseAngle = Math.random() * 360; // Random base direction
          
          for (let i = 0; i < numSegments; i++) {
              // Sharper angles for lightning effect
              const angleVariation = (Math.random() * 60 - 30) * intensity;
              const angle = (baseAngle + angleVariation) * (Math.PI / 180);
              
              // Variable segment lengths
              const segmentLength = (width / numSegments) * (0.3 + Math.random() * 0.7) * intensity;
              
              // Add slight curve control points for more natural look
              const ctrl1X = x + Math.cos(angle) * (segmentLength * 0.33);
              const ctrl1Y = y + Math.sin(angle) * (segmentLength * 0.33);
              
              x += Math.cos(angle) * segmentLength;
              y += Math.sin(angle) * segmentLength;
              
              // Mix of curves and lines for varied appearance
              if (Math.random() > 0.7) {
                  path.push(`Q ${ctrl1X} ${ctrl1Y} ${x} ${y}`);
              } else {
                  path.push(`L ${x} ${y}`);
              }
          }
          
          return path.join(' ');
      }
  
      const createBranchingCrack = (startX, startY, width) => {
          const paths = [];
          const mainPath = createLightningPath(startX, startY, width, 1);
          paths.push({ path: mainPath, class: 'active' });
          
          // Dynamic branching based on width
          const numBranches = Math.floor(Math.random() * 3) + (width > 100 ? 2 : 1);
          
          for (let i = 0; i < numBranches; i++) {
              const branchStartX = startX + width * (Math.random() * 0.4);
              const branchStartY = startY + width * (Math.random() * 0.4 - 0.2);
              const branchWidth = width * (0.3 + Math.random() * 0.3);
              const branchPath = createLightningPath(branchStartX, branchStartY, branchWidth, 0.7);
              paths.push({ path: branchPath, class: 'branch' });
              
              // Add sub-branches for larger cracks
              if (width > 150 && Math.random() > 0.5) {
                  const subBranchX = branchStartX + branchWidth * (Math.random() * 0.3);
                  const subBranchY = branchStartY + branchWidth * (Math.random() * 0.3 - 0.15);
                  const subBranchPath = createLightningPath(subBranchX, subBranchY, branchWidth * 0.5, 0.5);
                  paths.push({ path: subBranchPath, class: 'branch' });
              }
          }
          
          return paths;
      }
  
      const handleThemeToggle = () => {
          if (isTransitioning.value) return;
          isTransitioning.value = true;
  
          // Play petting animation when toggling theme
          playAnimation('petting', 0.5);
  
          // Create transition container
          let container = document.querySelector('.theme-transition-container');
          if (!container) {
              container = document.createElement('div');
              container.className = 'theme-transition-container';
              document.body.appendChild(container);
          }
  
          // Create grid system
          const boxSize = 40; // Smaller boxes for more detailed cracks
          const cols = Math.ceil(window.innerWidth / boxSize);
          const rows = Math.ceil(window.innerHeight / boxSize);
          const totalBoxes = cols * rows;
          
          // Create SVG container
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.style.position = 'absolute';
          svg.style.top = '0';
          svg.style.left = '0';
          svg.style.pointerEvents = 'none';
          container.appendChild(svg);
  
          // Add trembling effect
          document.body.classList.add('theme-transition-trembling');
  
          // Phase 1: Initial cracks (0-2.25s)
          const maxInitialCoverage = Math.floor(totalBoxes * 0.3); // 30% max coverage
          let coveredBoxes = new Set();
          
          // Generate initial cracks
          const numInitialCracks = Math.floor(totalBoxes * 0.1); // 10% initial points
          
          for (let i = 0; i < numInitialCracks && coveredBoxes.size < maxInitialCoverage; i++) {
              const startTime = Math.random() * 2000; // Random start within first 2s
              setTimeout(() => {
                  if (coveredBoxes.size >= maxInitialCoverage) return;
                  const box = Math.floor(Math.random() * totalBoxes);
                  if (!coveredBoxes.has(box)) {
                      const col = box % cols;
                      const row = Math.floor(box / cols);
                      const x = col * boxSize;
                      const y = row * boxSize;
  
                      const crackPaths = createBranchingCrack(x, y, boxSize * 2);
                      crackPaths.forEach(({ path: pathData, class: pathClass }) => {
                          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                          path.setAttribute('d', pathData);
                          path.setAttribute('stroke', 'var(--crack-color)');
                          path.setAttribute('fill', 'none');
                          path.setAttribute('stroke-width', '2');
                          path.classList.add(pathClass);
                          
                          const length = path.getTotalLength();
                          path.style.strokeDasharray = length;
                          path.style.strokeDashoffset = length;
                          
                          svg.appendChild(path);
                          
                          // Animate crack drawing
                          setTimeout(() => {
                              path.style.strokeDashoffset = '0';
                          }, 50);
  
                          // Track covered boxes
                          coveredBoxes.add(box);
                      });
                  }
              }, startTime);
          }
  
          // Phase 2: Rapid spread (2.25s - 2.85s)
          setTimeout(() => {
              const remainingForPhase2 = Math.floor(totalBoxes * 0.6); // Spread to 90%
              const rapidSpreadDuration = 600; // 0.6s for rapid spread
              const intervalDelay = rapidSpreadDuration / remainingForPhase2;
  
              let spreadCount = 0;
              const spreadInterval = setInterval(() => {
                  if (spreadCount >= remainingForPhase2) {
                      clearInterval(spreadInterval);
                      return;
                  }
  
                  const x = Math.random() * window.innerWidth;
                  const y = Math.random() * window.innerHeight;
                  const crackPaths = createBranchingCrack(x, y, boxSize * 2);
                  
                  crackPaths.forEach(({ path: pathData, class: pathClass }) => {
                      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                      path.setAttribute('d', pathData);
                      path.setAttribute('stroke', 'var(--crack-color)');
                      path.setAttribute('fill', 'none');
                      path.setAttribute('stroke-width', '2');
                      path.classList.add(pathClass);
                      svg.appendChild(path);
                  });
  
                  spreadCount++;
              }, intervalDelay);
          }, 2250);
  
          // Phase 3: Final spread and theme switch (2.85s - 3s)
          setTimeout(() => {
              // Remove trembling
              document.body.classList.remove('theme-transition-trembling');
              
              // Create and add overlay
              const overlay = document.createElement('div');
              overlay.className = 'theme-overlay';
              container.appendChild(overlay);
  
              // Switch theme after brief delay
              setTimeout(() => {
                  isDarkTheme.value = !isDarkTheme.value;
                  document.body.classList.toggle('dark-theme');
                  container.innerHTML = '';
                  isTransitioning.value = false;
  
                  // Return to idle animation
                  playAnimation(props.currentSection === 0 ? 'offensiveIdle' : 'standingIdle', 0.5);
              }, 150);
          }, 2850);
      }
  
      const loadAnimationFile = (url) => {
        return new Promise((resolve, reject) => {
          const fbxLoader = new FBXLoader()
          fbxLoader.load(
            url,
            (animationFile) => {
              if (animationFile.animations.length > 0) {
                resolve(animationFile.animations[0])
              } else {
                reject(new Error('No animations found in FBX file'))
              }
            },
            undefined,
            reject
          )
        })
      }
  
      const loadAnimations = async () => {
        try {
          console.log('Loading animations...')
          const offensiveIdleAnim = await loadAnimationFile('/animations/Offensive Idle.fbx')
          const standingIdleAnim = await loadAnimationFile('/animations/Standing Idle.fbx')
          const pettingAnim = await loadAnimationFile('/animations/Petting.fbx')
          
          animations['offensiveIdle'] = mixer.clipAction(offensiveIdleAnim)
          animations['standingIdle'] = mixer.clipAction(standingIdleAnim)
          animations['petting'] = mixer.clipAction(pettingAnim)
          
          playAnimation('offensiveIdle', 1.0)
        } catch (error) {
          console.error('Error loading animations:', error)
        }
      }
  
      const initScene = () => {
        scene = new THREE.Scene()
        scene.background = null
  
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
        scene.add(ambientLight)
  
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(0, 10, 10)
        scene.add(directionalLight)
  
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
        backLight.position.set(0, 5, -10)
        scene.add(backLight)
  
        camera = new THREE.PerspectiveCamera(
          35,
          350 / 600,
          0.1,
          1000
        )
        camera.position.set(-2, 1.2, 4)
        camera.lookAt(0, 0.8, 0)
  
        renderer = new THREE.WebGLRenderer({
          canvas: canvas.value,
          antialias: true,
          alpha: true
        })
        renderer.setSize(350, 600)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor(0x000000, 0)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
  
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enabled = false
        controls.enableZoom = false
        controls.enablePan = false
        controls.enableRotate = false
        controls.autoRotate = false
      }
  
      const loadModel = () => {
        const loader = new GLTFLoader()
        loader.load(
          '/models/67740c03ae515f20c0580732.glb',
          async (gltf) => {
            model = gltf.scene
            model.scale.set(0.75, 0.75, 0.75)
            model.position.y = -0.5
            
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
              }
            })
            
            scene.add(model)
            mixer = new THREE.AnimationMixer(model)
            await loadAnimations()
            loaded.value = true
          },
          (progress) => {
            console.log('Loading model...', (progress.loaded / progress.total * 100) + '%')
          },
          (error) => {
            console.error('Error loading model:', error)
          }
        )
      }
  
      const playAnimation = (name, duration = 0.5) => {
        if (isTransitioning.value && name !== 'petting') return
        
        if (currentAnimation) {
          currentAnimation.fadeOut(duration)
        }
        if (animations[name]) {
          animations[name].reset().fadeIn(duration).play()
          currentAnimation = animations[name]
        } else {
          console.warn(`Animation "${name}" not found. Available animations:`, Object.keys(animations))
        }
      }
  
      const animate = () => {
        requestAnimationFrame(animate)
        const delta = clock.getDelta()
        if (mixer) mixer.update(delta)
        renderer.render(scene, camera)
      }
  
      const handleResize = () => {
        if (camera && renderer) {
          camera.aspect = 350 / 600
          camera.updateProjectionMatrix()
          renderer.setSize(350, 600)
        }
      }
  
      watch(() => props.currentSection, (newSection) => {
        if (!isTransitioning.value) {
          switch(newSection) {
            case 0:
              playAnimation('offensiveIdle', 1.0)
              break
            default:
              playAnimation('standingIdle', 1.0)
              break
          }
        }
      })
  
      onMounted(() => {
        initScene()
        loadModel()
        animate()
        window.addEventListener('resize', handleResize)
      })
  
      onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
        if (mixer) mixer.stopAllAction()
        if (renderer) renderer.dispose()
        if (controls) controls.dispose()
        
        // Clean up transition elements
        const container = document.querySelector('.theme-transition-container')
        if (container) {
          container.remove()
        }
        
        // Clean up Three.js resources
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
      })
  
      return {
        canvas,
        loaded,
        isDarkTheme,
        isTransitioning,
        handleThemeToggle
      }
    }
  }
  </script>
  
  <style scoped>
  .avatar-container {
    position: fixed;
    left: 80px;
    bottom: 40px;
    width: 350px;
    height: 600px;
    z-index: 1000;
  }
  
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--primary-color);
    font-weight: bold;
    background: var(--background-color-semi);
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px var(--shadow-color);
  }
  
  .theme-toggle {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    background: var(--primary-color);
    color: var(--background-color);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    z-index: 1001;
    min-width: 120px;
  }
  
  .theme-toggle.dark {
    background: var(--secondary-color);
  }
  
  .theme-toggle:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 2px 8px var(--shadow-color);
  }
  
  .theme-toggle:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  canvas {
    width: 100% !important;
    height: 100% !important;
    pointer-events: none;
  }
  </style>