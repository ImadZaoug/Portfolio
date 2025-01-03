// frontend/src/components/PersonalProfile.vue
<template>
  <div class="personal-profile">
    <!-- Profile Section -->
    <section class="profile-section">
      <div class="profile-image">
        <img :src="profileImage" :alt="name">
        <h1>{{ name }}</h1>
        <h2>{{ title }}</h2>
      </div>
    </section>

    <!-- Personal Info Section -->
    <section class="info-section">
      <div class="personal-info">
        <h2>About Me</h2>
        <div class="info-grid">
          <div v-for="(info, key) in personalInfo" 
               :key="key" 
               class="info-item">
            <span class="label">{{ key }}:</span>
            <span class="value">{{ info }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useProfileStore } from '@/stores/profile'

export default defineComponent({
  name: 'PersonalProfile',
  
  setup() {
    const profileStore = useProfileStore()
    
    return {
      profileImage: profileStore.profileImage,
      name: profileStore.name,
      title: profileStore.title,
      personalInfo: profileStore.personalInfo
    }
  }
})
</script>

<style lang="scss" scoped>
.personal-profile {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.profile-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image {
  text-align: center;
  
  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px var(--shadow-color);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  h1 {
    margin-top: 1rem;
    color: var(--text-color);
    font-size: 2.5rem;
  }

  h2 {
    color: var(--primary-color);
    font-size: 1.8rem;
    margin-top: 0.5rem;
  }
}

.info-section {
  flex: 1;
  width: 100%;
  max-width: 800px;
}

.personal-info {
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .label {
    font-weight: 600;
    color: var(--primary-color);
  }

  .value {
    color: var(--text-color);
  }
}

@media (max-width: 768px) {
  .personal-profile {
    padding: 1rem;
  }

  .profile-image {
    img {
      width: 150px;
      height: 150px;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .personal-info h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .profile-image {
    img {
      width: 120px;
      height: 120px;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.2rem;
    }
  }

  .personal-info h2 {
    font-size: 1.6rem;
  }
}
</style>