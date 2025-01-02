# frontend/src/components/solutions/ReactiveSolution.vue
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
      
      <!-- Liquid base -->
      <rect 
        x="27" 
        y="48" 
        width="46" 
        height="65" 
        fill="#ffecb3"
      >
        <animate
          attributeName="y"
          values="48;46;48"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </rect>
      
      <!-- Reactive particles -->
      <template v-for="particle in particles" :key="particle.id">
        <line
          :x1="particle.x1"
          :y1="particle.y1"
          :x2="particle.currentX2"
          :y2="particle.currentY2"
          stroke="#ffa000"
          stroke-width="1.5"
        />
      </template>
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const particles = ref([]);
const animationFrame = ref(null);

const createParticle = () => ({
  id: Math.random(),
  x1: Math.random() * 30 + 35,
  y1: Math.random() * 30 + 60,
  x2: Math.random() * 30 + 35,
  y2: Math.random() * 30 + 60,
  currentX2: 0,
  currentY2: 0,
  phase: Math.random() * Math.PI * 2
});

const animateParticles = () => {
  particles.value.forEach(particle => {
    particle.phase += 0.02;
    const progress = (Math.sin(particle.phase) + 1) / 2;
    
    particle.currentX2 = particle.x1 + (particle.x2 - particle.x1) * progress;
    particle.currentY2 = particle.y1 + (particle.y2 - particle.y1) * progress;
  });
  
  animationFrame.value = requestAnimationFrame(animateParticles);
};

onMounted(() => {
  particles.value = Array(4).fill(null).map(createParticle);
  animateParticles();
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
});
</script>

<style scoped>
.solution-jar {
  width: 100%;
  height: 100%;
}
</style>