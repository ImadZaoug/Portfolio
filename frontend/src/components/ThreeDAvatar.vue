# frontend/src/components/ThreeDAvatar.vue
<template>
  <div class="avatar-container" :class="{ 'avatar-right': position === 'right' }">
    <canvas ref="canvas" />
    <div v-if="!loaded" class="loading">Loading avatar...</div>
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
  
  setup(props, { emit, expose }) {

    const canvas = ref(null)
    const loaded = ref(false)
    let scene, camera, renderer, model, mixer, controls
    let currentAnimation = null
    const clock = new THREE.Clock()
    const animations = {}

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
        
        playAnimation('offensiveIdle', 1.0)
        loaded.value = true
      } catch (error) {
        console.error('Error loading animations:', error)
      }
    }

    const playAnimation = async (name, duration = 0.5, loop = true) => {
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
      await playAnimation(animation, 0.3, false)
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

      camera = new THREE.PerspectiveCamera(35, 300 / 500, 0.1, 1000)
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

    // Watch for section changes
    watch(() => props.currentSection, (newSection) => {
      if (loaded.value) {
        const animation = newSection === 0 ? 'offensiveIdle' : 'standingIdle'
        playAnimation(animation, 1.0)
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

    // Expose methods to parent component
    expose({
      startThemeAnimation: () => {
        if (loaded.value) {
          playAnimation('petting', 0.5, false).then(() => {
            const idleAnimation = props.currentSection === 0 ? 'offensiveIdle' : 'standingIdle'
            playAnimation(idleAnimation, 0.5)
          })
        }
      },
      handleAnimationEvent
    })

    return {
      canvas,
      loaded
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
  color: var(--v-theme-primary);
  font-weight: bold;
  background: var(--v-theme-background);
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

canvas {
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
}

@media (max-width: 768px) {
  .avatar-container {
    &.avatar-right {
      right: 40px;
    }

    &:not(.avatar-right) {
      left: 40px;
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