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
            <h2 class="title">{{ props.solution.title }}</h2>
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

// Solution Preview Section
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

// Details Section
.details-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 800px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    .title {
      font-size: 2.5rem;
      font-weight: 600;
      margin: 0;
      color: white;
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
    width: 200px;
    height: 200px;
  }

  .details-section {
    width: 100%;
    max-width: none;

          .header .title {
      font-size: 2rem;
      color: white;
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
    width: 150px;
    height: 150px;
  }

  .details-section {
    .header .title {
      font-size: 1.5rem;
    }

    .content .description {
      font-size: 1rem;
    }
  }
}
</style>