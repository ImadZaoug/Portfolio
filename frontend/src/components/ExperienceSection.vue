// frontend/src/components/ExperienceSection.vue
<template>
  <div class="experience">
    <h2>Professional Experience</h2>
    <div class="timeline">
      <div v-for="exp in experience" 
           :key="exp.company" 
           class="experience-item">
        <div class="exp-header">
          <h3>{{ exp.position }}</h3>
          <span class="company">{{ exp.company }}</span>
          <span class="date">{{ exp.period }}</span>
        </div>
        <ul class="responsibilities">
          <li v-for="(resp, idx) in exp.responsibilities" 
              :key="idx">{{ resp }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExperienceSection',
  
  props: {
    experience: {
      type: Array,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.experience {
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

.timeline {
  .experience-item {
    margin-bottom: 2rem;
    padding-left: 1.5rem;
    border-left: 2px solid var(--primary-color);
    transition: border-left-width 0.2s ease, transform 0.3s ease;

    &:hover {
      border-left-width: 4px;
      transform: translateX(5px);
    }

    .exp-header {
      margin-bottom: 1rem;

      h3 {
        margin-bottom: 0.5rem;
        color: var(--primary-color);
      }

      .company {
        display: block;
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .date {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }

    .responsibilities {
      list-style-type: none;
      padding-left: 0;

      li {
        position: relative;
        padding-left: 1.5rem;
        margin-bottom: 0.5rem;

        &::before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--primary-color);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .experience {
    padding: 1rem;
    
    h2 {
      font-size: 2rem;
    }
  }
}

@media (max-width: 480px) {
  .experience {
    padding: 0.8rem;
    
    h2 {
      font-size: 1.6rem;
    }
  }
}
</style>