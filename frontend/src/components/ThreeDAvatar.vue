# frontend/src/components/ThreeDAvatar.vue
<template>
  <div class="avatar-container">
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
    const initialized = ref(false)
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
        if (!mixer || !animations[name]) {
          console.warn(`Cannot play animation "${name}". Mixer or animation not ready.`)
          resolve()
          return
        }

        if (currentAnimation) {
          currentAnimation.fadeOut(duration)
        }
        
        const action = animations[name]
        action.reset()
        action.fadeIn(duration)
        action.play()
        
        if (!loop) {
          action.setLoop(THREE.LoopOnce)
          action.clampWhenFinished = true
          
          const onFinished = () => {
            mixer.removeEventListener('finished', onFinished)
            emit('animation-complete')
            resolve()
          }
          
          mixer.addEventListener('finished', onFinished)
        } else {
          resolve()
        }
        
        currentAnimation = action
      })
    }

    const handleAnimationEvent = async (event) => {
      if (!loaded.value) return
      const { animation, toSection } = event
      await playAnimation(animation, 0.3, false)
      const idleAnimation = toSection === 0 ? 'offensiveIdle' : 'standingIdle'
      await playAnimation(idleAnimation, 0.3)
    }

    const initScene = () => {
      if (initialized.value) return
      
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
        alpha: true,
        powerPreference: 'high-performance'
      })
      renderer.setSize(300, 500)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enabled = false
      controls.enableZoom = false
      controls.enablePan = false
      controls.enableRotate = false
      controls.autoRotate = false

      initialized.value = true
    }

    const loadModel = () => {
      if (!initialized.value) return
      
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
              // Optimize materials
              if (node.material) {
                node.material.needsUpdate = false
              }
            }
          })
          
          scene.add(model)
          mixer = new THREE.AnimationMixer(model)
          await loadAnimations()
        },
        (progress) => {
          const percentage = (progress.loaded / progress.total * 100).toFixed(2)
          console.log('Loading model...', percentage + '%')
        },
        (error) => {
          console.error('Error loading model:', error)
        }
      )
    }

    const animate = () => {
      if (!initialized.value) return
      
      const animationFrame = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      
      if (mixer) {
        mixer.update(delta)
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }

      return () => {
        cancelAnimationFrame(animationFrame)
      }
    }

    const handleResize = () => {
      if (!initialized.value) return
      
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

      // Cleanup resources
      if (mixer) {
        mixer.stopAllAction()
        mixer.uncacheRoot(model)
      }

      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
      }

      if (controls) {
        controls.dispose()
      }

      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose()
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => {
                material.dispose()
                if (material.map) material.map.dispose()
                if (material.lightMap) material.lightMap.dispose()
                if (material.bumpMap) material.bumpMap.dispose()
                if (material.normalMap) material.normalMap.dispose()
                if (material.specularMap) material.specularMap.dispose()
                if (material.envMap) material.envMap.dispose()
              })
            } else {
              object.material.dispose()
              if (object.material.map) object.material.map.dispose()
              if (object.material.lightMap) object.material.lightMap.dispose()
              if (object.material.bumpMap) object.material.bumpMap.dispose()
              if (object.material.normalMap) object.material.normalMap.dispose()
              if (object.material.specularMap) object.material.specularMap.dispose()
              if (object.material.envMap) object.material.envMap.dispose()
            }
          }
        })
      }

      scene = null
      camera = null
      renderer = null
      model = null
      mixer = null
      controls = null
      initialized.value = false
    })

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
  width: 300px;
  height: 500px;
  will-change: transform, opacity;

  canvas {
    width: 100% !important;
    height: 100% !important;
    pointer-events: none;
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

@media (max-width: 768px) {
  .avatar-container {
    width: 250px;
    height: 450px;
  }
}

@media (max-width: 480px) {
  .avatar-container {
    width: 200px;
    height: 400px;
  }
}
</style>