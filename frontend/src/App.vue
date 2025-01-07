# frontend/src/App.vue
<template>
  <v-app :theme="theme">
    <!-- Header -->
    <GameHeader 
      :current-section="currentSection"
      @navigate="handleNavigation"
      @theme-transition-start="handleThemeTransitionStart"
      @inventory-expand="handleInventoryExpand"
      @skills-expand="handleSkillsExpand"
    />

    <!-- Main Content -->
    <v-main>
      <HomeView 
        ref="homeView"
        @animation-start="handleAnimationStart"
        @animation-complete="handleAnimationComplete"
        @section-change="handleSectionChange"
        :is-skills-expanded="isSkillsExpanded"
        @skills-expand="handleSkillsExpand"
      />
    </v-main>

    <!-- Avatar -->
    <ThreeDAvatar 
      v-if="currentSection === 0"
      ref="avatar"
      :current-section="currentSection"
      :position="'left'"
      @animation-complete="handleAnimationComplete"
    />

    <!-- Skills Overlay -->
    <transition name="expand-transition">
      <div v-if="isSkillsExpanded" class="overlay-base skills-overlay" @click="handleSkillsExpand(false)">
        <div class="overlay-content" @click.stop>
          <v-card class="detail-card skills-detail-card" :class="{ 'theme--dark': isDark }">
            <v-card-title class="d-flex justify-space-between align-center">
              <h2>Skills Tree</h2>
              <v-btn 
                icon="mdi-close" 
                variant="text" 
                size="large" 
                @click="handleSkillsExpand(false)" 
                class="close-btn"
              />
            </v-card-title>
            <v-divider />
            <v-card-text>
              <SkillTree 
                :initial-skills="skillsStore.technicalSkills"
                :available-points="skillsStore.availablePoints"
                :max-points="skillsStore.maxPoints"
                @unlock-skill="handleSkillUnlock"
                :is-fullscreen="false"
                @fullscreen-change="handleSkillTreeFullscreen"
              />
            </v-card-text>
          </v-card>
        </div>
      </div>
    </transition>

    <!-- Footer -->
    <v-footer 
      class="app-footer" 
      :class="{ 'theme--dark': theme === 'dark' }"
      app
    >
      <div class="footer-content">
        <div class="footer-left">
          <span class="copyright">© {{ new Date().getFullYear() }} Portfolio. All rights reserved.</span>
        </div>
        <div class="footer-center">
          <span class="made-with">Made with ❤️</span>
        </div>
        <div class="footer-right">
          <v-btn
            v-for="(link, index) in socialLinks"
            :key="index"
            :href="link.url"
            target="_blank"
            variant="text"
            icon
            size="small"
            class="social-link"
          >
            <v-icon>{{ link.icon }}</v-icon>
          </v-btn>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useSkillsStore } from '@/stores/skills'
import GameHeader from '@/components/GameHeader.vue'
import ThreeDAvatar from '@/components/ThreeDAvatar.vue'
import HomeView from '@/views/HomeView.vue'
import SkillTree from '@/components/SkillTree.vue'

export default {
  name: 'App',
  
  components: {
    GameHeader,
    ThreeDAvatar,
    HomeView,
    SkillTree
  },
  
  setup() {
    const themeStore = useThemeStore()
    const skillsStore = useSkillsStore()
    const currentSection = ref(0)
    const avatar = ref(null)
    const isAnimating = ref(false)
    const homeView = ref(null)
    const isSkillsExpanded = ref(false)

    // Social media links
    const socialLinks = [
      { icon: 'mdi-github', url: 'https://github.com/ImadZaoug' },
      { icon: 'mdi-linkedin', url: 'https://www.linkedin.com/in/imad-zaoug/' },
      { icon: 'mdi-email', url: 'mailto:imad.zaoug@centrale-casablanca.ma' }
    ]
    
    onMounted(() => {
      themeStore.initializeTheme()
      document.addEventListener('fullscreenchange', handleFullscreenChange)
    })

    onUnmounted(() => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    })

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isSkillsExpanded.value) {
        document.body.style.overflow = 'hidden'
      }
    }

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
        if (expanded) {
          isSkillsExpanded.value = false
        }
      }
    }

    const handleSkillsExpand = (expanded) => {
      isSkillsExpanded.value = expanded
      if (expanded) {
        if (homeView.value && homeView.value.handleInventoryExpand) {
          homeView.value.handleInventoryExpand(false)
        }
        document.body.style.overflow = 'hidden'
      } else {
        if (!document.fullscreenElement) {
          document.body.style.overflow = ''
        }
      }
    }

    const handleSkillUnlock = (skillId) => {
      skillsStore.unlockSkill(skillId)
    }

    const handleSkillTreeFullscreen = (isFullscreen) => {
      if (!isFullscreen && document.fullscreenElement) {
        document.exitFullscreen()
      }
    }

    return {
      theme: computed(() => themeStore.isDark ? 'dark' : 'light'),
      currentSection,
      avatar,
      homeView,
      isSkillsExpanded,
      skillsStore,
      socialLinks,
      handleNavigation,
      handleThemeTransitionStart,
      handleAnimationStart,
      handleAnimationComplete,
      handleSectionChange,
      handleInventoryExpand,
      handleSkillsExpand,
      handleSkillUnlock,
      handleSkillTreeFullscreen
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

  /* Inventory and Skills specific overrides for dark theme */
  .inventory-detail-card,
  .skills-detail-card,
  .inventory-detail-card .v-card-text,
  .skills-detail-card .v-card-text {
    background-color: var(--v-theme-surface) !important;
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
  padding: 1rem;
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

/* Skills overlay specific styles */
.skills-overlay {
  .overlay-content {
    width: 98%;
    height: 98%;
    max-width: 1800px;
    position: relative;
    transform-origin: center;
    transition: transform 0.3s ease-in-out;
    display: flex;
    overflow: visible;
  }

  .skills-detail-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    background: var(--v-theme-surface) !important;

    .v-card-title {
      padding: 0.5rem 1.25rem !important;
      min-height: 48px;
      background: var(--v-theme-surface);
      color: var(--v-theme-on-surface);
      border-bottom: 1px solid var(--v-theme-border-color);

      h2 {
        font-size: 1.25rem;
        margin: 0;
        color: var(--v-theme-on-surface);
      }
    }

    .v-card-text {
      padding: 0.75rem !important;
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--v-theme-surface) !important;
      color: var(--v-theme-on-surface) !important;

      .skill-tree-wrapper {
        flex: 1;
        width: 100%;
        height: 100%;
        min-height: 0;
        background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%);
        border-radius: 12px;
        
        &.fullscreen {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 100000;
          border-radius: 0;
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

    &.theme--dark {
      background: rgb(30, 30, 30) !important;
      color: rgba(255, 255, 255, 0.87) !important;

      .v-card-title {
        background: rgb(30, 30, 30) !important;
        color: rgba(255, 255, 255, 0.87) !important;
        border-color: rgba(255, 255, 255, 0.12);
      }

      .v-card-text {
        background: rgb(30, 30, 30) !important;
        color: rgba(255, 255, 255, 0.87) !important;
      }
    }
  }
}

/* Footer styles */
.app-footer {
  background-color: var(--v-theme-surface) !important;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease;

  &.theme--dark {
    background-color: rgb(30, 30, 30) !important;
    border-color: rgba(255, 255, 255, 0.12);
  }

  .footer-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .footer-left {
    .copyright {
      font-size: 0.9rem;
      color: var(--text-color);
      opacity: 0.8;
    }
  }

  .footer-center {
    .made-with {
      font-size: 0.9rem;
      color: var(--text-color);
      opacity: 0.8;
    }
  }

  .footer-right {
    display: flex;
    gap: 0.5rem;

    .social-link {
      opacity: 0.8;
      transition: all 0.3s ease;

      &:hover {
        opacity: 1;
        transform: translateY(-2px);
      }

      .v-icon {
        color: var(--text-color) !important;
      }
    }
  }
}

/* Media queries */
@media (max-width: 768px) {
  .skills-overlay {
    padding: 0.25rem;

    .skills-detail-card {
      .v-card-text {
        padding: 0.5rem !important;
      }
    }
  }

  .app-footer {
    .footer-content {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .footer-left,
    .footer-center,
    .footer-right {
      width: 100%;
      justify-content: center;
    }

    .copyright,
    .made-with {
      font-size: 0.8rem;
    }
  }
}

@media (max-width: 576px) {
  .skills-overlay {
    padding: 0;

    .overlay-content {
      width: 100%;
      height: 100%;
    }

    .skills-detail-card {
      border-radius: 0;
      
      .v-card-text {
        padding: 0.25rem !important;
      }
    }
  }
}

/* Print styles */
@media print {
  .skills-overlay {
    position: relative;
    background: none;
    padding: 0;

    .skills-detail-card {
      box-shadow: none !important;
      border: 1px solid rgba(0, 0, 0, 0.1);

      .skill-tree-wrapper {
        page-break-inside: avoid;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  }

  .app-footer {
    display: none !important;
  }
}
</style>