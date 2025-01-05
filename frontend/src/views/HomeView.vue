# frontend/src/views/HomeView.vue
<template>
  <div class="home">
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
          <v-card class="detail-card profile-detail-card">
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
          <v-card class="detail-card inventory-detail-card">
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
import { defineComponent } from 'vue'
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
    return { themeStore }
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
  padding: 2rem;
}

.overlay-content {
  width: 90%;
  height: 90%;
  max-width: 1600px;
  position: relative;
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
}

// Card styles
.detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;

  &.profile-detail-card {
    background: transparent !important;

    .v-card-text {
      background: transparent !important;
    }
  }

  &.inventory-detail-card {
    background: white !important;

    .v-card-text {
      background: white !important;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    // Dark theme override
    .theme--dark & {
      .v-card-title {
        background: rgb(40, 40, 40);
        color: white;
      }
    }
  }

  .v-card-text {
    flex: 1;
    overflow-y: auto;
    
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

// Animation
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

// Responsive styles
@media (max-width: 1200px) {
  .avatar-sidebar {
    width: 180px;
  }

  .overlay-base {
    padding: 1.5rem;
  }
}

@media (max-width: 992px) {
  .avatar-sidebar {
    width: 160px;
  }

  .main-content {
    padding: 0 1.5rem;
  }

  .overlay-base {
    padding: 1rem;
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
    padding: 0.5rem;
  }

  .overlay-content {
    width: 95%;
    height: 95%;
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
}

// Print styles
@media print {
  .home {
    height: auto;
    overflow: visible;
  }

  .avatar-sidebar {
    display: none;
  }

  .main-content {
    padding: 2rem;
  }

  .overlay-base {
    display: none;
  }

  .blurred {
    filter: none !important;
  }
}
</style>