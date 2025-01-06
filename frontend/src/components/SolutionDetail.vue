// frontend/src/components/SolutionDetail.vue
<template>
  <transition name="solution-expand">
    <div v-if="props.solution" class="solution-overlay" @click="handleClose">
      <div class="overlay-content" @click.stop>
        <!-- Solution Animation Section -->
        <div class="solution-preview">
          <div class="solution-icon">
            <component 
              :is="getSolutionComponent(props.solution.type)"
              class="enlarged"
            />
          </div>
        </div>

        <!-- Details Section -->
        <div class="details-section">
          <div class="header">
            <div class="title-section">
              <h2 class="title">{{ props.solution.title }}</h2>
              <p v-if="props.solution.context" class="context">{{ props.solution.context }}</p>
              
              <!-- Project Links -->
              <div class="project-links" v-if="props.solution.links">
                <v-btn
                  v-if="props.solution.links.github"
                  :href="props.solution.links.github"
                  target="_blank"
                  color="white"
                  variant="outlined"
                  prepend-icon="mdi-github"
                  class="link-btn"
                >
                  GitHub
                </v-btn>
                <v-btn
                  v-if="props.solution.links.huggingface"
                  :href="props.solution.links.huggingface"
                  target="_blank"
                  color="white"
                  variant="outlined"
                  prepend-icon="mdi-brain"
                  class="link-btn"
                >
                  Hugging Face
                </v-btn>
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
            <!-- Status badge if available -->
            <div v-if="props.solution.status" class="status-badge" :class="props.solution.status.toLowerCase().replace(' ', '-')">
              {{ props.solution.status }}
            </div>
            
            <p class="description">{{ props.solution.fullDesc }}</p>
            
            <div class="tech-stack">
              <h3>Technologies Used</h3>
              <div class="tech-chips">
                <v-chip
                  v-for="tech in props.solution.technologies"
                  :key="tech"
                  color="primary"
                  variant="outlined"
                  class="ma-1"
                >
                  {{ tech }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import BubblingSolution from './solutions/BubblingSolution.vue';
import PulsingSolution from './solutions/PulsingSolution.vue';
import ReactiveSolution from './solutions/ReactiveSolution.vue';
import CrystallizingSolution from './solutions/CrystallizingSolution.vue';
import CirculatingSolution from './solutions/CirculatingSolution.vue';
import TestTubeSolution from './solutions/TestTubeSolution.vue';
import ChainReactionSolution from './solutions/ChainReactionSolution.vue';
import DiffusionSolution from './solutions/DiffusionSolution.vue';
import FreezingSolution from './solutions/FreezingSolution.vue';
import LaserSolution from './solutions/LaserSolution.vue';
import VortexSolution from './solutions/VortexSolution.vue';

/* eslint-disable no-undef */
const props = defineProps({
  solution: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);
/* eslint-enable no-undef */

const handleClose = () => {
  emit('close');
};

const getSolutionComponent = (type) => {
  switch (type) {
    case 'bubbling': return BubblingSolution;
    case 'pulsing': return PulsingSolution;
    case 'reactive': return ReactiveSolution;
    case 'crystallizing': return CrystallizingSolution;
    case 'circulating': return CirculatingSolution;
    case 'testTube': return TestTubeSolution;
    case 'chain': return ChainReactionSolution;
    case 'diffusion': return DiffusionSolution;
    case 'freezing': return FreezingSolution;
    case 'laser': return LaserSolution;
    case 'vortex': return VortexSolution;
    default: return null;
  }
};
</script>

<style lang="scss" scoped>
.solution-overlay {
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

.solution-preview {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .solution-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .enlarged {
      transform: scale(1.2);
      transition: transform 0.5s ease;
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

      .context {
        font-size: 1.1rem;
        opacity: 0.8;
        margin: 0.5rem 0;
      }

      .project-links {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;

        .link-btn {
          text-transform: none;
          letter-spacing: 0.5px;
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

    .status-badge {
      display: inline-block;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 1rem;
      
      &.in-progress {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
      }
    }

    .description {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
  }
}

.tech-stack {
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

.close-btn {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(90deg);
  }
}

// Solution expand animation
.solution-expand-enter-active,
.solution-expand-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  .solution-icon {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header, .content {
    transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s;
  }
}

.solution-expand-enter-from {
  opacity: 0;

  .solution-icon {
    transform: scale(0.5);
  }

  .header, .content {
    opacity: 0;
    transform: translateX(20px);
  }
}

.solution-expand-leave-to {
  opacity: 0;

  .solution-icon {
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

  .solution-preview {
    width: 150px;
    height: 150px;
  }

  .details-section {
    width: 100%;
    max-width: none;

    .header .title-section .title {
      font-size: 2rem;
    }
  }
}

@media (max-width: 600px) {
  .solution-overlay {
    padding: 1rem;
  }

  .overlay-content {
    width: 100%;
    height: 100%;
    gap: 1rem;
  }

  .solution-preview {
    width: 120px;
    height: 120px;
  }

  .details-section {
    .header {
      .title-section {
        .title {
          font-size: 1.5rem;
        }
        
        .context {
          font-size: 1rem;
        }
        
        .project-links {
          flex-wrap: wrap;
        }
      }
    }

    .content {
      .description {
        font-size: 1rem;
      }
    }
  }
}
</style>