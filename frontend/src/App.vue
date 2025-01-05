# frontend/src/App.vue
<template>
  <v-app :theme="theme">
    <!-- Header -->
    <GameHeader 
      :current-section="currentSection"
      @navigate="handleNavigation"
      @theme-transition-start="handleThemeTransitionStart"
      @inventory-expand="handleInventoryExpand"
    />

    <!-- Main Content -->
    <v-main>
      <HomeView 
        ref="homeView"
        @animation-start="handleAnimationStart"
        @animation-complete="handleAnimationComplete"
        @section-change="handleSectionChange"
      />
    </v-main>

    <!-- Avatar -->
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
    const homeView = ref(null)
    
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

    const handleInventoryExpand = (expanded) => {
      if (homeView.value) {
        homeView.value.handleInventoryExpand(expanded)
      }
    }

    return {
      theme: computed(() => themeStore.isDark ? 'dark' : 'light'),
      currentSection,
      avatar,
      homeView,
      handleNavigation,
      handleThemeTransitionStart,
      handleAnimationStart,
      handleAnimationComplete,
      handleSectionChange,
      handleInventoryExpand
    }
  }
}
</script>

<style lang="scss">
.v-application {
  background: transparent !important;

  .v-main {
    background: transparent !important;
  }
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

  /* Inventory specific overrides for dark theme */
  .inventory-detail-card,
  .inventory-detail-card .v-card-text {
    background-color: white !important;
    color: var(--v-theme-on-surface) !important;
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

/* Theme transition container */
.theme-transition-container {
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;
}

/* Trembling effect */
.theme-transition-trembling {
  animation: tremble 0.1s infinite;
}

@keyframes tremble {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1px, 1px); }
  50% { transform: translate(-1px, -1px); }
  75% { transform: translate(-1px, 1px); }
  100% { transform: translate(1px, -1px); }
}

/* Theme overlay */
.theme-overlay {
  position: absolute;
  inset: 0;
  background: var(--v-theme-background);
  opacity: 0;
  animation: fadeIn 0.15s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Global overlay styles */
.overlay-base {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
}

/* Global card styles */
.detail-card-base {
  width: 90%;
  height: 90%;
  max-width: 1600px;
  background: white !important;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Animation transitions */
.expand-transition-enter-active,
.expand-transition-leave-active {
  transition: all 0.3s ease;

  .overlay-content {
    transition: all 0.3s ease;
  }
}

.expand-transition-enter-from,
.expand-transition-leave-to {
  opacity: 0;

  .overlay-content {
    transform: scale(0.95);
  }
}
.v-tooltip {
  z-index: 9999999 !important;
}

.v-overlay__content {
  z-index: 999999 !important;
}

/* Override Vuetify's default tooltip styles */
:deep(.v-tooltip > .v-overlay__content) {
  background: white !important;
  color: rgba(0, 0, 0, 0.87) !important;
  border: 1px solid var(--v-theme-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  font-size: 0.875rem;
  z-index: 9999999 !important;
}
</style>