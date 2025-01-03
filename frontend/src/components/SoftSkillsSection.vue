// frontend/src/components/SoftSkillsSection.vue
<template>
  <div class="soft-skills">
    <h2>Soft Skills</h2>
    <div class="soft-skills-grid">
      <div v-for="skill in skillsStore.softSkills" 
           :key="skill.name" 
           class="soft-skill-item">
        <h3>{{ skill.name }}</h3>
        <p>{{ skill.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useSkillsStore } from '@/stores/skills'

export default defineComponent({
  name: 'SoftSkillsSection',
  
  setup() {
    const skillsStore = useSkillsStore()
    return { skillsStore }
  }
})
</script>

<style lang="scss" scoped>
.soft-skills {
  padding: 2rem;

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

.soft-skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
}

.soft-skill-item {
  background: var(--background-color);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  h3 {
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .soft-skills {
    padding: 1rem;
    
    h2 {
      font-size: 2rem;
    }
  }

  .soft-skills-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .soft-skills {
    padding: 0.8rem;
    
    h2 {
      font-size: 1.6rem;
    }
  }

  .soft-skill-item {
    padding: 1.5rem;
  }
}
</style>