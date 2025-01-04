# frontend/src/App.vue
<template>
  <v-app :theme="theme">
    <GameHeader 
      :current-section="currentSection"
      @navigate="handleNavigation"
      @theme-transition-start="handleThemeTransitionStart"
    />
    <v-main>
      <HomeView 
        @animation-start="handleAnimationStart"
        @animation-complete="handleAnimationComplete"
        @section-change="handleSectionChange"
      />
    </v-main>
    <ThreeDAvatar 
      ref="avatar"
      :current-section="currentSection"
      :position="currentSection % 2 === 1 ? 'right' : 'left'"
      @animation-complete="handleAnimationComplete"
    />
  </v-app>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import GameHeader from '@/components/GameHeader.vue'
import ThreeDAvatar from '@/components/ThreeDAvatar.vue'
import HomeView from '@/views/HomeView.vue'

export default {
  name: 'App',
  
  components: {
    GameHeader,
    ThreeDAvatar,
    HomeView
  },
  
  setup() {
    const themeStore = useThemeStore()
    const currentSection = ref(0)
    const avatar = ref(null)
    const isAnimating = ref(false)
    
    onMounted(() => {
      themeStore.initializeTheme()
    })

    const handleNavigation = (section) => {
      currentSection.value = section
    }

    const handleThemeTransitionStart = () => {
      if (avatar.value) {
        avatar.value.startThemeAnimation()
      }
    }

    const handleAnimationStart = (event) => {
      isAnimating.value = true
      if (avatar.value) {
        avatar.value.handleAnimationEvent(event)
      }
    }

    const handleAnimationComplete = () => {
      isAnimating.value = false
    }

    const handleSectionChange = (section) => {
      currentSection.value = section
    }

    return {
      theme: computed(() => themeStore.isDark ? 'dark' : 'light'),
      currentSection,
      avatar,
      handleNavigation,
      handleThemeTransitionStart,
      handleAnimationStart,
      handleAnimationComplete,
      handleSectionChange
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

/* Theme transition styles */
.theme-transition-enter-active,
.theme-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.theme-transition-enter-from,
.theme-transition-leave-to {
  opacity: 0;
}

/* Theme-specific Vuetify class overrides */
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