// frontend/src/views/HomeView.vue
<template>
  <div class="home">
    <div 
      class="avatar-sidebar" 
      :class="{ 'avatar-right': isAvatarRight }"
    >
      <ThreeDAvatar 
        ref="avatar"
        :current-section="currentSection"
        :position="isAvatarRight ? 'right' : 'left'"
        @animation-complete="handleAnimationComplete"
      />
    </div>
    <div 
      class="main-content" 
      :class="{ 'content-left': isAvatarRight }"
    >
      <ProfileSlider 
        @section-change="handleSectionChange"
        @animation-start="handleAnimationStart"
        @animation-complete="handleAnimationComplete"
        @fullscreen-change="handleFullscreenChange"
        :is-fullscreen="isSkillTreeFullscreen"
      />
    </div>

    <!-- Fullscreen Skills Overlay -->
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
  </div>
</template>

<script>
import ProfileSlider from '@/components/ProfileSlider.vue'
import ThreeDAvatar from '@/components/ThreeDAvatar.vue'

export default {
  name: 'HomeView',
  components: {
    ProfileSlider,
    ThreeDAvatar
  },
  data() {
    return {
      currentSection: 0,
      isAnimating: false,
      isSkillTreeFullscreen: false
    }
  },
  computed: {
    isAvatarRight() {
      return this.currentSection % 2 === 1
    }
  },
  watch: {
    isSkillTreeFullscreen(newVal) {
      // Handle body scroll lock
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
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
    }
  },
  beforeUnmount() {
    // Cleanup
    document.body.style.overflow = ''
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.avatar-sidebar {
  width: 200px;
  height: 100vh;
  position: relative;
  transition: left 0.5s ease-in-out, right 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  &.avatar-right {
    order: 2;
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
}

// Fullscreen overlay styles
.skills-fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayFadeIn 0.3s ease;
}

.skills-fullscreen-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: contentScaleIn 0.3s ease;
}

// Animations
@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes contentScaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

// Responsive styles
@media (max-width: 992px) {
  .avatar-sidebar {
    width: 180px;
  }

  .main-content {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .avatar-sidebar {
    width: 150px;
  }

  .main-content {
    padding: 0 0.8rem;
  }
}

@media (max-width: 576px) {
  .avatar-sidebar {
    width: 120px;
  }

  .main-content {
    padding: 0 0.5rem;
  }
}

// Print styles
@media print {
  .skills-fullscreen-overlay {
    display: none;
  }

  .avatar-sidebar {
    display: none;
  }

  .main-content {
    margin: 0;
    padding: 2rem;
  }
}
</style>