# frontend/src/components/PersonalProfile.vue
<template>
  <v-card class="profile-card" elevation="4">
    <v-container class="fill-height pa-0">
      <div class="basic-info">
        <!-- Profile Header -->
        <div class="profile-header">
          <v-avatar size="130" class="profile-avatar mb-3">
            <v-img :src="profileStore.profileImage" alt="Profile Picture" />
          </v-avatar>
          <h1 class="text-h4 font-weight-bold mb-1">{{ profileStore.name }}</h1>
          <h2 class="text-subtitle-1">{{ profileStore.title }}</h2>
        </div>

        <!-- Social Links -->
        <div class="social-buttons-group">
          <v-btn
            href="https://www.linkedin.com/in/imad-zaoug/"
            target="_blank"
            class="social-btn"
            :color="'#0077B5'"
            elevation="2"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-linkedin" size="24" class="mr-2" color="white" />
              <span class="white--text force-white">LinkedIn Profile</span>
            </div>
          </v-btn>
          <v-btn
            href="https://github.com/ImadZaoug"
            target="_blank"
            class="social-btn"
            :color="'#24292E'"
            elevation="2"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-github" size="24" class="mr-2" color="white" />
              <span class="white--text force-white">Github Profile</span>
            </div>
          </v-btn>
        </div>

        <!-- Contact Info -->
        <div class="contact-info">
          <div class="contact-item">
            <v-icon icon="mdi-map-marker" size="small" class="mr-1" />
            <span>{{ profileStore.personalInfo.Location }}</span>
          </div>
          <div class="contact-item">
            <v-icon icon="mdi-email" size="small" class="mr-1" />
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
            size="small"
          >
            {{ specialty.trim() }}
          </v-chip>
        </div>

        <!-- Expand Button -->
        <v-btn
          @click="handleExpand"
          color="primary"
          class="expand-btn mt-4"
          size="x-large"
          elevation="3"
        >
          <v-icon icon="mdi-account-details" class="mr-2 force-white" color="white" />
          <span class="force-white">View Full Profile</span>
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
  
  setup(props, { emit }) {
    const profileStore = useProfileStore()
    
    const handleExpand = () => {
      emit('expand', true)
    }
    
    return { profileStore, handleExpand }
  }
})
</script>

<style lang="scss" scoped>
.profile-card {
  background: var(--v-theme-background);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  display: flex;
}

:deep(.v-theme--dark) {
  .text-h4, h1 {
    color: #48D597 !important;
  }
  
  .text-subtitle-1, h2, 
  .contact-item span {
    color: rgba(255, 255, 255, 0.87) !important;
  }
  
  .v-icon:not(.force-white) {
    color: #48D597 !important;
  }

  .force-white {
    color: white !important;
  }
}

:deep(.v-theme--light) {
  .text-h4, h1 {
    color: var(--v-theme-primary) !important;
  }
  
  .text-subtitle-1, h2,
  .contact-item span {
    color: rgba(0, 0, 0, 0.87) !important;
  }
  
  .v-icon:not(.force-white) {
    color: var(--v-theme-primary) !important;
  }

  .force-white {
    color: white !important;
  }
}

.basic-info {
  text-align: center;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
  width: 100%;
}

.profile-header {
  .profile-avatar {
    border: 4px solid var(--v-theme-primary);
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
    font-size: 1.8rem;
    line-height: 1.2;
  }

  h2 {
    font-size: 1.1rem;
    line-height: 1.2;
    opacity: 0.9;
  }
}

.social-buttons-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0 1rem;
  margin: 0.5rem 0;
  width: 100%;
  z-index: 1;

  .social-btn {
    min-width: 160px;
    height: 42px;
    color: white !important;
    position: relative;
    transition: all 0.3s ease;
    font-weight: 400;

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
  }
}

.contact-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .contact-item {
    display: flex;
    align-items: center;
    padding: 0.4rem 0.8rem;
    background: rgba(var(--v-theme-primary), 0.1);
    border-radius: 20px;
    font-size: 0.9rem;
  }
}

.specialty-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  padding: 0 0.5rem;
}

.expand-btn {
  margin-top: auto;
  height: 44px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-25deg); }
  100% { transform: translateX(200%) skewX(-25deg); }
}

// Responsive styles
@media (max-width: 960px) {
  .basic-info {
    padding: 1.25rem;
  }

  .profile-header {
    .profile-avatar {
      width: 120px !important;
      height: 120px !important;
    }
  }
}

@media (max-width: 600px) {
  .basic-info {
    padding: 1rem;
    gap: 0.75rem;
  }

  .social-buttons-group {
    flex-direction: column;
    padding: 0;
    
    .social-btn {
      width: 100%;
      min-width: 0;
    }
  }

  .profile-header {
    .profile-avatar {
      width: 110px !important;
      height: 110px !important;
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