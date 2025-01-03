# frontend/src/components/PersonalProfile.vue
<template>
  <v-card class="profile-card" elevation="4">
    <v-container>
      <!-- Basic Profile Info -->
      <div class="basic-info">
        <!-- Profile Header -->
        <div class="profile-header">
          <v-avatar size="150" class="profile-avatar mb-4">
            <v-img :src="profileStore.profileImage" alt="Profile Picture" />
          </v-avatar>
          <h1 class="text-h4 font-weight-bold">{{ profileStore.name }}</h1>
          <h2 class="text-subtitle-1 text-grey">{{ profileStore.title }}</h2>
        </div>

        <!-- Social Links -->
        <div class="social-links">
          <v-btn
            href="https://www.linkedin.com/in/imad-zaoug/"
            target="_blank"
            class="social-btn linkedin-btn"
            elevation="2"
          >
            <div class="btn-content">
              <v-icon icon="mdi-linkedin" size="24" class="mr-2" />
              <span>LinkedIn Profile</span>
            </div>
          </v-btn>
          <v-btn
            href="https://github.com/ImadZaoug"
            target="_blank"
            class="social-btn github-btn"
            elevation="2"
          >
            <div class="btn-content">
              <v-icon icon="mdi-github" size="24" class="mr-2" />
              <span>GitHub Profile</span>
            </div>
          </v-btn>
        </div>

        <!-- Contact Info -->
        <div class="contact-info">
          <div class="contact-item">
            <v-icon icon="mdi-map-marker" color="primary" size="small" class="mr-1" />
            <span>{{ profileStore.personalInfo.Location }}</span>
          </div>
          <div class="contact-item">
            <v-icon icon="mdi-email" color="primary" size="small" class="mr-1" />
            <span>{{ profileStore.personalInfo.Email }}</span>
          </div>
        </div>

        <!-- Specialty Tags -->
        <div class="specialty-tags">
          <v-chip 
            v-for="(specialty, index) in profileStore.personalInfo.Specialty.split('|')" 
            :key="index"
            color="primary"
            variant="outlined"
            class="ma-1"
          >
            {{ specialty.trim() }}
          </v-chip>
        </div>

        <!-- Expand Button -->
        <v-btn
          @click="handleExpand"
          color="primary"
          class="mt-6 expand-btn"
          size="x-large"
          elevation="3"
        >
          <v-icon icon="mdi-account-details" class="mr-2" />
          View Full Profile
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import { defineComponent } from 'vue'
import { useProfileStore } from '@/stores/profile'

export default defineComponent({
  name: 'PersonalProfile',
  
  emits: ['expand'],
  
  setup(props, { emit }) {  // Get emit from context
    const profileStore = useProfileStore()
    
    const handleExpand = () => {
      console.log('Expand button clicked')  // Debug log
      emit('expand', true)
    }
    
    return { profileStore, handleExpand }
  }
})
</script>

<style lang="scss" scoped>
.profile-card {
  background: var(--v-background-base);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
}

.basic-info {
  text-align: center;
  padding: 2rem;
}

.profile-header {
  margin-bottom: 2rem;

  .profile-avatar {
    border: 4px solid var(--v-primary-base);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;

    &:hover {
      transform: scale(1.05) rotate(5deg);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transform: skewX(-25deg);
      animation: shimmer 2s infinite;
    }
  }

  h1 {
    margin: 1.5rem 0 0.5rem;
    font-size: 2rem;
    font-weight: 600;
    color: var(--v-text-color);
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--v-text-secondary);
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 0 1rem;

  .social-btn {
    flex: 1;
    max-width: 200px;
    height: 48px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
    }

    &.linkedin-btn {
      background-color: #0077B5 !important;
      color: white !important;

      &:hover {
        background-color: darken(#0077B5, 10%) !important;
        transform: translateY(-2px);
      }
    }

    &.github-btn {
      background-color: #24292E !important;
      color: white !important;

      &:hover {
        background-color: darken(#24292E, 10%) !important;
        transform: translateY(-2px);
      }
    }
  }
}

.contact-info {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  .contact-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(var(--v-theme-primary), 0.1);
    border-radius: 20px;
    font-size: 0.95rem;

    span {
      color: var(--v-text-color);
    }
  }
}

.specialty-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.expand-btn {
  padding: 0 32px;
  height: 48px;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-2px);

    &::after {
      transform: scaleX(1);
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--v-primary-lighten-2);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-25deg);
  }
  100% {
    transform: translateX(200%) skewX(-25deg);
  }
}

// Responsive styles
@media (max-width: 960px) {
  .basic-info {
    padding: 1.5rem;
  }

  .profile-header {
    .profile-avatar {
      width: 140px !important;
      height: 140px !important;
    }

    h1 {
      font-size: 1.8rem;
    }

    h2 {
      font-size: 1.1rem;
    }
  }
}

@media (max-width: 600px) {
  .basic-info {
    padding: 1rem;
  }

  .social-links {
    flex-direction: column;
    align-items: center;

    .social-btn {
      width: 100%;
      max-width: none;
    }
  }

  .profile-header {
    .profile-avatar {
      width: 120px !important;
      height: 120px !important;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1rem;
    }
  }

  .expand-btn {
    width: 100%;
  }
}
</style>