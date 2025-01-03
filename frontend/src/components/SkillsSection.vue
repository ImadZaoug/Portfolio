// frontend/src/components/SkillsSection.vue
<template>
  <section class="skills-section" :class="{ 'fullscreen': isFullscreen }">
    <div class="skills">
      <h2>Technical Skills</h2>
      <div class="skills-container" :class="{ 'fullscreen-container': isFullscreen }">
        <SkillTree 
          :initial-skills="skillsStore.technicalSkills"
          :available-points="skillsStore.availablePoints"
          :max-points="skillsStore.maxPoints"
          @unlock-skill="handleSkillUnlock"
          @fullscreen-change="handleFullscreenChange"
          :is-fullscreen="isFullscreen"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { useSkillsStore } from '@/stores/skills'
import SkillTree from './SkillTree.vue'

export default defineComponent({
  name: 'SkillsSection',
  
  components: {
    SkillTree
  },

  props: {
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },

  emits: ['fullscreen-change'],

  setup(props, { emit }) {
    const skillsStore = useSkillsStore()

    const handleSkillUnlock = (skillId) => {
      skillsStore.unlockSkill(skillId)
    }

    const handleFullscreenChange = (isFullscreen) => {
      emit('fullscreen-change', isFullscreen)
    }

    return {
      skillsStore,
      handleSkillUnlock,
      handleFullscreenChange
    }
  }
})
</script>

<style lang="scss" scoped>
.skills-section {
  position: relative;
  z-index: 1;
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
}

@media (max-width: 768px) {
  .skills-section {
    padding: 1rem;
  }

  .skills h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .skills-section {
    padding: 0.8rem;
  }

  .skills h2 {
    font-size: 1.6rem;
  }
}

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
}
</style>