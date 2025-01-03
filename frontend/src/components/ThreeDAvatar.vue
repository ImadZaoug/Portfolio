//frontend/src/components/ThreeDAvatar.vue
<template>
  <div class="avatar-container" :class="{ 'avatar-right': position === 'right' }">
    <canvas ref="canvas" />
    <div v-if="!loaded" class="loading">Loading avatar...</div>
      <button 
        @click="handleThemeToggle" 
        class="theme-toggle" 
        :class="{ 'dark': isDarkTheme }" 
        :disabled="isTransitioning"
      >
        <span v-if="isDarkTheme">
          <i class="fa-solid fa-sun"></i>
          Light Mode
        </span>
        <span v-else>
          <i class="fa-solid fa-moon"></i>
          Dark Mode
        </span>
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
    },
    position: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value)
    }
  },
  emits: ['animation-complete'],
  
  setup(props, { emit }) {
    const canvas = ref(null)
    const loaded = ref(false)
    const isDarkTheme = ref(false)
    const isTransitioning = ref(false)
    let scene, camera, renderer, model, mixer, controls
    let currentAnimation = null
    const clock = new THREE.Clock()
    const animations = {}

    const createLightningPath = (startX, startY, width, intensity = 1) => {
      const path = []
      let x = startX
      let y = startY
      path.push(`M ${x} ${y}`)

      // More dynamic segments for lightning effect
      const numSegments = Math.floor(Math.random() * 5) + 4
      const baseAngle = Math.random() * 360 // Random base direction
      
      for (let i = 0; i < numSegments; i++) {
        // Sharper angles for lightning effect
        const angleVariation = (Math.random() * 60 - 30) * intensity
        const angle = (baseAngle + angleVariation) * (Math.PI / 180)
        
        // Variable segment lengths
        const segmentLength = (width / numSegments) * (0.3 + Math.random() * 0.7) * intensity
        
        const ctrl1X = x + Math.cos(angle) * (segmentLength * 0.33)
        const ctrl1Y = y + Math.sin(angle) * (segmentLength * 0.33)
        
        x += Math.cos(angle) * segmentLength
        y += Math.sin(angle) * segmentLength
        
        if (Math.random() > 0.7) {
          path.push(`Q ${ctrl1X} ${ctrl1Y} ${x} ${y}`)
        } else {
          path.push(`L ${x} ${y}`)
        }
      }
      
      return path.join(' ')
    }

    const createBranchingCrack = (startX, startY, width) => {
      const paths = []
      const mainPath = createLightningPath(startX, startY, width, 1)
      paths.push({ path: mainPath, class: 'active' })
      
      const numBranches = Math.floor(Math.random() * 3) + (width > 100 ? 2 : 1)
      
      for (let i = 0; i < numBranches; i++) {
        const branchStartX = startX + width * (Math.random() * 0.4)
        const branchStartY = startY + width * (Math.random() * 0.4 - 0.2)
        const branchWidth = width * (0.3 + Math.random() * 0.3)
        const branchPath = createLightningPath(branchStartX, branchStartY, branchWidth, 0.7)
        paths.push({ path: branchPath, class: 'branch' })
        
        if (width > 150 && Math.random() > 0.5) {
          const subBranchX = branchStartX + branchWidth * (Math.random() * 0.3)
          const subBranchY = branchStartY + branchWidth * (Math.random() * 0.3 - 0.15)
          const subBranchPath = createLightningPath(subBranchX, subBranchY, branchWidth * 0.5, 0.5)
          paths.push({ path: subBranchPath, class: 'branch' })
        }
      }
      
      return paths
    }

    const handleThemeToggle = () => {
      if (isTransitioning.value) return
      isTransitioning.value = true

      // Play petting animation when toggling theme
      playAnimation('petting', 0.5)

      let container = document.querySelector('.theme-transition-container')
      if (!container) {
        container = document.createElement('div')
        container.className = 'theme-transition-container'
        document.body.appendChild(container)
      }

      const boxSize = 40
      const cols = Math.ceil(window.innerWidth / boxSize)
      const rows = Math.ceil(window.innerHeight / boxSize)
      const totalBoxes = cols * rows
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.style.position = 'absolute'
      svg.style.top = '0'
      svg.style.left = '0'
      svg.style.pointerEvents = 'none'
      container.appendChild(svg)

      document.body.classList.add('theme-transition-trembling')

      const maxInitialCoverage = Math.floor(totalBoxes * 0.3)
      let coveredBoxes = new Set()
      
      const numInitialCracks = Math.floor(totalBoxes * 0.1)
      
      for (let i = 0; i < numInitialCracks && coveredBoxes.size < maxInitialCoverage; i++) {
        const startTime = Math.random() * 2000
        setTimeout(() => {
          if (coveredBoxes.size >= maxInitialCoverage) return
          const box = Math.floor(Math.random() * totalBoxes)
          if (!coveredBoxes.has(box)) {
            const col = box % cols
            const row = Math.floor(box / cols)
            const x = col * boxSize
            const y = row * boxSize

            const crackPaths = createBranchingCrack(x, y, boxSize * 2)
            crackPaths.forEach(({ path: pathData, class: pathClass }) => {
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
              path.setAttribute('d', pathData)
              path.setAttribute('stroke', 'var(--crack-color)')
              path.setAttribute('fill', 'none')
              path.setAttribute('stroke-width', '2')
              path.classList.add(pathClass)
              
              const length = path.getTotalLength()
              path.style.strokeDasharray = length
              path.style.strokeDashoffset = length
              
              svg.appendChild(path)
              
              setTimeout(() => {
                path.style.strokeDashoffset = '0'
              }, 50)

              coveredBoxes.add(box)
            })
          }
        }, startTime)
      }

      // Phase 2: Rapid spread (2.25s - 2.85s)
      setTimeout(() => {
        const remainingForPhase2 = Math.floor(totalBoxes * 0.6)
        const rapidSpreadDuration = 600
        const intervalDelay = rapidSpreadDuration / remainingForPhase2

        let spreadCount = 0
        const spreadInterval = setInterval(() => {
          if (spreadCount >= remainingForPhase2) {
            clearInterval(spreadInterval)
            return
          }

          const x = Math.random() * window.innerWidth
          const y = Math.random() * window.innerHeight
          const crackPaths = createBranchingCrack(x, y, boxSize * 2)
          
          crackPaths.forEach(({ path: pathData, class: pathClass }) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.setAttribute('d', pathData)
            path.setAttribute('stroke', 'var(--crack-color)')
            path.setAttribute('fill', 'none')
            path.setAttribute('stroke-width', '2')
            path.classList.add(pathClass)
            svg.appendChild(path)
          })

          spreadCount++
        }, intervalDelay)
      }, 2250)

      // Phase 3: Final spread and theme switch
      setTimeout(() => {
        document.body.classList.remove('theme-transition-trembling')
        
        const overlay = document.createElement('div')
        overlay.className = 'theme-overlay'
        container.appendChild(overlay)

        setTimeout(() => {
          isDarkTheme.value = !isDarkTheme.value
          document.body.classList.toggle('dark-theme')
          container.innerHTML = ''
          isTransitioning.value = false

          playAnimation(props.currentSection === 0 ? 'offensiveIdle' : 'standingIdle', 0.5)
        }, 150)
      }, 2850)
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
        // Load all animations
        const animationFiles = {
          'offensiveIdle': '/animations/Offensive Idle.fbx',
          'standingIdle': '/animations/Standing Idle.fbx',
          'petting': '/animations/Petting.fbx',
          'jump': '/animations/Jump.fbx',
          'climbing': '/animations/Climbing.fbx',
          'charge': '/animations/Charge.fbx',
          'RunRight': '/animations/Standing Run Right.fbx',
          'RunLeft': '/animations/Crouch Walk Left.fbx',
          'climbingDownWall': '/animations/Climbing Down Wall.fbx',
          'freehangClimb': '/animations/Freehang Climb.fbx'
        }

        for (const [name, path] of Object.entries(animationFiles)) {
          const animation = await loadAnimationFile(path)
          animations[name] = mixer.clipAction(animation)
        }
        
        // Set initial animation
        playAnimation('offensiveIdle', 1.0)
        loaded.value = true
      } catch (error) {
        console.error('Error loading animations:', error)
      }
    }

    const playAnimation = async (name, duration = 0.5, loop = true) => {
      if (isTransitioning.value && name !== 'petting') return
      
      return new Promise((resolve) => {
        if (currentAnimation) {
          currentAnimation.fadeOut(duration)
        }
        
        if (animations[name]) {
          const action = animations[name]
          action.reset()
          action.fadeIn(duration)
          action.play()
          
          if (!loop) {
            action.setLoop(THREE.LoopOnce)
            action.clampWhenFinished = true
            
            mixer.addEventListener('finished', () => {
              mixer.removeEventListener('finished')
              emit('animation-complete')
              resolve()
            })
          } else {
            resolve()
          }
          
          currentAnimation = action
        } else {
          console.warn(`Animation "${name}" not found. Available animations:`, Object.keys(animations))
          resolve()
        }
      })
    }

    const handleAnimationEvent = async (event) => {
      const { animation, toSection } = event
      
      // Play the transition animation
      await playAnimation(animation, 0.3, false)
      
      // After animation completes, play the appropriate idle animation
      const idleAnimation = toSection === 0 ? 'offensiveIdle' : 'standingIdle'
      await playAnimation(idleAnimation, 0.3)
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
        300 / 500,
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
      renderer.setSize(300, 500)
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

    // Initialize on mount
    onMounted(() => {
      initScene()
      loadModel()
      animate()
      window.addEventListener('resize', handleResize)
    })

    // Cleanup on unmount
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
      handleThemeToggle,
      handleAnimationEvent,
      playAnimation
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-container {
  position: fixed;
  width: 300px;
  height: 500px;
  z-index: 1000;
  transition: all 0.5s ease-in-out;

  &.avatar-right {
    right: 80px;
  }

  &:not(.avatar-right) {
    left: 80px;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  i {
    font-size: 1.1rem;
  }

  &.dark {
    background: var(--secondary-color);
  }

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 2px 8px var(--shadow-color);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

canvas {
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
}

@media (max-width: 768px) {
  .theme-toggle {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    min-width: 100px;
    font-size: 0.9rem;

    i {
      font-size: 1rem;
    }
  }
}

@media (max-width: 480px) {
  .avatar-container {
    width: 250px;
    height: 400px;

    &.avatar-right {
      right: 20px;
    }

    &:not(.avatar-right) {
      left: 20px;
    }
  }
}
</style>