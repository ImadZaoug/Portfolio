# frontend/src/views/HomeView.vue
<template>
  <div class="home">
    <!-- Main Content -->
    <div 
      class="avatar-sidebar" 
      :class="{ 
        'avatar-right': isAvatarRight, 
        'blurred': isProfileExpanded || isSolutionExpanded 
      }"
    >
      <ThreeDAvatar 
        ref="avatar"
        :current-section="currentSection"
        :position="isAvatarRight ? 'right' : 'left'"
        @animation-complete="handleAnimationComplete"
        @theme-change="handleThemeChange"
      />
    </div>
    <div 
      class="main-content" 
      :class="{ 
        'content-left': isAvatarRight, 
        'blurred': isProfileExpanded || isSolutionExpanded 
      }"
    >
      <ProfileSlider 
        @section-change="handleSectionChange"
        @animation-start="handleAnimationStart"
        @animation-complete="handleAnimationComplete"
        @fullscreen-change="handleFullscreenChange"
        @solution-expand="handleSolutionExpand"
        :is-fullscreen="isSkillTreeFullscreen"
        :disabled="isAnimating || isProfileExpanded || isSolutionExpanded"
        @profile-expand="handleProfileExpand"
        :is-solution-expanded="isSolutionExpanded"
      />
    </div>

    <!-- Full Profile Overlay -->
    <transition name="profile-expand">
      <div v-if="isProfileExpanded" class="profile-overlay" @click="handleProfileExpand(false)">
        <div class="overlay-content" @click.stop>
          <v-card class="profile-detail-card">
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

    <!-- Solution Detail Overlay -->
    <SolutionDetail
      v-if="isSolutionExpanded"
      :solution="selectedSolution"
      @close="handleSolutionExpand({ expanded: false })"
    />

    <!-- Skills Tree Overlay -->
    <transition name="skills-expand">
      <div 
        v-if="isSkillTreeFullscreen" 
        class="skills-fullscreen-overlay"
      >
        <div class="skills-fullscreen-content">
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
import ThreeDAvatar from '@/components/ThreeDAvatar.vue'
import ProfileDetail from '@/components/ProfileDetail.vue'
import SolutionDetail from '@/components/SolutionDetail.vue'

export default defineComponent({
  name: 'HomeView',
  
  components: {
    ProfileSlider,
    ThreeDAvatar,
    ProfileDetail,
    SolutionDetail
  },
  
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
    },
    
    handleAnimationStart(event) {
      this.isAnimating = true
      if (this.$refs.avatar) {
        this.$refs.avatar.handleAnimationEvent(event)
      }
    },
    
    handleAnimationComplete() {
      this.isAnimating = false
    },
    
    handleFullscreenChange(isFullscreen) {
      this.isSkillTreeFullscreen = isFullscreen
    },
    
    handleThemeChange() {
      this.themeStore.toggleTheme()
    },

    handleProfileExpand(expanded) {
      this.isProfileExpanded = expanded
      
      // Close other overlays if opening profile
      if (expanded) {
        this.isSolutionExpanded = false
        this.selectedSolution = null
      }
    },

    handleSolutionExpand({ expanded, solution }) {
      this.isSolutionExpanded = expanded
      this.selectedSolution = expanded ? solution : null
      
      // Close other overlays if opening solution
      if (expanded) {
        this.isProfileExpanded = false
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

// Profile Overlay
.profile-overlay {
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

.profile-detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: var(--v-theme-background);

  .v-card-text {
    flex: 1;
    overflow-y: auto;
    color: var(--v-theme-on-surface) !important;
    
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

  :deep(.v-theme--dark) {
    .text-h4 {
      color: var(--v-theme-primary) !important;
    }
  }

  :deep(.v-theme--light) {
    .text-h4 {
      color: var(--v-theme-primary) !important;
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

// Skills Overlay
.skills-fullscreen-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skills-fullscreen-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Profile Expand Animation
.profile-expand-enter-active,
.profile-expand-leave-active {
  transition: all 0.3s ease;

  .overlay-content {
    transition: all 0.3s ease;
  }
}

.profile-expand-enter-from,
.profile-expand-leave-to {
  opacity: 0;

  .overlay-content {
    transform: scale(0.95);
  }
}

// Skills Expand Animation
.skills-expand-enter-active,
.skills-expand-leave-active {
  transition: all 0.3s ease;
}

.skills-expand-enter-from,
.skills-expand-leave-to {
  opacity: 0;
}

// Responsive styles
@media (max-width: 1200px) {
  .avatar-sidebar {
    width: 180px;
  }

  .profile-overlay {
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

  .profile-overlay {
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

  .profile-overlay {
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

  .profile-overlay {
    padding: 0;
  }

  .overlay-content {
    width: 100%;
    height: 100%;
  }

  .profile-detail-card {
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

  .profile-overlay,
  .skills-fullscreen-overlay {
    display: none;
  }

  .blurred {
    filter: none !important;
  }
}
</style>