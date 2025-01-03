// ProfileSlider.vue
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
        <LaboratoryProjects />
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
    <div class="slider-nav">
      <div class="progress-bar">
        <div class="progress" 
             :style="{ height: `${(currentSlide / (totalSlides - 1)) * 100}%` }">
        </div>
      </div>
      <button @click="handlePrevSlide" :disabled="isAnimating || currentSlide === 0">↑</button>
      <button @click="handleNextSlide" :disabled="isAnimating || currentSlide === totalSlides - 1">↓</button>
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
    }
  },
  
  emits: [
    'section-change', 
    'animation-start', 
    'animation-complete', 
    'fullscreen-change',
    'profile-expand'
  ],
  
  setup(props, { emit }) {
    const profileStore = useProfileStore()
    const skillsStore = useSkillsStore()
    const experienceStore = useExperienceStore()

    const currentSlide = ref(0)
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
      if (props.disabled || isAnimating.value || currentSlide.value >= totalSlides.value - 1) return
      
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
      if (props.disabled || isAnimating.value || currentSlide.value <= 0) return
      
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
      console.log('ProfileSlider: forwarding expand event', expanded) // Debug log
      emit('profile-expand', expanded)
    }

    // Keyboard navigation
    const handleKeydown = (e) => {
      if (props.disabled || isSkillTreeFullscreen.value) return
      
      if (e.key === 'ArrowUp') {
        handlePrevSlide()
      } else if (e.key === 'ArrowDown') {
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
      handleProfileExpand
    }
  }
})
</script>

<style lang="scss" scoped>
// Variables
:root {
  --fullscreen-z-index: 9999;
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
  background: var(--background-color);

  &::-webkit-scrollbar {
    width: 6px;
    &-thumb {
      background-color: rgba(0, 0, 0, 0.2);
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

      .skills-container {
        position: fixed;
        inset: 0;
        height: 100vh;
        width: 100vw;
        border-radius: 0;
        margin: 0;
        padding: 0;
        z-index: var(--fullscreen-z-index);

        &.fullscreen {
          box-shadow: none;
        }
      }

      .skills h2 {
        position: fixed;
        top: 2rem;
        left: 2rem;
        z-index: calc(var(--fullscreen-z-index) + 1);
        margin: 0;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
  }
}

// Grid layouts
.soft-skills-grid, 
.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
  will-change: transform;
  transition: transform 0.3s ease;
}

// Card styles
.soft-skill-item, 
.interest-item {
  background: var(--background-color);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }
}

// Skills section styles
.skills {
  .skills-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 200px);
    overflow: hidden;
    border-radius: 12px;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%);
    box-shadow: 0 4px 20px var(--shadow-color);
    transition: all 0.3s ease-in-out;
    
    &.fullscreen-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }
  }

  h2 {
    margin-bottom: 2rem;
    color: var(--text-color);
    text-align: left;
    
    &::after {
      content: '';
      display: block;
      width: 50px;
      height: 3px;
      background: var(--primary-color);
      margin-top: 0.5rem;
    }
  }
}

// Section-specific styles
h2 {
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-size: 2.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 50px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
  }
}

h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
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
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress {
    width: 100%;
    background: var(--primary-color);
    border-radius: 2px;
    transition: height 0.3s ease;
  }

  button {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--background-color);
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
      background: var(--secondary-color);
      box-shadow: 0 2px 8px var(--shadow-color);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      background: var(--border-color);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

// Slide transitions
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease-in-out;
}

.slide-enter-from {
  transform: translateY(100%) rotateZ(5deg);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-100%) rotateZ(-5deg);
  opacity: 0;
}

// Responsive styles
@media (max-width: 768px) {
  .slide.skills-section.fullscreen {
    padding: 0;
    
    .skills h2 {
      top: 1rem;
      left: 1rem;
      font-size: 1.8rem;
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

  .slide {
    padding: 1rem;

    &.skills-section {
      padding: 1rem;
    }
  }

  .soft-skills-grid,
  .interests-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .slide.skills-section.fullscreen {
    .skills h2 {
      font-size: 1.5rem;
    }
  }

  .slider-nav {
    right: 0.5rem;
    
    button {
      width: 32px;
      height: 32px;
    }
  }

  .slide {
    padding: 0.8rem;
  }

  h2 {
    font-size: 1.6rem;
  }

  .soft-skill-item, 
  .interest-item {
    padding: 1.5rem;
  }
}

// Print styles
@media print {
  .skills-section.fullscreen {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    
    .skills-container {
      position: relative !important;
      height: auto !important;
      min-height: 500px;
    }
  }

  .slider-nav {
    display: none;
  }

  .slide {
    page-break-after: always;
  }
}
</style>