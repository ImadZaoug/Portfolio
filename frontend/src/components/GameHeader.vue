# frontend/src/components/GameHeader.vue
<template>
  <v-app-bar class="game-header px-4" flat>
    <div class="d-flex align-center justify-space-between w-100">
      <!-- Left side - Theme toggle -->
      <v-btn
        icon
        @click="toggleTheme"
        :color="isDark ? 'yellow-darken-2' : 'blue-darken-2'"
        class="theme-btn"
      >
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>

      <!-- Center - Main Navigation -->
      <div class="d-flex align-center">
        <v-btn
          v-for="(item, index) in menuItems"
          :key="index"
          class="mx-2 game-btn"
          :class="{ 'active': currentSection === item.value }"
          @click="handleNavigation(item.value)"
        >
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </div>

      <!-- Right side - Inventory -->
      <v-menu v-model="inventoryMenu" location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            class="inventory-btn"
            :class="{ 'active': inventoryMenu }"
          >
            <v-icon>mdi-bag-personal</v-icon>
          </v-btn>
        </template>

        <v-card class="inventory-panel">
          <v-tabs
            v-model="activeInventoryTab"
            color="primary"
            align-tabs="center"
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
                          class="skill-btn"
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
                          class="interest-btn"
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

  props: {
    currentSection: {
      type: Number,
      default: 0
    }
  },

  emits: ['navigate', 'theme-transition-start'],

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

    const handleNavigation = (section) => {
      emit('navigate', section)
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
      isTransitioning.value = true

      // Emit event to start avatar animation immediately
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

      // Start the theme transition animation
      const maxInitialCoverage = Math.floor(totalBoxes * 0.3)
      let coveredBoxes = new Set()
      
      const numInitialCracks = Math.floor(totalBoxes * 0.1)
      
      // Phase 1: Initial cracks (0-2250ms)
      for (let i = 0; i < numInitialCracks && coveredBoxes.size < maxInitialCoverage; i++) {
        const startTime = Math.random() * 2250
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

      // Phase 2: Rapid spread (2250-2850ms)
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

      // Phase 3: Final spread and theme switch (2850-3000ms)
      setTimeout(() => {
        document.body.classList.remove('theme-transition-trembling')
        
        const overlay = document.createElement('div')
        overlay.className = 'theme-overlay'
        container.appendChild(overlay)

        // Switch theme in Vuetify after the animation
        setTimeout(() => {
          // Apply theme changes simultaneously
          document.body.classList.toggle('dark-theme')
          themeStore.toggleTheme()
          
          // Clear animation container
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
      handleNavigation,
      toggleTheme
    }
  }
})
</script>

<style lang="scss" scoped>
.game-header {
  background: rgba(var(--v-theme-surface-variant), 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 2px solid var(--v-theme-primary);
}

.game-btn {
  position: relative;
  min-width: 120px;
  height: 48px;
  padding: 0 20px;
  border: 2px solid var(--v-theme-primary);
  background: rgba(var(--v-theme-surface), 0.9) !important;
  color: var(--v-theme-primary) !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background: rgba(var(--v-theme-primary), 0.1) !important;
  }

  &.active {
    background: var(--v-theme-primary) !important;
    color: var(--v-theme-on-primary) !important;
  }

  .v-icon {
    margin-right: 8px;
  }
}

.theme-btn, .inventory-btn {
  width: 48px;
  height: 48px;
  border: 2px solid currentColor;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(15deg);
  }

  &.active {
    background: var(--v-theme-primary) !important;
    color: var(--v-theme-on-primary) !important;
  }
}

.inventory-panel {
  width: 320px;
  border: 2px solid var(--v-theme-primary);
  background: rgba(var(--v-theme-surface), 0.95) !important;
  backdrop-filter: blur(10px);
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
  border: 2px solid currentColor;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 768px) {
  .game-btn {
    min-width: auto;
    padding: 0 12px;

    .v-btn__content span {
      display: none;
    }

    .v-icon {
      margin-right: 0;
    }
  }
}
</style>