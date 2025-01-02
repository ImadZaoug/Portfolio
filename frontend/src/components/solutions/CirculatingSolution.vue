# frontend/src/components/solutions/CirculatingSolution.vue
<template>
  <svg viewBox="0 0 100 120" class="solution-jar">
    <!-- Glass highlights -->
    <defs>
      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: white; stop-opacity: 0.1" />
        <stop offset="20%" style="stop-color: white; stop-opacity: 0.3" />
        <stop offset="100%" style="stop-color: white; stop-opacity: 0.1" />
      </linearGradient>
    </defs>
    
    <!-- Jar structure -->
    <path
      d="M35,10 L65,10 L65,30 L35,30 Z"
      fill="url(#glassGradient)"
      stroke="#ccc"
      stroke-width="2"
    />
    
    <path
      d="M30,10 L70,10 Q71,8 70,6 L30,6 Q29,8 30,10 Z"
      fill="url(#glassGradient)"
      stroke="#ccc"
      stroke-width="2"
    />
    
    <path
      d="M25,30 Q25,28 35,30 L65,30 Q75,28 75,30 L75,110 Q75,115 65,115 L35,115 Q25,115 25,110 Z"
      fill="url(#glassGradient)"
      stroke="#ccc"
      stroke-width="2"
    />
    
    <!-- Content area -->
    <g clip-path="url(#jarContent)">
      <clipPath id="jarContent">
        <path d="M27,32 L73,32 L73,113 Q73,113 65,113 L35,113 Q27,113 27,113 Z" />
      </clipPath>
      
      <!-- Base liquid -->
      <rect 
        x="27" 
        y="45" 
        width="46" 
        height="68" 
        fill="#dbeafe"
      >
        <animate
          attributeName="y"
          values="45;43;45"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      
      <!-- Circulating particles -->
      <circle
        v-for="particle in particles"
        :key="particle.id"
        :cx="particle.x"
        :cy="particle.y"
        :r="particle.size"
        :fill="particle.color"
        :style="{ opacity: particle.opacity }"
      >
        <animateMotion
          :dur="`${particle.duration}s`"
          repeatCount="indefinite"
          :path="getCircularPath(particle)"
        />
        <animate
          attributeName="opacity"
          :values="`${particle.opacity};${particle.opacity * 0.5};${particle.opacity}`"
          :dur="`${particle.duration * 0.5}s`"
          repeatCount="indefinite"
        />
      </circle>

      <!-- Energy lines -->
      <path
        v-for="line in energyLines"
        :key="line.id"
        :d="line.path"
        fill="none"
        stroke="#93c5fd"
        :stroke-width="line.width"
        :style="{ opacity: line.opacity }"
      >
        <animate
          attributeName="opacity"
          :values="`${line.opacity};${line.opacity * 0.3};${line.opacity}`"
          :dur="`${line.duration}s`"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const particles = ref([]);
const energyLines = ref([]);

const getCircularPath = (particle) => {
  const centerX = 50;
  const centerY = 75;
  const radiusX = particle.radius;
  const radiusY = particle.radius * 0.6;
  return `M ${centerX + radiusX} ${centerY} A ${radiusX} ${radiusY} 0 1 1 ${centerX - radiusX} ${centerY} A ${radiusX} ${radiusY} 0 1 1 ${centerX + radiusX} ${centerY}`;
};

const createEnergyLine = () => {
  const startX = Math.random() * 30 + 35;
  const startY = Math.random() * 40 + 55;
  const controlX = Math.random() * 20 + 40;
  const controlY = Math.random() * 20 + 65;
  const endX = Math.random() * 30 + 35;
  const endY = Math.random() * 40 + 75;

  return {
    id: Math.random(),
    path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
    width: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.2,
    duration: Math.random() * 2 + 2
  };
};

onMounted(() => {
  // Generate particles
  const particleCount = 8;
  for (let i = 0; i < particleCount; i++) {
    particles.value.push({
      id: i,
      x: 50,
      y: 75,
      size: Math.random() * 2 + 1,
      color: '#60a5fa',
      opacity: Math.random() * 0.4 + 0.6,
      duration: Math.random() * 4 + 4,
      radius: Math.random() * 15 + 10
    });
  }

  // Generate energy lines
  const lineCount = 6;
  for (let i = 0; i < lineCount; i++) {
    energyLines.value.push(createEnergyLine());
  }
});
</script>

<style scoped>
.solution-jar {
  width: 100%;
  height: 100%;
}
</style>