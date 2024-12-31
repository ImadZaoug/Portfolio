<template>
    <div class="home">
      <ProfileSlider />
    </div>
  </template>
  
  <script>
  import ProfileSlider from '@/components/ProfileSlider.vue'
  
  export default {
    name: 'HomeView',
    components: {
      ProfileSlider
    }
  }
  </script>
  
  <style scoped>
  .home {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>