# frontend/src/components/ProfileSlider.vue
<template>
  <div class="profile-slider">
    <div class="slider-container" 
         :style="{ transform: `translateY(-${slidePosition}%)` }">
      
      <!-- Combined Profile and Personal Info Section -->
      <section class="slide">
        <PersonalProfile @expand="handleProfileExpand" />
      </section>

      <!-- Projects Section -->
      <section class="slide">
        <LaboratoryProjects 
          :is-expanded="isSolutionExpanded"
          @solution-expand="handleSolutionExpand"
        />
      </section>

      <!-- Professional Experience Section -->
      <section class="slide">
        <ExperienceSection 
          :experience="experienceStore.experience" 
        />
      </section>

      <!-- Technical Skills Section -->
      <section class="slide">
        <SkillsSection
          :is-fullscreen="isSkillTreeFullscreen"
          @fullscreen-change="handleFullscreenChange"
        />
      </section>

      <!-- Soft Skills Section -->
      <section class="slide">
        <SoftSkillsSection />
      </section>

      <!-- Interests Section -->
      <section class="slide">
        <InterestsSection />
      </section>
    </div>

    <!-- Navigation -->
    <div 
      class="slider-nav"
      v-show="!isFullscreen && !isSolutionExpanded"
    >
      <div class="progress-bar">
        <div class="progress" 
             :style="{ height: `${(currentSlide / (totalSlides - 1)) * 100}%` }">
        </div>
      </div>
      <button 
        @click="handlePrevSlide" 
        :disabled="isAnimating || currentSlide === 0 || disabled"
      >
        ↑
      </button>
      <button 
        @click="handleNextSlide" 
        :disabled="isAnimating || currentSlide === totalSlides - 1 || disabled"
      >
        ↓
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useSkillsStore } from '@/stores/skills'
import { useExperienceStore } from '@/stores/experience'
import PersonalProfile from './PersonalProfile.vue'
import LaboratoryProjects from './LaboratoryProjects.vue'
import ExperienceSection from './ExperienceSection.vue'
import SkillsSection from './SkillsSection.vue'
import SoftSkillsSection from './SoftSkillsSection.vue'
import InterestsSection from './InterestsSection.vue'

export default defineComponent({
  name: 'ProfileSlider',
  
  components: {
    PersonalProfile,
    LaboratoryProjects,
    ExperienceSection,
    SkillsSection,
    SoftSkillsSection,
    InterestsSection
  },
  
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isFullscreen: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    },
    isSolutionExpanded: {
      type: Boolean,
      default: false
    },
    initialSection: {
      type: Number,
      default: 0
    },
    disableNavigation: {
      type: Boolean,
      default: false
    }
  },
  
  emits: [
    'section-change', 
    'animation-start', 
    'animation-complete', 
    'fullscreen-change',
    'profile-expand',
    'solution-expand'
  ],
  
  setup(props, { emit }) {
    const profileStore = useProfileStore()
    const skillsStore = useSkillsStore()
    const experienceStore = useExperienceStore()

    const currentSlide = ref(props.initialSection)
    const totalSlides = ref(6)
    const isAnimating = ref(false)
    const isSkillTreeFullscreen = ref(false)

    // Computed properties
    const slidePosition = computed(() => currentSlide.value * 100)

    // Animation handling
    const getScrollAnimation = (direction, currentSection) => {
      if (direction === 'down') {
        if (currentSection === 0) return 'jump'
        if (currentSection === 2) return 'RunLeft'
        if (currentSection === 4) return 'charge'
        return 'climbingDownWall'
      } else {
        if (currentSection === 1) return 'freehangClimb'
        if ([3, 5].includes(currentSection)) return 'RunRight'
        return 'climbing'
      }
    }

    // Navigation methods
    const handleNextSlide = async () => {
      if (props.disabled || props.disableNavigation || isAnimating.value || currentSlide.value >= totalSlides.value - 1) return
      
      isAnimating.value = true
      const animation = getScrollAnimation('down', currentSlide.value)
      
      emit('animation-start', {
        animation,
        direction: 'down',
        fromSection: currentSlide.value,
        toSection: currentSlide.value + 1
      })

      await new Promise(resolve => setTimeout(resolve, 500))
      
      currentSlide.value++
      emit('section-change', currentSlide.value)
      
      isAnimating.value = false
      emit('animation-complete')
    }

    const handlePrevSlide = async () => {
      if (props.disabled || props.disableNavigation || isAnimating.value || currentSlide.value <= 0) return
      
      isAnimating.value = true
      const animation = getScrollAnimation('up', currentSlide.value)
      
      emit('animation-start', {
        animation,
        direction: 'up',
        fromSection: currentSlide.value,
        toSection: currentSlide.value - 1
      })

      await new Promise(resolve => setTimeout(resolve, 500))
      
      currentSlide.value--
      emit('section-change', currentSlide.value)
      
      isAnimating.value = false
      emit('animation-complete')
    }

    // Fullscreen handling
    const handleFullscreenChange = (isFullscreen) => {
      isSkillTreeFullscreen.value = isFullscreen
      emit('fullscreen-change', isFullscreen)
    }

    // Profile expansion handling
    const handleProfileExpand = (expanded) => {
      emit('profile-expand', expanded)
    }

    // Solution expansion handling
    const handleSolutionExpand = ({ expanded, solution }) => {
      emit('solution-expand', { expanded, solution })
    }

    // Keyboard navigation
    const handleKeydown = (e) => {
      if (props.disabled || props.disableNavigation || isSkillTreeFullscreen.value || props.isSolutionExpanded) return
      
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrevSlide()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleNextSlide()
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })

    return {
      currentSlide,
      totalSlides,
      isAnimating,
      isSkillTreeFullscreen,
      profileStore,
      skillsStore,
      experienceStore,
      slidePosition,
      handleNextSlide,
      handlePrevSlide,
      handleFullscreenChange,
      handleProfileExpand,
      handleSolutionExpand
    }
  }
})
</script>

<style lang="scss" scoped>
// Variables
:root {
  --fullscreen-z-index: 99997;  // Make this lower than the overlays
}

.skills-section {
  position: relative;
  z-index: 1;
}

// Main container styles
.profile-slider {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  display: flex;
  perspective: 1000px;

  &:has(.skills-section.fullscreen) {
    position: static;
  }
}

.slider-container {
  flex: 1;
  transition: transform 0.8s ease-in-out;
  transform-style: preserve-3d;
  will-change: transform;
}

// Slide styles
.slide {
  height: 100vh;
  padding: 3rem;
  overflow-y: auto;
  backface-visibility: hidden;
  transition: opacity 0.5s ease-in-out;
  background: var(--v-theme-background);

  &::-webkit-scrollbar {
    width: 6px;
    &-thumb {
      background-color: var(--v-theme-primary);
      border-radius: 3px;
    }
  }

  &.skills-section {
    overflow: hidden;
    padding: 2rem;

    &.fullscreen {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: var(--fullscreen-z-index);
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  }
}

// Navigation
.slider-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 10;

  &:has(~ .slide .skills-container.fullscreen-container) {
    display: none;
  }

  .progress-bar {
    width: 4px;
    height: 200px;
    background: var(--v-theme-surface);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress {
    width: 100%;
    background: var(--v-theme-primary);
    border-radius: 2px;
    transition: height 0.3s ease;
  }

  button {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    background: var(--v-theme-primary);
    color: var(--v-theme-on-primary);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    will-change: transform;

    &:hover:not(:disabled) {
      transform: scale(1.1);
      background: var(--v-theme-secondary);
      box-shadow: 0 2px 8px var(--v-shadow-color);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      background: var(--v-theme-surface);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

// Responsive styles
@media (max-width: 768px) {
  .slide {
    padding: 2rem;

    &.skills-section {
      padding: 1.5rem;
    }
  }

  .slider-nav {
    right: 1rem;
    
    button {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }

    .progress-bar {
      height: 150px;
    }
  }
}

@media (max-width: 480px) {
  .slide {
    padding: 1.5rem;

    &.skills-section {
      padding: 1rem;
    }
  }

  .slider-nav {
    right: 0.5rem;
    
    button {
      width: 32px;
      height: 32px;
    }

    .progress-bar {
      height: 120px;
    }
  }
}

// Print styles
@media print {
  .profile-slider {
    height: auto;
    overflow: visible;
  }

  .slider-container {
    transform: none !important;
  }

  .slide {
    height: auto;
    page-break-after: always;
  }

  .slider-nav {
    display: none;
  }
}
</style>