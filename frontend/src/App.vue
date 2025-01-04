<template>
  <v-app :theme="theme">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

export default {
  name: 'App',
  setup() {
    const themeStore = useThemeStore()
    
    onMounted(() => {
      themeStore.initializeTheme()
    })

    return {
      theme: computed(() => themeStore.isDark ? 'dark' : 'light')
    }
  }
}
</script>

<style lang="scss">
.v-application {
  background: transparent !important;
}

.v-main {
  background: transparent !important;
}

:root {
  --text-color: var(--v-theme-on-surface-variant);
}

.v-application {
  .v-theme--dark {
    --text-color: var(--v-theme-on-surface-variant);
    
    .theme-text {
      color: var(--v-theme-theme-text) !important;
    }
    
    .name-text {
      color: var(--v-theme-name-text) !important;
    }
    
    .text-h4,
    .text-subtitle-1,
    .text-grey,
    .contact-item span,
    .v-card-text {
      color: var(--v-theme-on-surface-variant) !important;
    }
  }

  .v-theme--light {
    --text-color: var(--v-theme-on-surface-variant);
    
    .theme-text {
      color: var(--v-theme-theme-text) !important;
    }
    
    .name-text {
      color: var(--v-theme-name-text) !important;
    }
    
    .text-h4,
    .text-subtitle-1,
    .text-grey,
    .contact-item span,
    .v-card-text {
      color: var(--v-theme-on-surface-variant) !important;
    }
  }
}

// Transition styles for theme switching
.theme-transition-enter-active,
.theme-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.theme-transition-enter-from,
.theme-transition-leave-to {
  opacity: 0;
}

/* Apply theme colors to specific Vuetify classes */
.v-theme--dark {
  .v-card,
  .v-sheet {
    background-color: var(--v-theme-surface) !important;
    color: var(--v-theme-on-surface) !important;
  }
  
  .v-icon {
    color: var(--v-theme-primary) !important;
  }
}

.v-theme--light {
  .v-card,
  .v-sheet {
    background-color: var(--v-theme-surface) !important;
    color: var(--v-theme-on-surface) !important;
  }
  
  .v-icon {
    color: var(--v-theme-primary) !important;
  }
}
</style>