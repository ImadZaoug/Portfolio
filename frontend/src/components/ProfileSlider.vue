# frontend/src/components/ProfileSlider.vue
<template>
  <div class="profile-slider">
    <div class="slider-container" 
         :style="{ transform: `translateY(-${slidePosition}%)` }">
      
      <!-- Combined Profile and Personal Info Section -->
      <section class="slide">
        <div class="section-wrapper">
          <PersonalProfile @expand="handleProfileExpand" />
        </div>
      </section>

      <!-- Projects Section -->
      <section class="slide">
        <div class="section-wrapper">
          <LaboratoryProjects 
            :is-expanded="isSolutionExpanded"
            @solution-expand="handleSolutionExpand"
          />
        </div>
      </section>

      <!-- Professional Experience Section -->
      <section class="slide">
        <div class="section-wrapper">
          <ExperienceSection 
            :experience="experienceStore.experience"
            :is-expanded="isExperienceExpanded"
            @experience-expand="handleExperienceExpand"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useExperienceStore } from '@/stores/experience'
import PersonalProfile from './PersonalProfile.vue'
import LaboratoryProjects from './LaboratoryProjects.vue'
import ExperienceSection from './ExperienceSection.vue'

export default defineComponent({
  name: 'ProfileSlider',
  
  components: {
    PersonalProfile,
    LaboratoryProjects,
    ExperienceSection
  },
  
  props: {
    disabled: {
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
    isExperienceExpanded: {
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
    'profile-expand',
    'solution-expand',
    'experience-expand'
  ],
  
  setup(props, { emit }) {
    const profileStore = useProfileStore()
    const experienceStore = useExperienceStore()

    const currentSlide = ref(props.initialSection)
    const totalSlides = ref(3)
    const isAnimating = ref(false)

    // Computed properties
    const slidePosition = computed(() => currentSlide.value * 100)

    // Animation handling
    const getScrollAnimation = (direction, currentSection) => {
      if (direction === 'down') {
        if (currentSection === 0) return 'jump'
        if (currentSection === 1) return 'RunLeft'
        return 'climbingDownWall'
      } else {
        if (currentSection === 1) return 'freehangClimb'
        if (currentSection === 2) return 'RunRight'
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

    // Profile expansion handling
    const handleProfileExpand = (expanded) => {
      emit('profile-expand', expanded)
    }

    // Solution expansion handling
    const handleSolutionExpand = ({ expanded, solution }) => {
      emit('solution-expand', { expanded, solution })
    }

    // Experience expansion handling
    const handleExperienceExpand = ({ expanded, experience }) => {
      emit('experience-expand', { expanded, experience })
    }

    // Keyboard navigation
    const handleKeydown = (e) => {
      if (props.disabled || props.disableNavigation || props.isSolutionExpanded || props.isExperienceExpanded) return
      
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
      profileStore,
      experienceStore,
      slidePosition,
      handleNextSlide,
      handlePrevSlide,
      handleProfileExpand,
      handleSolutionExpand,
      handleExperienceExpand
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-slider {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  display: flex;
  perspective: 1000px;
}

.slider-container {
  flex: 1;
  transition: transform 0.8s ease-in-out;
  transform-style: preserve-3d;
  will-change: transform;
}

.slide {
  height: 100vh;
  backface-visibility: hidden;
  transition: opacity 0.5s ease-in-out;
  background: var(--v-theme-background);
}

.section-wrapper {
  height: 100%;
  padding: 3rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--v-theme-primary);
    border-radius: 3px;
  }
}

@media (max-width: 768px) {
  .section-wrapper {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .section-wrapper {
    padding: 1.5rem;
  }
}

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
}
</style>