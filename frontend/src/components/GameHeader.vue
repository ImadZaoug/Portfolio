# frontend/src/components/GameHeader.vue
<template>
  <v-app-bar class="game-header px-4" flat>
    <div class="d-flex align-center justify-space-between w-100">
      <!-- Left side - Theme toggle -->
      <v-btn
        icon
        @click="toggleTheme"
        class="theme-btn glass-effect"
        :class="{ 'dark': isDark }"
      >
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>

      <!-- Center - Main Navigation -->
      <div class="d-flex align-center nav-group">
        <v-btn
          v-for="(item, index) in menuItems"
          :key="index"
          class="mx-2 nav-btn glass-effect"
          disabled
        >
          <div class="btn-content">
            <v-icon start class="nav-icon">{{ item.icon }}</v-icon>
            <span class="nav-text">{{ item.title }}</span>
          </div>
          <div class="btn-glow"></div>
        </v-btn>
      </div>

      <!-- Right side - Inventory -->
      <v-menu v-model="inventoryMenu" location="bottom end" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            class="inventory-btn glass-effect"
            :class="{ 'active': inventoryMenu }"
          >
            <v-icon>mdi-bag-personal</v-icon>
            <div class="btn-glow"></div>
          </v-btn>
        </template>

        <v-card class="inventory-panel glass-effect">
          <v-tabs
            v-model="activeInventoryTab"
            color="primary"
            align-tabs="center"
            class="tab-header"
          >
            <v-tab value="softskills">Soft Skills</v-tab>
            <v-tab value="interests">Interests</v-tab>
          </v-tabs>

          <v-window v-model="activeInventoryTab">
            <v-window-item value="softskills">
              <v-card-text>
                <div class="inventory-grid">
                  <div v-for="(skill, index) in softSkills" :key="index" class="inventory-item">
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          size="x-large"
                          :color="skill.color"
                          class="skill-btn glass-effect"
                        >
                          <v-icon>{{ skill.icon }}</v-icon>
                        </v-btn>
                      </template>
                      {{ skill.name }}
                    </v-tooltip>
                  </div>
                </div>
              </v-card-text>
            </v-window-item>

            <v-window-item value="interests">
              <v-card-text>
                <div class="inventory-grid">
                  <div v-for="(interest, index) in interests" :key="index" class="inventory-item">
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon
                          size="x-large"
                          :color="interest.color"
                          class="interest-btn glass-effect"
                        >
                          <v-icon>{{ interest.icon }}</v-icon>
                        </v-btn>
                      </template>
                      {{ interest.name }}
                    </v-tooltip>
                  </div>
                </div>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

export default defineComponent({
  name: 'GameHeader',

  emits: ['theme-transition-start'],

  setup(props, { emit }) {
    const themeStore = useThemeStore()
    const isTransitioning = ref(false)
    const inventoryMenu = ref(false)
    const activeInventoryTab = ref('softskills')

    const menuItems = [
      { title: 'Game Mode', icon: 'mdi-gamepad-variant', value: 0 },
      { title: 'Quests', icon: 'mdi-compass', value: 1 },
      { title: 'Skills', icon: 'mdi-sword-cross', value: 2 }
    ]

    const softSkills = [
      { name: 'Leadership', icon: 'mdi-account-group', color: 'blue' },
      { name: 'Communication', icon: 'mdi-message-text', color: 'green' },
      { name: 'Problem Solving', icon: 'mdi-puzzle', color: 'purple' },
      { name: 'Teamwork', icon: 'mdi-account-multiple', color: 'orange' },
      { name: 'Adaptability', icon: 'mdi-rotate-3d-variant', color: 'cyan' },
      { name: 'Time Management', icon: 'mdi-clock-time-four', color: 'pink' }
    ]

    const interests = [
      { name: 'Gaming', icon: 'mdi-controller', color: 'deep-purple' },
      { name: 'Technology', icon: 'mdi-laptop', color: 'blue-grey' },
      { name: 'Reading', icon: 'mdi-book-open-page-variant', color: 'brown' },
      { name: 'Music', icon: 'mdi-music', color: 'red' },
      { name: 'Travel', icon: 'mdi-airplane', color: 'light-blue' },
      { name: 'Photography', icon: 'mdi-camera', color: 'amber' }
    ]

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
      softSkills,
      interests,
      inventoryMenu,
      activeInventoryTab,
      isDark: themeStore.isDark,
      toggleTheme
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

.nav-btn {
  position: relative;
  min-width: 120px;
  height: 48px;
  padding: 0 20px;
  overflow: hidden;
  opacity: 0.8;

  &:disabled {
    opacity: 0.8 !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    cursor: default;
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

.theme-btn, .inventory-btn {
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

.inventory-panel {
  width: 320px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  background: rgba(var(--v-theme-surface), 0.95) !important;
  border-radius: 16px;
  overflow: hidden;

  .tab-header {
    background: rgba(var(--v-theme-surface-variant), 0.1);
    border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
  }
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.inventory-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.skill-btn, .interest-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1) !important;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
}
</style>