<template>
  <div class="skill-tree-wrapper" :class="{ 'fullscreen': isFullscreen }">
    <!-- Navigation Controls -->
    <div class="navigation-controls">
      <button class="control-btn" @click="zoomIn" title="Zoom In">
        <span>+</span>
      </button>
      <button class="control-btn" @click="zoomOut" title="Zoom Out">
        <span>-</span>
      </button>
      <button 
        class="control-btn fullscreen-btn" 
        @click="toggleFullscreen" 
        :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
      >
        <!-- Unicode characters for maximize/minimize icons -->
        <span v-if="!isFullscreen">⛶</span>
        <span v-else>⊡</span>
      </button>
    </div>

    <!-- Main Skill Tree Content -->
    <div 
      class="skill-tree-container"
      ref="container"
      @mousedown="startPan"
      @mousemove="pan"
      @mouseup="stopPan"
      @mouseleave="stopPan"
      @wheel="handleZoom"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div 
        class="skill-tree"
        :style="{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: isPanning ? 'none' : 'transform 0.3s ease'
        }"
      >
        <!-- SVG Connection Lines -->
        <svg class="connections-layer" :width="width" :height="height">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <line
            v-for="(connection, index) in connections"
            :key="index"
            :x1="connection.x1"
            :y1="connection.y1"
            :x2="connection.x2"
            :y2="connection.y2"
            :class="{ 'connection-active': connection.active }"
            class="skill-connection"
          />
        </svg>

        <!-- Skill Nodes -->
        <div
          v-for="node in skillNodes"
          :key="node.id"
          class="skill-node"
          :class="{
            'unlocked': node.unlocked,
            'available': isNodeAvailable(node),
            'unavailable': !isNodeAvailable(node) && !node.unlocked,
            'hovered': node.isHovered
          }"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`
          }"
          @click="handleNodeClick(node)"
          @mouseenter="handleNodeHover(node, true)"
          @mouseleave="handleNodeHover(node, false)"
        >
          <div class="node-icon">{{ node.icon }}</div>
          <div class="node-ring"></div>
          
          <!-- Skill Tooltip -->
          <div class="skill-tooltip" v-if="node.isHovered">
            <h3>{{ node.name }}</h3>
            <p>{{ node.description }}</p>
            <div class="skill-requirements" v-if="!node.unlocked && node.dependencies?.length">
              <span>Requirements:</span>
              <ul>
                <li v-for="depId in node.dependencies" :key="depId">
                  {{ getNodeName(depId) }}
                </li>
              </ul>
            </div>
            <div class="skill-cost" v-if="!node.unlocked && isNodeAvailable(node)">
              Cost: {{ node.cost }} points
            </div>
          </div>
        </div>

        <!-- Background Grid Pattern -->
        <div class="grid-pattern"></div>
      </div>
    </div>

    <!-- Points Display -->
    <div class="skill-points-display">
      <div class="points-container">
        <span class="points-label">Ability Points:</span>
        <span class="points-value">{{ availablePoints }}</span>
        <span class="points-max">/ {{ maxPoints }}</span>
      </div>
      <div class="points-progress">
        <div 
          class="progress-bar" 
          :style="{ width: `${(availablePoints / maxPoints) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'SkillTree',
  props: {
    initialSkills: {
      type: Array,
      default: () => []
    },
    availablePoints: {
      type: Number,
      default: 0
    },
    maxPoints: {
      type: Number,
      default: 100
    },
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['unlock-skill', 'fullscreen-change'],
  
  setup(props, { emit }) {
    // State
    const width = ref(1200)
    const height = ref(800)
    const skillNodes = ref([])
    const connections = ref([])
    const zoom = ref(1)
    const minZoom = 0.5
    const maxZoom = 2
    const position = ref({ x: 0, y: 0 })
    const isPanning = ref(false)
    const startPosition = ref({ x: 0, y: 0 })
    const lastPosition = ref({ x: 0, y: 0 })
    const touchStartDistance = ref(0)
    const initialZoom = ref(1)
    const container = ref(null)

    // Node Management
    const initializeNodes = () => {
      skillNodes.value = props.initialSkills.map(skill => ({
        ...skill,
        x: skill.position.x,
        y: skill.position.y,
        isHovered: false
      }))
      generateConnections()
      centerTree()
    }

    const centerTree = () => {
      if (container.value) {
        const containerRect = container.value.getBoundingClientRect()
        position.value = {
          x: (containerRect.width - width.value) / 2,
          y: (containerRect.height - height.value) / 2
        }
      }
    }

    const generateConnections = () => {
      connections.value = []
      skillNodes.value.forEach(node => {
        if (node.dependencies) {
          node.dependencies.forEach(depId => {
            const parentNode = skillNodes.value.find(n => n.id === depId)
            if (parentNode) {
              connections.value.push({
                x1: parentNode.x + 30,
                y1: parentNode.y + 30,
                x2: node.x + 30,
                y2: node.y + 30,
                active: parentNode.unlocked && node.unlocked
              })
            }
          })
        }
      })
    }

    const isNodeAvailable = (node) => {
      if (!node.dependencies) return true
      return node.dependencies.every(depId => 
        skillNodes.value.find(n => n.id === depId && n.unlocked)
      )
    }

    const getNodeName = (nodeId) => {
      const node = skillNodes.value.find(n => n.id === nodeId)
      return node ? node.name : nodeId
    }

    const handleNodeClick = (node) => {
      if (!isNodeAvailable(node) || node.unlocked) return
      if (props.availablePoints < node.cost) return
      emit('unlock-skill', node.id)
      generateConnections()
    }

    const handleNodeHover = (node, isHovered) => {
      const nodeIndex = skillNodes.value.findIndex(n => n.id === node.id)
      if (nodeIndex !== -1) {
        skillNodes.value[nodeIndex].isHovered = isHovered
      }
    }

    // Fullscreen Controls
    const toggleFullscreen = async () => {
      if (props.isFullscreen) {
        try {
          if (document.fullscreenElement) {
            await document.exitFullscreen()
          }
          document.body.style.overflow = ''
          
          setTimeout(() => {
            centerTree()
            zoom.value = 1
          }, 100)
        } catch (err) {
          console.error('Error exiting fullscreen:', err)
        }
      } else {
        try {
          await container.value?.requestFullscreen()
          document.body.style.overflow = 'hidden'
          
          setTimeout(() => {
            centerTree()
            zoom.value = 1
          }, 100)
        } catch (err) {
          console.error('Error entering fullscreen:', err)
        }
      }
      
      emit('fullscreen-change', !props.isFullscreen)
    }

    // Zoom Controls
    const zoomIn = () => {
      if (zoom.value < maxZoom) {
        zoom.value = Math.min(zoom.value * 1.2, maxZoom)
      }
    }

    const zoomOut = () => {
      if (zoom.value > minZoom) {
        zoom.value = Math.max(zoom.value / 1.2, minZoom)
      }
    }

    const handleZoom = (e) => {
      e.preventDefault()
      if (!container.value) return

      const rect = container.value.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const oldZoom = zoom.value
      if (e.deltaY < 0) {
        zoomIn()
      } else {
        zoomOut()
      }

      if (oldZoom !== zoom.value) {
        const scale = zoom.value / oldZoom
        position.value = {
          x: mouseX - (mouseX - position.value.x) * scale,
          y: mouseY - (mouseY - position.value.y) * scale
        }
      }
    }

    // Pan Controls
    const startPan = (e) => {
      if (e.button !== 0) return
      isPanning.value = true
      startPosition.value = {
        x: e.clientX - position.value.x,
        y: e.clientY - position.value.y
      }
    }

    const pan = (e) => {
      if (!isPanning.value) return
      position.value = {
        x: e.clientX - startPosition.value.x,
        y: e.clientY - startPosition.value.y
      }
    }

    const stopPan = () => {
      isPanning.value = false
      lastPosition.value = { ...position.value }
    }

    // Touch Controls
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        touchStartDistance.value = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        initialZoom.value = zoom.value
      } else if (e.touches.length === 1) {
        startPan({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
          button: 0
        })
      }
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const scale = distance / touchStartDistance.value
        zoom.value = Math.min(Math.max(initialZoom.value * scale, minZoom), maxZoom)
      } else if (e.touches.length === 1) {
        pan({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        })
      }
    }

    // Lifecycle Hooks
    onMounted(() => {
      initializeNodes()
      window.addEventListener('resize', centerTree)
      
      // Add fullscreenchange event listener
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && props.isFullscreen) {
          emit('fullscreen-change', false)
          document.body.style.overflow = ''
          
          setTimeout(() => {
            centerTree()
            zoom.value = 1
          }, 100)
        }
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', centerTree)
      document.removeEventListener('fullscreenchange', null)
      
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .catch(err => console.error('Error exiting fullscreen:', err))
      }
      document.body.style.overflow = ''
    })

    return {
      width,
      height,
      skillNodes,
      connections,
      zoom,
      position,
      isPanning,
      container,
      isNodeAvailable,
      getNodeName,
      handleNodeClick,
      handleNodeHover,
      toggleFullscreen,
      zoomIn,
      zoomOut,
      handleZoom,
      startPan,
      pan,
      stopPan,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd: stopPan,
      centerTree
    }
  }
}
</script>

<style lang="scss" scoped>
.skill-tree-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%);
  border-radius: 12px;
  overflow: hidden;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    border-radius: 0;
    margin: 0;
    padding: 0;

    .fullscreen-btn {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
      }
    }
    .skill-tree-container {
      width: 100vw;
      height: 100vh;
    }

    .navigation-controls {
      top: 2rem;
      right: 2rem;
    }
  }
}

.skill-tree-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.skill-tree {
  transform-origin: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(45deg, rgba(255, 215, 0, 0.03) 1px, transparent 1px),
    linear-gradient(-45deg, rgba(255, 215, 0, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: -1;
}

.connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.skill-connection {
  stroke: rgba(255, 215, 0, 0.2);
  stroke-width: 2;
  transition: all 0.3s ease;
  filter: url(#glow);

  &.connection-active {
    stroke: #ffd700;
    stroke-width: 3;
  }
}

.skill-node {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(20, 30, 40, 0.9);
  border: 2px solid rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translate(-50%, -50%);

  .node-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 50%;
    transform: rotate(45deg);
  }

  &.unlocked {
    background: rgba(255, 215, 0, 0.9);
    border-color: #fff;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);

    .node-icon {
      filter: brightness(0.8) contrast(1.2);
    }

    .node-ring {
      border-color: rgba(255, 215, 0, 0.8);
      transform: scale(1.1) rotate(45deg);
    }
  }

  &.available {
    border-color: rgba(255, 215, 0, 0.8);
    animation: pulse 2s infinite;

    .node-ring {
      border-color: rgba(255, 215, 0, 0.4);
      animation: rotate 4s linear infinite;
    }
  }

  &.unavailable {
    opacity: 0.6;
    cursor: not-allowed;

    .node-ring {
      border-color: rgba(255, 0, 0, 0.3);
    }
  }

  &.hovered {
    transform: translate(-50%, -50%) scale(1.1);

    .skill-tooltip {
      opacity: 1;
      transform: translateY(0);
    }

    .node-ring {
      transform: scale(1.2) rotate(45deg);
    }
  }

  .node-icon {
    font-size: 24px;
    z-index: 1;
    transition: filter 0.3s ease;
  }
}

.skill-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #ffd700;
  padding: 1rem;
  border-radius: 4px;
  width: 200px;
  color: #fff;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 100;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: inherit;
    border-left: 1px solid #ffd700;
    border-top: 1px solid #ffd700;
  }

  h3 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
    padding-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .skill-requirements {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 215, 0, 0.3);

    span {
      color: #ffd700;
      font-weight: 500;
    }

    ul {
      margin: 0.25rem 0 0 1rem;
      padding: 0;
      list-style-type: none;

      li {
        position: relative;
        padding-left: 1rem;
        
        &::before {
          content: '•';
          position: absolute;
          left: 0;
          color: rgba(255, 215, 0, 0.5);
        }
      }
    }
  }

  .skill-cost {
    font-size: 0.9rem;
    color: #ffd700;
    margin-top: 0.5rem;
    font-weight: 500;
  }
}

.navigation-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
  &.fullscreen-btn {
    span {
      transition: transform 0.3s ease;
    }

    &:hover span {
      transform: scale(1.1);
    }
  }
}

.skill-points-display {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #ffd700;
  padding: 1rem;
  border-radius: 4px;
  color: #fff;
  z-index: 10;
  min-width: 200px;
  text-align: center;

  .points-container {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;

    .points-value {
      color: #ffd700;
      font-weight: 500;
      margin: 0 0.25rem;
    }

    .points-max {
      opacity: 0.7;
    }
  }

  .points-progress {
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: #ffd700;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
}

.close-fullscreen {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10000;
  font-size: 1.2rem;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive styles
@media (max-width: 768px) {
  .skill-node {
    width: 50px;
    height: 50px;

    .node-icon {
      font-size: 20px;
    }
  }

  .navigation-controls {
    top: 0.5rem;
    right: 0.5rem;
  }

  .control-btn,
  .close-fullscreen {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .skill-tooltip {
    width: 180px;
    padding: 0.75rem;

    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.8rem;
    }
  }

  .skill-points-display {
    min-width: 180px;
    padding: 0.75rem;

    .points-container {
      font-size: 1rem;
    }
  }
}

@media (max-width: 480px) {
  .skill-node {
    width: 40px;
    height: 40px;

    .node-icon {
      font-size: 16px;
    }
  }

  .control-btn,
  .close-fullscreen {
    width: 32px;
    height: 32px;
  }

  .skill-points-display {
    min-width: 160px;
    padding: 0.75rem;

    .points-container {
      font-size: 0.9rem;
    }
  }

  .skill-tooltip {
    width: 160px;
    padding: 0.75rem;

    h3 {
      font-size: 0.9rem;
    }

    p {
      font-size: 0.75rem;
    }
  }
}
</style>