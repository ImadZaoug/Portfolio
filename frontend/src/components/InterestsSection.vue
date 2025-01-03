// frontend/src/components/InterestsSection.vue
<template>
  <div class="interests">
    <h2>Interests</h2>
    <div class="interests-grid">
      <div v-for="interest in profileStore.interests" 
           :key="interest.name" 
           class="interest-item">
        <h3>{{ interest.name }}</h3>
        <p>{{ interest.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useProfileStore } from '@/stores/profile'

export default defineComponent({
  name: 'InterestsSection',
  
  setup() {
    const profileStore = useProfileStore()
    return { profileStore }
  }
})
</script>

<style lang="scss" scoped>
.interests {
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

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
}

.interest-item {
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
  .interests {
    padding: 1rem;
    
    h2 {
      font-size: 2rem;
    }
  }

  .interests-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .interests {
    padding: 0.8rem;
    
    h2 {
      font-size: 1.6rem;
    }
  }

  .interest-item {
    padding: 1.5rem;

    h3 {
      font-size: 1.2rem;
    }
  }
}
</style>