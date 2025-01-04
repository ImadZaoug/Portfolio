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
        <!-- Industrial Projects Section -->
        <div class="project-section">
          <h2 class="section-title">Industrial Collaboration Projects</h2>
          <p class="section-description">Advanced 3D simulation and modeling projects developed in collaboration with industry partners</p>
          
          <div class="solutions-grid">
            <div 
              v-for="solution in industrialProjects" 
              :key="solution.id"
              class="solution-wrapper"
            >
              <div 
                class="solution-card"
                @click="handleSolutionClick(solution)"
              >
                <div class="solution-content">
                  <div class="jar-container">
                    <component 
                      :is="getSolutionComponent(solution.type)"
                    />
                  </div>
                  <div class="solution-info">
                    <h3>{{ solution.title }}</h3>
                    <p>{{ solution.shortDesc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Projects Section -->
        <div class="project-section">
          <h2 class="section-title">Personal Innovation Projects</h2>
          <p class="section-description">Self-initiated projects exploring business ideas and technical concepts</p>
          
          <div class="solutions-grid">
            <div 
              v-for="solution in personalProjects" 
              :key="solution.id"
              class="solution-wrapper"
            >
              <div 
                class="solution-card"
                @click="handleSolutionClick(solution)"
              >
                <div class="solution-content">
                  <div class="jar-container">
                    <component 
                      :is="getSolutionComponent(solution.type)"
                    />
                  </div>
                  <div class="solution-info">
                    <h3>{{ solution.title }}</h3>
                    <p>{{ solution.shortDesc }}</p>
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
import { ref } from 'vue';
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
  isExpanded: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['solution-expand']);
/* eslint-enable no-undef */

// Industrial (3D) Projects
const industrialProjects = ref([
  {
    id: 1,
    title: "Molecular Dynamics Simulator",
    type: "testTube",
    shortDesc: "Chemical reaction simulation system",
    fullDesc: "Advanced molecular dynamics simulation platform for modeling chemical reactions and molecular interactions. Features real-time visualization of atomic interactions, energy calculations, and configurable environmental parameters.",
    technologies: ["CUDA", "OpenGL", "C++", "Python"]
  },
  {
    id: 2,
    title: "Chain Reaction Engine",
    type: "chain",
    shortDesc: "Complex reaction simulation platform",
    fullDesc: "Sophisticated simulation engine for modeling chain reactions and complex molecular interactions. Features real-time visualization of reaction pathways and energy transfer mechanisms.",
    technologies: ["Three.js", "WebGL", "GLSL", "Web Workers"]
  },
  {
    id: 3,
    title: "Diffusion Analysis System",
    type: "diffusion",
    shortDesc: "Particle diffusion visualization",
    fullDesc: "Advanced system for analyzing and visualizing particle diffusion in various mediums. Includes real-time tracking and statistical analysis of diffusion patterns.",
    technologies: ["Three.js", "WebGL", "Python", "TensorFlow"]
  },
  {
    id: 4,
    title: "Phase Transition Analyzer",
    type: "freezing",
    shortDesc: "Phase change simulation platform",
    fullDesc: "Comprehensive simulation platform for studying phase transitions in materials. Features temperature-dependent behavior analysis and crystallization pattern prediction.",
    technologies: ["CUDA", "C++", "Python", "OpenGL"]
  },
  {
    id: 5,
    title: "Laser Interaction Simulator",
    type: "laser",
    shortDesc: "Laser-matter interaction modeling",
    fullDesc: "High-precision simulator for modeling laser interactions with various materials. Includes heat transfer analysis and ablation effect predictions.",
    technologies: ["CUDA", "OpenGL", "Python", "NumPy"]
  },
  {
    id: 6,
    title: "Fluid Dynamics Engine",
    type: "vortex",
    shortDesc: "Advanced fluid simulation system",
    fullDesc: "State-of-the-art fluid dynamics simulation engine supporting various flow regimes and boundary conditions. Features real-time visualization of complex flow patterns.",
    technologies: ["OpenGL", "C++", "CUDA", "Python"]
  }
]);

// Personal Innovation Projects
const personalProjects = ref([
  {
    id: 7,
    title: "Data Analysis Engine",
    type: "bubbling",
    shortDesc: "Advanced data processing pipeline",
    fullDesc: "A sophisticated data analysis engine built with Python and Vue.js, featuring real-time processing capabilities and interactive visualizations. The system processes large datasets efficiently and provides intuitive visual representations of complex data patterns.",
    technologies: ["Python", "Vue.js", "D3.js", "Flask"]
  },
  {
    id: 8,
    title: "AI Model Trainer",
    type: "pulsing",
    shortDesc: "Machine learning model training platform",
    fullDesc: "An intuitive platform for training and evaluating machine learning models, with support for various algorithms and datasets. Features include automated hyperparameter tuning, real-time performance metrics, and interactive model exploration tools.",
    technologies: ["TensorFlow", "Scikit-learn", "Vue.js", "FastAPI"]
  },
  {
    id: 9,
    title: "Neural Network Visualizer",
    type: "reactive",
    shortDesc: "Interactive neural network visualization",
    fullDesc: "A real-time visualization tool for neural networks, allowing users to understand and interact with different network architectures. The system provides dynamic visualization of network layers, weights, and activation patterns during training and inference.",
    technologies: ["Three.js", "Vue.js", "WebGL", "Python"]
  },
  {
    id: 10,
    title: "Database Schema Crystallizer",
    type: "crystallizing",
    shortDesc: "Dynamic database optimization system",
    fullDesc: "An innovative database schema optimization tool that analyzes query patterns and data relationships to automatically suggest and implement optimal database structures. Features real-time performance monitoring and automated index management.",
    technologies: ["PostgreSQL", "TypeScript", "GraphQL", "Redis"]
  },
  {
    id: 11,
    title: "Microservices Orchestrator",
    type: "circulating",
    shortDesc: "Cloud service management platform",
    fullDesc: "A comprehensive microservices management platform that handles service discovery, load balancing, and automated scaling. Provides real-time monitoring, intelligent routing, and self-healing capabilities for distributed systems.",
    technologies: ["Kubernetes", "Docker", "Node.js", "Prometheus"]
  }
]);

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
</style>