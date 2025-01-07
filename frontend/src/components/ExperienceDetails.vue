# frontend/src/components/ExperienceDetails.vue
<template>
  <transition name="experience-expand">
    <div v-if="experience" class="experience-overlay" @click="handleClose">
      <div class="overlay-content" @click.stop>
        <!-- Experience Preview Section -->
        <div class="experience-preview">
          <div class="company-icon">
            <img 
              v-if="experience.company !== 'AZAD Envirement'"
              :src="`/images/${experience.company.toLowerCase()}-logo.png`" 
              :alt="`${experience.company} logo`"
              :class="[
                'company-logo',
                { 'rotated': experience.company === 'ReciTAL' }
              ]"
            />
            <div v-else class="azad-text">AZAD</div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="details-section">
          <div class="header">
            <div class="title-section">
              <h2 class="title">{{ experience.position }}</h2>
              <div class="company-info">
                <v-icon color="white" class="mr-2">mdi-office-building</v-icon>
                <span class="company">{{ experience.company }}</span>
              </div>
              <div class="meta-info">
                <div class="location">
                  <v-icon color="white" class="mr-2">mdi-map-marker</v-icon>
                  <span>{{ experience.location }}</span>
                </div>
                <div class="period">
                  <v-icon color="white" class="mr-2">mdi-calendar</v-icon>
                  <span>{{ experience.period }}</span>
                </div>
              </div>
            </div>
            
            <v-btn 
              icon="mdi-close" 
              variant="text" 
              size="large" 
              @click="handleClose" 
              class="close-btn"
              color="white"
            />
          </div>

          <div class="content">
            <div class="responsibilities">
              <h3>Key Responsibilities & Achievements</h3>
              <ul>
                <li v-for="(resp, index) in experience.responsibilities" 
                    :key="index"
                    class="responsibility-item">
                  {{ resp }}
                </li>
              </ul>
            </div>

            <div v-if="experience.technologies" class="tech-stack">
              <h3>Technologies & Skills</h3>
              <div class="tech-chips">
                <v-chip
                  v-for="tech in experience.technologies"
                  :key="tech"
                  color="white"
                  variant="outlined"
                  class="ma-1"
                >
                  {{ tech }}
                </v-chip>
              </div>
            </div>

            <div v-if="experience.links" class="project-links">
              <h3>Project Links</h3>
              <div class="links-container">
                <v-btn
                  v-for="(link, index) in experience.links.github"
                  :key="index"
                  :href="link"
                  target="_blank"
                  color="white"
                  variant="outlined"
                  prepend-icon="mdi-github"
                  class="link-btn"
                >
                  GitHub Repository
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExperienceDetails',

  props: {
    experience: {
      type: Object,
      required: true
    }
  },

  emits: ['close'],

  setup(props, { emit }) {
    const handleClose = () => {
      emit('close')
    }

    return {
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
.experience-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.overlay-content {
  width: 90%;
  height: 90%;
  max-width: 1600px;
  position: relative;
  transform-origin: center;
  display: flex;
  gap: 4rem;
  color: white;
}

.experience-preview {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .company-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .company-logo {
      width: 100%;
      height: auto;
      max-height: 150px;
      object-fit: contain;
      opacity: 0.9;
      
      &.rotated {
        transform: rotate(90deg);
      }
    }

    .azad-text {
      font-size: 3rem;
      font-weight: bold;
      color: white;
      opacity: 0.9;
    }
  }
}

.details-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 800px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .title-section {
      .title {
        font-size: 2.5rem;
        font-weight: 600;
        margin: 0;
        color: white;
      }

      .company-info {
        font-size: 1.4rem;
        margin: 0.8rem 0;
        display: flex;
        align-items: center;
        color: white;
        opacity: 0.9;
      }

      .meta-info {
        display: flex;
        gap: 2rem;
        margin-top: 0.5rem;

        .location, .period {
          display: flex;
          align-items: center;
          opacity: 0.8;
        }
      }
    }
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding-right: 1rem;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

.responsibilities {
  margin-bottom: 2rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: white;
  }

  .responsibility-item {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.6;
    opacity: 0.9;

    &::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.tech-stack {
  margin-bottom: 2rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: white;
  }

  .tech-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

.project-links {
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: white;
  }

  .links-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .link-btn {
    text-transform: none;
    letter-spacing: 0.5px;
  }
}

.close-btn {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(90deg);
  }
}

// Experience expand animation
.experience-expand-enter-active,
.experience-expand-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  .company-icon {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header, .content {
    transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s;
  }
}

.experience-expand-enter-from {
  opacity: 0;

  .company-icon {
    transform: scale(0.5);
  }

  .header, .content {
    opacity: 0;
    transform: translateX(20px);
  }
}

.experience-expand-leave-to {
  opacity: 0;

  .company-icon {
    transform: scale(0.5);
  }

  .header, .content {
    opacity: 0;
    transform: translateX(-20px);
  }
}

// Responsive styles
@media (max-width: 960px) {
  .overlay-content {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }

  .experience-preview {
    width: 150px;
    height: 150px;
  }

  .details-section {
    width: 100%;
    max-width: none;

    .header .title-section {
      .title {
        font-size: 2rem;
      }

      .meta-info {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }
}

@media (max-width: 600px) {
  .experience-overlay {
    padding: 1rem;
  }

  .overlay-content {
    width: 100%;
    height: 100%;
    gap: 1rem;
  }

  .experience-preview {
    width: 120px;
    height: 120px;
  }

  .details-section {
    .header .title-section {
      .title {
        font-size: 1.5rem;
      }
      
      .company-info {
        font-size: 1.2rem;
      }
    }
  }
}
</style>