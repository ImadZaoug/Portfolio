# frontend/src/views/HomeView.vue
<template>
  <div class="home" :class="{ 'theme--dark': isDark }">
    <!-- Main Content -->
    <div 
      class="avatar-sidebar" 
      :class="{ 
        'avatar-right': isAvatarRight, 
        'blurred': isProfileExpanded || isSolutionExpanded || isInventoryExpanded
      }"
    >
      <!-- Avatar is now handled in App.vue -->
    </div>
    <div 
      class="main-content" 
      :class="{ 
        'content-left': isAvatarRight, 
        'blurred': isProfileExpanded || isSolutionExpanded || isInventoryExpanded
      }"
    >
      <ProfileSlider 
        @section-change="handleSectionChange"
        @animation-start="handleAnimationStart"
        @animation-complete="handleAnimationComplete"
        @fullscreen-change="handleFullscreenChange"
        @solution-expand="handleSolutionExpand"
        :is-fullscreen="isSkillTreeFullscreen"
        :disabled="isAnimating || isProfileExpanded || isSolutionExpanded || isInventoryExpanded"
        @profile-expand="handleProfileExpand"
        :is-solution-expanded="isSolutionExpanded"
      />
    </div>

    <!-- Full Profile Overlay -->
    <transition name="overlay">
      <div v-if="isProfileExpanded" class="overlay-base profile-overlay" @click="handleProfileExpand(false)">
        <div class="overlay-content" @click.stop>
          <v-card class="detail-card profile-detail-card" :class="{ 'theme--dark': isDark }">
            <v-card-title class="d-flex justify-space-between align-center pa-6">
              <h2 class="text-h4">Complete Profile</h2>
              <v-btn 
                icon="mdi-close" 
                variant="text" 
                size="large" 
                @click="handleProfileExpand(false)" 
                class="close-btn"
              />
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <ProfileDetail />
            </v-card-text>
          </v-card>
        </div>
      </div>
    </transition>

    <!-- Inventory Overlay -->
    <transition name="overlay">
      <div v-if="isInventoryExpanded" class="overlay-base inventory-overlay" @click="handleInventoryExpand(false)">
        <div class="overlay-content" @click.stop>
          <v-card class="detail-card inventory-detail-card" :class="{ 'theme--dark': isDark }">
            <v-card-title class="d-flex justify-space-between align-center pa-6">
              <h2 class="text-h4">Character Inventory</h2>
              <v-btn 
                icon="mdi-close" 
                variant="text" 
                size="large" 
                @click="handleInventoryExpand(false)" 
                class="close-btn"
              />
            </v-card-title>
            <!-- Rarity Legend with original styling -->
            <div class="rarity-legend" :class="{ 'theme--dark': isDark }">
              <div class="legend-title">Skill Grades:</div>
              <div class="legend-items">
                <div class="legend-item common">
                  <div class="color-dot"></div>
                  <span>Common</span>
                </div>
                <div class="legend-item rare">
                  <div class="color-dot"></div>
                  <span>Rare</span>
                </div>
                <div class="legend-item legendary">
                  <div class="color-dot"></div>
                  <span>Legendary</span>
                </div>
                <div class="legend-item mythical">
                  <div class="color-dot"></div>
                  <span>Mythical</span>
                </div>
              </div>
            </div>
            <v-divider />
            <v-card-text class="pa-6">
              <InventoryDetails />
            </v-card-text>
          </v-card>
        </div>
      </div>
    </transition>

    <!-- Solution Detail Overlay -->
    <SolutionDetail
      v-if="isSolutionExpanded"
      :solution="selectedSolution"
      @close="handleSolutionExpand({ expanded: false })"
    />

    <!-- Skills Tree Overlay -->
    <transition name="overlay">
      <div 
        v-if="isSkillTreeFullscreen" 
        class="overlay-base skills-overlay"
      >
        <div class="overlay-content">
          <ProfileSlider 
            :is-fullscreen="true"
            :initial-section="4"
            :disable-navigation="true"
            @fullscreen-change="handleFullscreenChange"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ProfileSlider from '@/components/ProfileSlider.vue'
import ProfileDetail from '@/components/ProfileDetail.vue'
import SolutionDetail from '@/components/SolutionDetail.vue'
import InventoryDetails from '@/components/InventoryDetails.vue'

export default defineComponent({
  name: 'HomeView',
  
  components: {
    ProfileSlider,
    ProfileDetail,
    SolutionDetail,
    InventoryDetails
  },

  emits: ['section-change', 'animation-start', 'animation-complete'],
  
  setup() {
    const themeStore = useThemeStore()
    return { 
      themeStore,
      isDark: computed(() => themeStore.isDark)
    }
  },
  
  data() {
    return {
      currentSection: 0,
      isAnimating: false,
      isSkillTreeFullscreen: false,
      isProfileExpanded: false,
      isInventoryExpanded: false,
      isSolutionExpanded: false,
      selectedSolution: null
    }
  },
  
  computed: {
    isAvatarRight() {
      return this.currentSection % 2 === 1
    }
  },
  
  watch: {
    isProfileExpanded(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : ''
    },
    isInventoryExpanded(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : ''
    },
    isSkillTreeFullscreen(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : ''
    },
    isSolutionExpanded(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : ''
    }
  },
  
  methods: {
    handleSectionChange(section) {
      this.currentSection = section
      this.$emit('section-change', section)
    },
    
    handleAnimationStart(event) {
      this.isAnimating = true
      this.$emit('animation-start', event)
    },
    
    handleAnimationComplete() {
      this.isAnimating = false
      this.$emit('animation-complete')
    },
    
    handleFullscreenChange(isFullscreen) {
      this.isSkillTreeFullscreen = isFullscreen
    },

    handleProfileExpand(expanded) {
      this.isProfileExpanded = expanded
      if (expanded) {
        this.isSolutionExpanded = false
        this.isInventoryExpanded = false
        this.selectedSolution = null
      }
    },

    handleInventoryExpand(expanded) {
      this.isInventoryExpanded = expanded
      if (expanded) {
        this.isProfileExpanded = false
        this.isSolutionExpanded = false
        this.selectedSolution = null
      }
    },

    handleSolutionExpand({ expanded, solution }) {
      this.isSolutionExpanded = expanded
      this.selectedSolution = expanded ? solution : null
      if (expanded) {
        this.isProfileExpanded = false
        this.isInventoryExpanded = false
      }
    }
  },
  
  beforeUnmount() {
    document.body.style.overflow = ''
  }
})
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: var(--v-theme-background);
  transition: background-color 0.3s ease;
}

.avatar-sidebar {
  width: 200px;
  height: 100vh;
  position: relative;
  transition: all 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  &.avatar-right {
    order: 2;
  }

  &.blurred {
    filter: blur(8px);
    pointer-events: none;
  }
}

.main-content {
  flex: 1;
  height: 100vh;
  transition: all 0.5s ease-in-out;
  padding: 0 2rem;
  overflow: hidden;
  position: relative;
  z-index: 1;

  &.content-left {
    order: 1;
  }

  &.blurred {
    filter: blur(8px);
    pointer-events: none;
  }
}

// Base overlay styles
.overlay-base {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  .overlay-content {
    width: 98%;
    height: 98%;
    max-width: 1800px;
    position: relative;
    transform-origin: center;
    transition: transform 0.3s ease-in-out;
    display: flex;
  }

  &.profile-overlay,
  &.inventory-overlay {
    .overlay-content {
      overflow: visible;
    }
  }
}

// Card styles with updated dark mode
.detail-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  
  &.profile-detail-card {
    background: var(--v-theme-surface) !important;
    color: var(--v-theme-on-surface);

    &.theme--dark {
      background: rgb(30, 30, 30) !important;
      color: rgba(255, 255, 255, 0.87);
    }

    .v-card-text {
      background: transparent !important;
      overflow-y: auto;
      flex: 1;
      
      &::-webkit-scrollbar {
        width: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(var(--v-theme-on-surface), 0.1);
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: var(--v-theme-primary);
        border-radius: 4px;
        
        &:hover {
          background: var(--v-theme-secondary);
        }
      }
    }
  }

  &.inventory-detail-card {
    background: white !important; // Force white background in light mode
    color: rgba(0, 0, 0, 0.87) !important; // Force dark text in light mode

    &.theme--dark {
      background: rgb(30, 30, 30) !important; // Force dark background in dark mode
      color: rgba(255, 255, 255, 0.87) !important; // Force light text in dark mode

      .v-card-title {
        background: rgb(30, 30, 30) !important;
        color: rgba(255, 255, 255, 0.87) !important;
        border-color: rgba(255, 255, 255, 0.12);
      }

      .v-card-text {
        background: rgb(30, 30, 30) !important;
        color: rgba(255, 255, 255, 0.87) !important;
      }
    }
    
    .v-card-title {
      padding: 0.5rem 1.25rem !important;
      min-height: 48px;
      background: var(--v-theme-surface);
      color: var(--v-theme-on-surface);
      border-bottom: 1px solid var(--v-theme-border-color);

      h2 {
        font-size: 1.25rem;
        margin: 0;
        color: var(--v-theme-on-surface);
      }
    }

    .v-card-text {
      background: var(--v-theme-surface) !important;
      color: var(--v-theme-on-surface) !important;
      overflow-y: auto;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      flex: 1;

      &::-webkit-scrollbar {
        width: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(var(--v-theme-on-surface), 0.1);
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: var(--v-theme-primary);
        border-radius: 4px;
        
        &:hover {
          background: var(--v-theme-secondary);
        }
      }
    }
  }

  .close-btn {
    transition: transform 0.3s ease;
    color: var(--v-theme-on-surface) !important;

    &:hover {
      transform: rotate(90deg);
    }
  }
}

// Rarity Legend styles
.rarity-legend {
  position: relative;
  z-index: 1;
  margin: 0.25rem 1rem;
  padding: 0.25rem 0.75rem;
  background: var(--v-theme-surface);
  border-radius: 8px;
  display: flex;
  align-items: center;
  height: 28px;
  gap: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);

  &.theme--dark {
    background: rgba(40, 40, 40, 0.7);
    color: rgba(255, 255, 255, 0.87);
    border-color: rgba(255, 255, 255, 0.1);

    .legend-item {
      background: rgba(50, 50, 50, 0.9);
      color: rgba(255, 255, 255, 0.87);
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  .legend-title {
    font-weight: 500;
    font-size: 0.85rem;
    white-space: nowrap;
    color: inherit;
  }

  .legend-items {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    span {
      color: inherit;
    }

    .color-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    &.common .color-dot {
      background: linear-gradient(45deg, #C0C0C0, #A8A8A8);
    }

    &.rare .color-dot {
      background: linear-gradient(45deg, #9C27B0, #7B1FA2);
      box-shadow: 0 0 5px rgba(156, 39, 176, 0.3);
    }

    &.legendary .color-dot {
      background: linear-gradient(45deg, #FFD700, #FFA500);
      box-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
    }

    &.mythical .color-dot {
      background: #000;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      animation: mythicalPulse 2s infinite;
    }
  }
}

// Animation keyframes
@keyframes mythicalPulse {
  0% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
  50% { box-shadow: 0 0 8px rgba(0, 0, 0, 0.7); }
  100% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
}

// Transition animations
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;

  .overlay-content {
    transition: all 0.3s ease;
  }
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;

  .overlay-content {
    transform: scale(0.95);
  }
}

// Equipment section styles
.equipment-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0.75rem;
}

.equipment-grid {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0.5rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.equipment-slot {
  position: absolute;
  z-index: 2;
  transform-origin: center;
  transition: transform 0.3s ease;

  .slot-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    position: relative;
    background: rgba(var(--v-theme-surface-variant), 0.1);
    border: 2px dashed var(--v-theme-primary);
    transition: all 0.3s ease;
    cursor: pointer;

    &.equipped {
      border-style: solid;
      background: rgba(var(--v-theme-primary), 0.1);
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.2);
    }
  }
}

// Responsive styles
@media (max-width: 1200px) {
  .overlay-base {
    padding: 0.5rem;
  }

  .equipment-grid {
    width: 380px;
    height: 380px;
  }

  .equipment-slot .slot-container {
    width: 52px;
    height: 52px;
  }

  .rarity-legend {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem 0.75rem;

    .legend-items {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .avatar-sidebar {
    width: 140px;
  }

  .main-content {
    padding: 0 1rem;
  }

  .overlay-base {
    padding: 0.25rem;
  }

  .equipment-grid {
    width: 340px;
    height: 340px;
  }

  .equipment-slot .slot-container {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 576px) {
  .avatar-sidebar {
    width: 120px;
  }

  .main-content {
    padding: 0 0.5rem;
  }

  .overlay-base {
    padding: 0;
  }

  .overlay-content {
    width: 100%;
    height: 100%;
  }

  .detail-card {
    border-radius: 0;
  }

  .rarity-legend {
    margin: 0.25rem 0.5rem;
  }
}

// Print styles
@media print {
  .overlay-base {
    position: relative;
    background: none;
    padding: 0;
  }

  .equipment-section {
    page-break-inside: avoid;
  }

  .rarity-legend {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>