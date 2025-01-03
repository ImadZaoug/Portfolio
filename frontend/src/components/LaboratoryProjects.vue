<template>
  <v-container 
    fluid 
    class="laboratory-container" 
    :class="{ 'has-selected': selectedSolution }"
  >
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-6">
          <v-icon icon="mdi-flask" size="large" color="primary" class="mr-2"></v-icon>
          Research & Development Projects
        </h1>
      </v-col>
    </v-row>

    <!-- Scrollable grid container -->
    <div class="solutions-grid-container">
      <!-- Industrial Projects Section -->
      <section class="project-section">
        <h2 class="text-h4 font-weight-bold mb-4">
          <v-icon icon="mdi-factory" color="primary" class="mr-2"></v-icon>
          Industrial Collaboration Projects
        </h2>
        <p class="section-description mb-6">
          Advanced 3D simulation and modeling projects developed in collaboration with industry partners
        </p>
        
        <v-row class="solutions-grid">
          <v-col 
            v-for="solution in industrialProjects" 
            :key="solution.id"
            cols="12" sm="6" md="4"
            class="solution-wrapper"
            :class="{ 'blur-this': selectedSolution && selectedSolution.id !== solution.id }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                @click="handleSolutionClick(solution)"
                :elevation="isHovering ? 8 : 2"
                class="solution-card"
              >
                <div class="solution-content">
                  <div class="jar-container">
                    <component 
                      :is="getSolutionComponent(solution.type)"
                      :class="{ 'hover-animation': isHovering }"
                    />
                  </div>
                  <v-card-text class="solution-info">
                    <h3 class="text-h6 font-weight-bold">{{ solution.title }}</h3>
                    <p class="text-body-2">{{ solution.shortDesc }}</p>
                  </v-card-text>
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </section>

      <!-- Personal Projects Section -->
      <section class="project-section mt-12">
        <h2 class="text-h4 font-weight-bold mb-4">
          <v-icon icon="mdi-lightbulb" color="primary" class="mr-2"></v-icon>
          Personal Innovation Projects
        </h2>
        <p class="section-description mb-6">
          Self-initiated projects exploring business ideas and technical concepts
        </p>
        
        <v-row class="solutions-grid">
          <v-col 
            v-for="solution in personalProjects" 
            :key="solution.id"
            cols="12" sm="6" md="4"
            class="solution-wrapper"
            :class="{ 'blur-this': selectedSolution && selectedSolution.id !== solution.id }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                @click="handleSolutionClick(solution)"
                :elevation="isHovering ? 8 : 2"
                class="solution-card"
              >
                <div class="solution-content">
                  <div class="jar-container">
                    <component 
                      :is="getSolutionComponent(solution.type)"
                      :class="{ 'hover-animation': isHovering }"
                    />
                  </div>
                  <v-card-text class="solution-info">
                    <h3 class="text-h6 font-weight-bold">{{ solution.title }}</h3>
                    <p class="text-body-2">{{ solution.shortDesc }}</p>
                  </v-card-text>
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </section>
    </div>

    <!-- Project Details Dialog -->
    <v-dialog
      v-model="showDetails"
      max-width="800"
      transition="dialog-bottom-transition"
      :fullscreen="$vuetify.display.mobile"
    >
      <v-card v-if="selectedSolution" class="project-details">
        <v-toolbar color="primary">
          <v-toolbar-title>{{ selectedSolution.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDetails">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="project-details-content">
          <v-row>
            <v-col cols="12" md="4">
              <div class="focused-jar-container">
                <component 
                  :is="getSolutionComponent(selectedSolution.type)"
                  class="enlarged"
                />
              </div>
            </v-col>
            
            <v-col cols="12" md="8">
              <p class="text-body-1 mb-6">{{ selectedSolution.fullDesc }}</p>
              
              <h3 class="text-h6 font-weight-bold mb-3">Technologies Used</h3>
              <div class="tech-stack">
                <v-chip
                  v-for="tech in selectedSolution.technologies"
                  :key="tech"
                  color="primary"
                  variant="outlined"
                  class="ma-1"
                >
                  {{ tech }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// Import all solution components
import BubblingSolution from './solutions/BubblingSolution.vue'
import PulsingSolution from './solutions/PulsingSolution.vue'
import ReactiveSolution from './solutions/ReactiveSolution.vue'
import CrystallizingSolution from './solutions/CrystallizingSolution.vue'
import CirculatingSolution from './solutions/CirculatingSolution.vue'
import TestTubeSolution from './solutions/TestTubeSolution.vue'
import ChainReactionSolution from './solutions/ChainReactionSolution.vue'
import DiffusionSolution from './solutions/DiffusionSolution.vue'
import FreezingSolution from './solutions/FreezingSolution.vue'
import LaserSolution from './solutions/LaserSolution.vue'
import VortexSolution from './solutions/VortexSolution.vue'

export default {
  name: 'LaboratoryProjects',
  
  components: {
    BubblingSolution,
    PulsingSolution,
    ReactiveSolution,
    CrystallizingSolution,
    CirculatingSolution,
    TestTubeSolution,
    ChainReactionSolution,
    DiffusionSolution,
    FreezingSolution,
    LaserSolution,
    VortexSolution
  },

  setup() {
    const store = useStore()
    const selectedSolution = ref(null)
    const showDetails = ref(false)

    const industrialProjects = computed(() => store.state.projects.industrialProjects)
    const personalProjects = computed(() => store.state.projects.personalProjects)

    const getSolutionComponent = (type) => {
      const componentMap = {
        bubbling: 'BubblingSolution',
        pulsing: 'PulsingSolution',
        reactive: 'ReactiveSolution',
        crystallizing: 'CrystallizingSolution',
        circulating: 'CirculatingSolution',
        testTube: 'TestTubeSolution',
        chain: 'ChainReactionSolution',
        diffusion: 'DiffusionSolution',
        freezing: 'FreezingSolution',
        laser: 'LaserSolution',
        vortex: 'VortexSolution'
      }
      return componentMap[type]
    }

    const handleSolutionClick = async (solution) => {
      selectedSolution.value = solution
      showDetails.value = true
    }

    const closeDetails = () => {
      showDetails.value = false
      selectedSolution.value = null
    }

    return {
      selectedSolution,
      showDetails,
      industrialProjects,
      personalProjects,
      getSolutionComponent,
      handleSolutionClick,
      closeDetails
    }
  }
}
</script>

<style lang="scss" scoped>
.laboratory-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface), 0.8),
    rgba(var(--v-theme-surface), 0.95)
  );
}

.solutions-grid-container {
  height: 100%;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(var(--v-theme-surface), 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-primary), 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(var(--v-theme-primary), 0.3);
    }
  }
}

.section-description {
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 800px;
  margin: 0 auto;
}

.solution-wrapper {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  
  &.blur-this {
    filter: blur(4px);
    opacity: 0.6;
    transform: scale(0.98);
    pointer-events: none;
  }
}

.solution-card {
  height: 300px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-8px);
  }
}

.solution-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.jar-container {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface), 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(var(--v-theme-primary), 0.1),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  .hover-animation {
    transform: scale(1.1);
    transition: transform 0.3s ease;
  }
}

.solution-info {
  padding: 1rem;
  background: rgba(var(--v-theme-surface), 0.9);
  border-top: 1px solid rgba(var(--v-theme-primary), 0.1);

  h3 {
    margin-bottom: 0.5rem;
    color: rgb(var(--v-theme-primary));
  }

  p {
    opacity: 0.8;
    line-height: 1.4;
  }
}

.project-details {
  .focused-jar-container {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--v-theme-surface), 0.5);
    border-radius: 8px;
    overflow: hidden;
    
    .enlarged {
      transform: scale(1.2);
    }
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

// Mobile optimizations
@media (max-width: 600px) {
  .laboratory-container {
    padding: 1rem;
  }

  .solution-card {
    height: 250px;
  }

  .jar-container {
    padding: 1rem;
  }

  .solution-info {
    h3 {
      font-size: 1.1rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
}
</style>