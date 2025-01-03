<template>
  <v-app :theme="theme">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

export default {
  name: 'App',
  setup() {
    const themeStore = useThemeStore()
    return {
      theme: computed(() => themeStore.isDark ? 'dark' : 'light')
    }
  }
}
</script>

<style lang="scss">
// Only include critical styles here
.v-application {
  background: transparent !important;
}

.v-main {
  background: transparent !important;
}
</style>