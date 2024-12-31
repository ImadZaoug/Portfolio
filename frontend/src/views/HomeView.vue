//frontend/src/views/HomeView.vue
<template>
  <div class="home">
    <div class="avatar-sidebar">
      <ThreeDAvatar :current-section="currentSection" />
    </div>
    <div class="main-content">
      <ProfileSlider @section-change="handleSectionChange" />
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
      currentSection: 0
    }
  },
  methods: {
    handleSectionChange(section) {
      this.currentSection = section
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
  width: 250px;  /* Reduced from 350px */
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

.main-content {
  flex: 1;
  margin-left: 250px;  /* Matches sidebar width */
  height: 100vh;
}
</style>