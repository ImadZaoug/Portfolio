//frontend/src/views/HomeView.vue
<template>
  <div class="home">
    <div class="avatar-sidebar" :class="{ 'avatar-right': isAvatarRight }">
      <ThreeDAvatar 
        ref="avatar"
        :current-section="currentSection"
        :position="isAvatarRight ? 'right' : 'left'"
        @animation-complete="handleAnimationComplete"
      />
    </div>
    <div class="main-content" :class="{ 'content-left': isAvatarRight }">
      <ProfileSlider 
        @section-change="handleSectionChange"
        @animation-start="handleAnimationStart"
        @animation-complete="handleAnimationComplete"
      />
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
      isAnimating: false
    }
  },
  computed: {
    isAvatarRight() {
      return this.currentSection % 2 === 1
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
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.avatar-sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  transition: left 0.5s ease-in-out, right 0.5s ease-in-out;
}

.avatar-sidebar.avatar-right {
  left: auto;
  right: 0;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  height: 100vh;
  transition: margin 0.5s ease-in-out;
}

.main-content.content-left {
  margin-left: 0;
  margin-right: 250px;
}
</style>