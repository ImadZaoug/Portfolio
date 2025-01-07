//frontend/src/components/SkillTree.vue
<template>
  <div class="skill-tree-wrapper" :class="{ 'fullscreen': isFullscreen }">
    <!-- Navigation Controls -->
    <div class="navigation-controls">
      <v-btn icon small @click="zoomIn" class="control-btn" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon small @click="zoomOut" class="control-btn" color="primary">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn icon small @click="resetZoom" class="control-btn" color="primary">
        <v-icon>mdi-backup-restore</v-icon>
      </v-btn>
      <v-btn icon small @click="toggleFullscreen" class="control-btn" color="primary">
        <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
      </v-btn>
    </div>

    <!-- Main Skill Tree Container -->
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
        class="skill-tree-content"
        :style="{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transition: isPanning ? 'none' : 'transform 0.3s ease'
        }"
      >
        <!-- SVG Connection Lines Layer -->
        <svg class="connections-layer" :width="width" :height="height">
          <defs>
            <filter id="glow" height="130%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feFlood flood-color="#ffd700" flood-opacity="0.3" result="color"/>
              <feComposite in="color" in2="blur" operator="in" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <linearGradient id="activeConnection" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#ffd700;stop-opacity:0.6" />
            </linearGradient>

            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            </pattern>
          </defs>

          <!-- Grid Background -->
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <!-- Connection Lines -->
          <path
            v-for="(connection, index) in connections"
            :key="index"
            :d="generatePath(connection)"
            :class="{
              'connection-active': connection.active,
              'connection-available': connection.available && !connection.active,
              'connection-locked': !connection.available && !connection.active
            }"
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
            'hovered': node.isHovered,
            'locked': !node.unlocked && !isNodeAvailable(node),
            'root': !node.dependencies
          }"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`
          }"
          @click="handleNodeClick(node)"
          @mouseenter="handleNodeHover(node, true)"
          @mouseleave="handleNodeHover(node, false)"
        >
          <!-- Node Content -->
          <div class="node-content">
            <div class="node-icon">
              <template v-if="isImageIcon(node.unlocked ? node.icon : node.lockedIcon)">
                <img 
                  :src="node.unlocked ? node.icon : node.lockedIcon" 
                  :alt="node.name"
                  class="skill-icon"
                  width="24"
                  height="24"
                />
              </template>
              <template v-else>
                {{ node.unlocked ? node.icon : node.lockedIcon }}
              </template>
            </div>
          </div>
          
          <!-- Connection Points -->
          <div class="connection-points">
            <div class="connection-point top"></div>
            <div class="connection-point right"></div>
            <div class="connection-point bottom"></div>
            <div class="connection-point left"></div>
          </div>
          
          <!-- Skill Tooltip -->
          <div 
            v-if="node.isHovered"
            class="skill-tooltip"
            :class="{
              'tooltip-left': node.branch === 'right',
              'tooltip-right': node.branch === 'left'
            }"
          >
            <div class="tooltip-header">
              <h3>{{ node.name }}</h3>
              <span v-if="node.cost" class="cost-badge">
                {{ node.cost }} pts
              </span>
            </div>
            
            <p>{{ node.description }}</p>

            <template v-if="!node.unlocked">
              <div v-if="node.dependencies?.length" class="requirements">
                <span class="section-title">Requirements:</span>
                <ul>
                  <li 
                    v-for="depId in node.dependencies" 
                    :key="depId"
                    :class="{ 'met': isRequirementMet(depId) }"
                  >
                    {{ getNodeName(depId) }}
                    <v-icon 
                      small 
                      :color="isRequirementMet(depId) ? 'success' : 'error'"
                      class="requirement-icon"
                    >
                      {{ isRequirementMet(depId) ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                  </li>
                </ul>
              </div>

              <div v-if="isNodeAvailable(node)" class="unlock-info">
                <div class="points-check">
                  <span>Required Points:</span>
                  <span :class="{ 'insufficient': availablePoints < node.cost }">
                    {{ node.cost }}/{{ availablePoints }}
                  </span>
                </div>
                <v-btn
                  small
                  block
                  :disabled="availablePoints < node.cost"
                  @click.stop="handleNodeClick(node)"
                  color="primary"
                  class="unlock-btn"
                >
                  Unlock Skill
                </v-btn>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Points Display -->
    <div class="points-display">
      <div class="points-info">
        <span class="points-label">Available Points:</span>
        <span class="points-value">{{ availablePoints }}</span>
        <span class="points-separator">/</span>
        <span class="points-max">{{ maxPoints }}</span>
      </div>
      <div class="points-bar">
        <div 
          class="points-progress"
          :style="{ width: `${(availablePoints / maxPoints) * 100}%` }"
        ></div>
      </div>
      <div class="points-stats">
        <span>Skills Unlocked: {{ unlockedCount }}/{{ totalSkills }}</span>
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
      required: true
    },
    availablePoints: {
      type: Number,
      required: true
    },
    maxPoints: {
      type: Number,
      required: true
    },
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },

  emits: ['unlock-skill', 'fullscreen-change'],

  setup(props, { emit }) {
    const container = ref(null)
    const width = ref(2000)
    const height = ref(1200)
    const zoom = ref(0.8)
    const defaultZoom = 0.8
    const minZoom = 0.4
    const maxZoom = 2
    const position = ref({ x: 0, y: 0 })
    const isPanning = ref(false)
    const startPosition = ref({ x: 0, y: 0 })
    const skillNodes = ref([])
    const connections = ref([])
    const unlockedCount = ref(0)
    const totalSkills = ref(0)
    const isImageIcon = (icon) => icon.endsWith('.png')

    // Initialize nodes and connections
    const initializeNodes = () => {
      skillNodes.value = props.initialSkills.map(skill => ({
        ...skill,
        x: skill.position.x,
        y: skill.position.y,
        isHovered: false
      }))
      totalSkills.value = skillNodes.value.length - 2 // Exclude root nodes
      generateConnections()
      centerTree()
      updateUnlockedCount()
    }

    // Generate connection paths
    const generatePath = (connection) => {
      // Node properties
      const NODE_RADIUS = 30
      const start = { x: connection.x1, y: connection.y1 }
      const end = { x: connection.x2, y: connection.y2 }
      
      // Calculate the angle and distance between nodes
      const dx = end.x - start.x
      const dy = end.y - start.y
      const angle = Math.atan2(dy, dx)
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Calculate exact points at node edges
      const startPoint = {
        x: start.x + Math.cos(angle) * NODE_RADIUS,
        y: start.y + Math.sin(angle) * NODE_RADIUS
      }
      const endPoint = {
        x: end.x - Math.cos(angle) * NODE_RADIUS,
        y: end.y - Math.sin(angle) * NODE_RADIUS
      }

      // For very close nodes, use a straight line
      if (distance < NODE_RADIUS * 3) {
        return `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`
      }

      // Different connection styles based on branch
      if (connection.branch === 'right') {
        // For right branch (downward flow), use vertical-priority paths
        const controlDistance = Math.min(distance * 0.5, 100)
        return `M ${startPoint.x} ${startPoint.y}
                C ${startPoint.x} ${startPoint.y + controlDistance}
                  ${endPoint.x} ${endPoint.y - controlDistance}
                  ${endPoint.x} ${endPoint.y}`
      } else if (connection.branch === 'left') {
        // For left branch (upward flow), use horizontal-priority paths
        const controlDistance = Math.min(distance * 0.5, 100)
        return `M ${startPoint.x} ${startPoint.y}
                C ${startPoint.x + controlDistance} ${startPoint.y}
                  ${endPoint.x - controlDistance} ${endPoint.y}
                  ${endPoint.x} ${endPoint.y}`
      }

      // For cross-branch or default connections, use angled paths
      const midX = (startPoint.x + endPoint.x) / 2
      const midY = (startPoint.y + endPoint.y) / 2
      const cornerRadius = 20 // Radius for rounded corners

      // Create a path with rounded corners using both midX and midY for better alignment
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal dominant path
        return `M ${startPoint.x} ${startPoint.y}
                L ${midX - cornerRadius} ${startPoint.y}
                Q ${midX} ${startPoint.y} ${midX} ${midY}
                L ${midX} ${endPoint.y}
                Q ${midX} ${endPoint.y} ${midX + cornerRadius} ${endPoint.y}
                L ${endPoint.x} ${endPoint.y}`
      } else {
        // Vertical dominant path
        return `M ${startPoint.x} ${startPoint.y}
                L ${startPoint.x} ${midY - cornerRadius}
                Q ${startPoint.x} ${midY} ${midX} ${midY}
                L ${endPoint.x} ${midY}
                Q ${endPoint.x} ${midY} ${endPoint.x} ${midY + cornerRadius}
                L ${endPoint.x} ${endPoint.y}`
      }
    }

    // Generate connections between nodes
    const generateConnections = () => {
      connections.value = []
      skillNodes.value.forEach(node => {
        if (node.dependencies) {
          node.dependencies.forEach(depId => {
            const parentNode = skillNodes.value.find(n => n.id === depId)
            if (parentNode) {
              // Use the actual node coordinates as centers
              connections.value.push({
                x1: parentNode.x,
                y1: parentNode.y,
                x2: node.x,
                y2: node.y,
                active: parentNode.unlocked && node.unlocked,
                available: parentNode.unlocked && !node.unlocked,
                branch: node.branch
              })
            }
          })
        }
      })
    }

    // Update unlocked skills count
    const updateUnlockedCount = () => {
      unlockedCount.value = skillNodes.value.filter(node => 
        node.unlocked && !['statistics', 'coding'].includes(node.id)
      ).length
    }

    // Center the skill tree in the viewport
    const centerTree = () => {
      if (container.value) {
        const containerRect = container.value.getBoundingClientRect()
        position.value = {
          x: (containerRect.width - width.value * zoom.value) / 2,
          y: (containerRect.height - height.value * zoom.value) / 2
        }
      }
    }

    // Node interaction handlers
    const handleNodeClick = (node) => {
      if (!isNodeAvailable(node) || node.unlocked) return
      if (props.availablePoints < node.cost) return
      emit('unlock-skill', node.id)
      node.unlocked = true
      generateConnections()
      updateUnlockedCount()
    }

    const handleNodeHover = (node, isHovered) => {
      const nodeIndex = skillNodes.value.findIndex(n => n.id === node.id)
      if (nodeIndex !== -1) {
        skillNodes.value[nodeIndex].isHovered = isHovered
      }
    }

    // Navigation controls
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

    const resetZoom = () => {
      zoom.value = defaultZoom
      centerTree()
    }

    const handleZoom = (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = zoom.value * delta
      if (newZoom >= minZoom && newZoom <= maxZoom) {
        zoom.value = newZoom
      }
    }

    // Pan controls
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
    }

    // Touch controls
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        startPan({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
          button: 0
        })
      }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        pan({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        })
      }
    }

    // Utility functions
    const isNodeAvailable = (node) => {
      if (!node.dependencies) return true
      return node.dependencies.every(depId => {
        const depSkill = skillNodes.value.find(n => n.id === depId)
        return depSkill && depSkill.unlocked
      })
    }

    const isRequirementMet = (nodeId) => {
      const node = skillNodes.value.find(n => n.id === nodeId)
      return node && node.unlocked
    }

    const getNodeName = (nodeId) => {
      const node = skillNodes.value.find(n => n.id === nodeId)
      return node ? node.name : nodeId
    }

    // Fullscreen controls
    const toggleFullscreen = () => {
      emit('fullscreen-change', !props.isFullscreen)
    }

    // Lifecycle hooks
    onMounted(() => {
      initializeNodes()
      window.addEventListener('resize', centerTree)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', centerTree)
    })

    return {
      container,
      width,
      height,
      zoom,
      position,
      isPanning,
      skillNodes,
      connections,
      unlockedCount,
      totalSkills,
      handleNodeClick,
      handleNodeHover,
      isNodeAvailable,
      isRequirementMet,
      getNodeName,
      generatePath,
      zoomIn,
      zoomOut,
      resetZoom,
      handleZoom,
      startPan,
      pan,
      stopPan,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd: stopPan,
      isImageIcon,
      toggleFullscreen
    }
  }
}
</script>

<style lang="scss">
.skill-tree-wrapper {
position: relative;
width: 100%;
height: 100%;
min-height: 800px;
background: #1a1f2e;
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
}
}

.navigation-controls {
position: absolute;
top: 1rem;
right: 1rem;
display: flex;
gap: 0.5rem;
z-index: 10;

.control-btn {
background: rgba(255, 255, 255, 0.1) !important;
border: 1px solid rgba(255, 255, 255, 0.2);

&:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3);
}

.v-icon {
  color: white !important;
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

.skill-tree-content {
position: relative;
transform-origin: center;
}

.connections-layer {
position: absolute;
top: 0;
left: 0;
pointer-events: none;
}

.skill-connection {
fill: none;
stroke-width: 2;
transition: all 0.3s ease;

&.connection-active {
stroke: url(#activeConnection);
filter: url(#glow);
}

&.connection-available {
stroke: rgba(255, 215, 0, 0.3);
stroke-dasharray: 6 4;
}

&.connection-locked {
stroke: rgba(255, 255, 255, 0.1);
}
}

.skill-node {
position: absolute;
width: 60px;
height: 60px;
transform: translate(-50%, -50%);
cursor: pointer;
z-index: 1;

.node-content {
width: 100%;
height: 100%;
border-radius: 50%;
background: rgba(30, 35, 45, 0.95);
border: 2px solid rgba(255, 255, 255, 0.2);
display: flex;
align-items: center;
justify-content: center;
transition: all 0.3s ease;
position: relative;
overflow: visible;

.node-icon {
  font-size: 24px;
  opacity: 0.7;
  transition: all 0.3s ease;
}
}

.connection-points {
position: absolute;
inset: 0;
pointer-events: none;

.connection-point {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  transition: all 0.3s ease;

  &.top { top: 0; left: 50%; transform: translate(-50%, -50%); }
  &.right { right: 0; top: 50%; transform: translate(50%, -50%); }
  &.bottom { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
  &.left { left: 0; top: 50%; transform: translate(-50%, -50%); }
}
}

&.root {
.node-content {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.15);

  .node-icon {
    opacity: 1;
    color: #ffd700;
  }
}
}

&.unlocked {
.node-content {
  background: rgba(255, 215, 0, 0.15);
  border-color: #ffd700;

  .node-icon {
    opacity: 1;
    color: #ffd700;
  }
}

.connection-point {
  background: #ffd700;
}
}

&.available {
.node-content {
  border-color: rgba(255, 215, 0, 0.5);
  
  &:hover {
    transform: scale(1.1);
    border-color: #ffd700;
  }
}

.node-icon {
  opacity: 0.9;
}
}

&.locked {
cursor: not-allowed;

.node-content {
  background: rgba(30, 35, 45, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

.node-icon {
  opacity: 0.4;
}
}
}

.skill-tooltip {
position: absolute;
top: 100%;
left: 50%;
transform: translateX(-50%) translateY(10px);
background: rgba(20, 25, 35, 0.95);
border: 1px solid rgba(255, 255, 255, 0.2);
padding: 1rem;
border-radius: 8px;
min-width: 250px;
color: #fff;
pointer-events: none;
z-index: 100;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

.skill-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.tooltip-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 0.5rem;

h3 {
  color: #ffd700;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.cost-badge {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}
}

&.tooltip-left {
left: auto;
right: calc(100% + 10px);
top: 50%;
transform: translateY(-50%);
}

&.tooltip-right {
left: calc(100% + 10px);
top: 50%;
transform: translateY(-50%);
}
}

.points-display {
position: absolute;
bottom: 2rem;
left: 50%;
transform: translateX(-50%);
background: rgba(20, 25, 35, 0.95);
border: 1px solid rgba(255, 255, 255, 0.2);
padding: 1rem;
border-radius: 8px;
color: #fff;
min-width: 250px;
text-align: center;

.points-info {
display: flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
margin-bottom: 0.5rem;

.points-value {
  color: #ffd700;
  font-weight: 500;
}

.points-separator {
  opacity: 0.5;
}
}

.points-bar {
height: 4px;
background: rgba(255, 255, 255, 0.1);
border-radius: 2px;
overflow: hidden;
margin-bottom: 0.5rem;
}

.points-progress {
height: 100%;
background: #ffd700;
transition: width 0.3s ease;
}

.points-stats {
font-size: 0.9rem;
opacity: 0.8;
}
}

@media (max-width: 768px) {
.skill-node {
width: 50px;
height: 50px;

.node-icon {
  font-size: 20px;
}
}

.skill-tooltip {
min-width: 200px;

h3 {
  font-size: 1rem;
}
}

.points-display {
min-width: 200px;
padding: 0.75rem;
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

.points-display {
min-width: 180px;
padding: 0.5rem;
}
}
</style>