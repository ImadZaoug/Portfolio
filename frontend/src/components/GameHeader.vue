<template>
  <v-app-bar class="game-header px-4" flat>
    <div class="d-flex align-center justify-space-between w-100">
      <!-- Left side - Theme toggles -->
      <div class="d-flex align-center gap-2">
        <!-- Theme Toggle -->
        <v-btn
          icon
          @click="toggleTheme"
          class="theme-btn glass-effect"
          :class="{ 'dark': isDark }"
        >
          <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
        </v-btn>

        <!-- Cave Mode Toggle (only in light mode) -->
        <v-btn
          v-if="!isDark"
          icon
          @click="caveStore.toggleCaveMode"
          class="cave-mode-btn glass-effect"
          :class="{ 'active': caveStore.isCaveMode }"
        >
          <v-icon>{{ caveStore.isCaveMode ? 'mdi-flashlight' : 'mdi-flashlight-off' }}</v-icon>
          <div class="btn-glow"></div>
          <v-tooltip
            activator="parent"
            location="bottom"
            :open-delay="200"
          >
            {{ caveStore.isCaveMode ? 'Disable Torch Mode' : 'Enable Torch Mode' }}
          </v-tooltip>
        </v-btn>
      </div>

      <!-- Center - Main Navigation -->
      <div class="d-flex align-center nav-group">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="nav-btn-wrapper"
        >
          <v-btn
            class="mx-2 nav-btn glass-effect"
            :disabled="item.disabled"
            @click="handleNavClick(item.value)"
          >
            <div class="btn-content">
              <v-icon start class="nav-icon">{{ item.icon }}</v-icon>
              <span class="nav-text">{{ item.title }}</span>
            </div>
            <div class="btn-glow"></div>
          </v-btn>
          <v-tooltip
            v-if="item.disabled"
            :key="'tooltip-' + index"
            activator="parent"
            location="bottom"
            :open-delay="200"
          >
            Coming Soon
          </v-tooltip>
        </div>
      </div>

      <!-- Right side - Inventory -->
      <v-btn
        icon
        class="inventory-btn glass-effect"
        @click="handleInventoryClick"
      >
        <v-icon>mdi-bag-personal</v-icon>
        <div class="btn-glow"></div>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useCaveStore } from '@/stores/cave'

export default defineComponent({
  name: 'GameHeader',

  emits: ['theme-transition-start', 'inventory-expand', 'skills-expand'],

  setup(props, { emit }) {
    const themeStore = useThemeStore()
    const caveStore = useCaveStore()
    const isTransitioning = ref(false)

    const menuItems = [
      { title: 'Game Mode', icon: 'mdi-gamepad-variant', value: 0, disabled: true },
      { title: 'Skills', icon: 'mdi-sword-cross', value: 1, disabled: false },
      { title: 'Quests', icon: 'mdi-compass', value: 2, disabled: true }
    ]

    const handleNavClick = (value) => {
      if (value === 1) {
        emit('skills-expand', true)
      }
    }

    const handleInventoryClick = () => {
      emit('inventory-expand', true)
    }

    const createLightningPath = (startX, startY, width, intensity = 1) => {
      const path = []
      let x = startX
      let y = startY
      path.push(`M ${x} ${y}`)

      const numSegments = Math.floor(Math.random() * 5) + 4
      const baseAngle = Math.random() * 360
      
      for (let i = 0; i < numSegments; i++) {
        const angleVariation = (Math.random() * 60 - 30) * intensity
        const angle = (baseAngle + angleVariation) * (Math.PI / 180)
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

    const toggleTheme = async () => {
      if (isTransitioning.value) return

      // Disable cave mode if active when switching to dark theme
      if (caveStore.isCaveMode) {
        caveStore.toggleCaveMode()
      }
      
      isTransitioning.value = true
      emit('theme-transition-start')

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

      setTimeout(() => {
        document.body.classList.remove('theme-transition-trembling')
        
        const overlay = document.createElement('div')
        overlay.className = 'theme-overlay'
        container.appendChild(overlay)

        setTimeout(() => {
          document.body.classList.toggle('dark-theme')
          themeStore.toggleTheme()
          container.innerHTML = ''
          isTransitioning.value = false
        }, 150)
      }, 2850)
    }

    return {
      menuItems,
      isDark: computed(() => themeStore.isDark),
      caveStore,
      toggleTheme,
      handleNavClick,
      handleInventoryClick
    }
  }
})
</script>

<style lang="scss" scoped>
.game-header {
  background: rgba(var(--v-theme-surface-variant), 0.3) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 24px 24px;
  margin: 0 12px;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

.nav-btn-wrapper {
  position: relative;
  cursor: pointer;

  &:hover {
    .nav-btn {
      transform: translateY(-2px);
    }
  }
}

.nav-btn {
  position: relative;
  min-width: 120px;
  height: 48px;
  padding: 0 20px;
  opacity: 0.8;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.7 !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 1;
  }

  .nav-icon {
    font-size: 1.2rem;
    transition: all 0.3s ease;
    opacity: 0.9;
  }

  .nav-text {
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    opacity: 0.9;
  }

  .btn-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(var(--v-theme-primary), 0.3) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
    pointer-events: none;
  }
}

.nav-btn-wrapper:hover .btn-glow {
  transform: translate(-50%, -50%) scale(1);
}

.theme-btn, .inventory-btn, .cave-mode-btn {
  width: 48px;
  height: 48px;
  position: relative;
  overflow: hidden;
  z-index: 2;

  &:hover {
    transform: rotate(15deg);
  }

  &.active {
    background: rgba(var(--v-theme-primary), 0.2) !important;
    border-color: rgba(var(--v-theme-primary), 0.5);
  }

  .btn-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(var(--v-theme-primary), 0.3),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .btn-glow {
    opacity: 1;
  }
}

.cave-mode-btn {
  &.active {
    background: rgba(255, 193, 7, 0.2) !important;
    border-color: rgba(255, 193, 7, 0.5);

    .v-icon {
      color: #ffc107 !important;
      filter: drop-shadow(0 0 5px rgba(255, 193, 7, 0.5));
    }
  }

  &:disabled {
    display: none;
  }
}

@media (max-width: 768px) {
  .nav-btn {
    min-width: auto;
    padding: 0 12px;

    .nav-text {
      display: none;
    }

    .nav-icon {
      margin-right: 0;
    }
  }

  .theme-btn, .inventory-btn, .cave-mode-btn {
    width: 42px;
    height: 42px;
  }
}

@media (max-width: 576px) {
  .game-header {
    margin: 0 6px;
  }

  .nav-group {
    gap: 0.5rem;
  }

  .theme-btn, .inventory-btn, .cave-mode-btn {
    width: 38px;
    height: 38px;
  }
}

@media print {
  .cave-mode-btn {
    display: none !important;
  }
}
</style>