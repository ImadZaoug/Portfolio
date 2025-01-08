# frontend/src/components/LaboratoryProjects.vue
<template>
  <div 
    class="laboratory-container" 
    :class="{ 'has-selected': props.isExpanded }"
  >
    <div :class="{ 'blurred': props.isExpanded }">
      <h1 class="main-title">Research & Development Projects</h1>

      <!-- Scrollable grid container -->
      <div class="solutions-grid-container">
        <!-- 3D Projects Section -->
        <div class="project-section">
          <h2 class="section-title">Professional Projects</h2>
          <p class="section-description">Professional projects in real use cases</p>
          
          <div class="solutions-grid">
            <div 
              v-for="project in projectsStore.getThreeDProjects" 
              :key="project.id"
              class="solution-wrapper"
            >
              <div 
                class="solution-card"
                @click="handleSolutionClick(project)"
              >
                <div class="solution-content">
                  <div class="jar-container">
                    <component 
                      :is="getSolutionComponent(project.type)"
                    />
                  </div>
                  <div class="solution-info">
                    <h3>{{ project.title }}</h3>
                    <p>{{ project.shortDesc }}</p>
                    <div class="project-links" v-if="project.links">
                      <v-btn
                        v-if="project.links.github"
                        :href="project.links.github"
                        target="_blank"
                        icon="mdi-github"
                        variant="text"
                        size="small"
                        class="link-btn"
                      />
                      <v-btn
                        v-if="project.links.huggingface"
                        :href="project.links.huggingface"
                        target="_blank"
                        icon="mdi-brain"
                        variant="text"
                        size="small"
                        class="link-btn"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Projects Section -->
        <div class="project-section">
          <h2 class="section-title">Additional Projects</h2>
          <p class="section-description">Academic and professional development initiatives</p>
          
          <div class="solutions-grid">
            <div 
              v-for="project in projectsStore.getOtherProjects" 
              :key="project.id"
              class="solution-wrapper"
            >
              <div 
                class="solution-card"
                @click="handleSolutionClick(project)"
              >
                <div class="solution-content">
                  <div class="jar-container">
                    <component 
                      :is="getSolutionComponent(project.type)"
                    />
                  </div>
                  <div class="solution-info">
                    <h3>{{ project.title }}</h3>
                    <p>{{ project.shortDesc }}</p>
                    <div class="project-links" v-if="project.links">
                      <v-btn
                        v-if="project.links.github"
                        :href="project.links.github"
                        target="_blank"
                        icon="mdi-github"
                        variant="text"
                        size="small"
                        class="link-btn"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProjectsStore } from '@/stores/projects';
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

const projectsStore = useProjectsStore();

/* eslint-disable no-undef */
const props = defineProps({
  isExpanded: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['solution-expand']);
/* eslint-enable no-undef */

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

const handleSolutionClick = (solution) => {
  emit('solution-expand', { expanded: true, solution });
};
</script>

<style lang="scss" scoped>
.laboratory-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  
  &.has-selected {
    .solutions-grid {
      pointer-events: none;
    }
  }
}

.main-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: var(--text-color);
}

.project-section {
  margin-bottom: 3rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 2rem;
  }
}
.section-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.section-description {
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 2rem;
}

.solutions-grid-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  min-height: 0;  // Important for flex overflow
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding-bottom: 2rem;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;

  &.blur-this {
    filter: blur(6px);
    opacity: 0.2;
    transform: scale(0.95) translateZ(-100px);
  }
}

.solution-wrapper {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  
  &.blur-this {
    filter: blur(6px);
    opacity: 0.2;
    transform: scale(0.95);
  }
}

.solution-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  height: 16rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-0.5rem) scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

.solution-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.jar-container {
  flex: 1;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.solution-info {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  
  h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    color: #2c3e50;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: #6c757d;
  }
}

.focused-solution {
  position: fixed;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 250px;
  height: 350px;
  cursor: pointer;
}

.focused-jar {
  width: 100%;
  height: 100%;
  transform-origin: center;
  
  .solution-jar {
    width: 100%;
    height: 100%;
  }

  .enlarged {
    transform: scale(1.2);
  }
}

.solution-details {
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(0, -50%);
  width: 40%;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 10;
  overflow: hidden;
}

.details-content {
  opacity: 0;
  animation: content-reveal 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
}

@keyframes content-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.focus-enter-active,
.focus-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.focus-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.focus-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.focus-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.focus-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.message-enter-active,
.message-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-enter-from {
  opacity: 0;
  transform: translate(-20%, -50%) scale(0.9);
}

.message-enter-to {
  opacity: 1;
  transform: translate(0, -50%) scale(1);
}

.message-leave-from {
  opacity: 1;
  transform: translate(0, -50%) scale(1);
}

.message-leave-to {
  opacity: 0;
  transform: translate(20%, -50%) scale(0.9);
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.6s ease;
  pointer-events: none;
  z-index: 5;
  
  &.active {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    pointer-events: auto;
  }
}

.message-header {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #2c3e50;
  }
}

.message-body {
  padding: 2rem;
  
  p {
    line-height: 1.6;
    margin-bottom: 1.5rem;
    color: #495057;
  }
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: #f1f3f5;
  color: #495057;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    transform: rotate(90deg);
  }
  
  .close-icon {
    font-size: 1.5rem;
    color: #6c757d;
  }
}

@media (prefers-color-scheme: dark) {
  .solution-card {
    background: #2c3e50;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .solution-info {
    background: #243342;
    border-color: #34495e;

    h3 {
      color: #ecf0f1;
    }

    p {
      color: #bdc3c7;
    }
  }

  .solution-details {
    background: #2c3e50;
  }

  .message-header {
    background: #243342;
    border-color: #34495e;

    h2 {
      color: #ecf0f1;
    }
  }

  .message-body {
    p {
      color: #ecf0f1;
    }
  }

  .tech-tag {
    background: #34495e;
    color: #ecf0f1;

    &:hover {
      background: #2c3e50;
    }
  }

  .close-button {
    &:hover {
      background: #34495e;
    }

    .close-icon {
      color: #ecf0f1;
    }
  }

  .solutions-grid-container {
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

@media (min-width: 1400px) {
  .solutions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .solutions-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .solution-details {
    width: 45%;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .solutions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .solution-details {
    width: 50%;
    left: 55%;
  }
}

@media (max-width: 767px) {
  .laboratory-container {
    padding: 1rem;
  }

  .solutions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .solution-card {
    height: 18rem;
  }

  .focused-solution {
    left: 30%;
  }
  
  .solution-details {
    width: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .message-enter-from,
  .message-leave-to {
    transform: translate(-50%, -30%) scale(0.9);
  }

  .message-enter-to,
  .message-leave-from {
    transform: translate(-50%, -50%) scale(1);
  }

  .message-header {
    padding: 1rem;
    
    h2 {
      font-size: 1.25rem;
    }
  }

  .message-body {
    padding: 1rem;

    p {
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  }

  .tech-stack {
    gap: 0.4rem;
  }

  .tech-tag {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media print {
  .laboratory-container {
    height: auto;
    overflow: visible;
    padding: 0;
  }

  .solutions-grid-container {
    overflow: visible;
    padding: 0;
  }

  .solutions-grid {
    display: block;
  }

  .solution-wrapper {
    page-break-inside: avoid;
    margin-bottom: 2rem;
  }

  .solution-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
}

.project-links {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  .link-btn {
    opacity: 0.7;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 1;
    }
  }
}
</style>