<template>
  <div class="home">
    <ProfileSlider @section-change="handleSectionChange" />
    <InteractiveAvatar :current-section="currentSection" />
  </div>
</template>

<script>
import ProfileSlider from '@/components/ProfileSlider.vue'
import InteractiveAvatar from '@/components/InteractiveAvatar.vue'

export default {
  name: 'HomeView',
  components: {
    ProfileSlider,
    InteractiveAvatar
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

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
}
</style>