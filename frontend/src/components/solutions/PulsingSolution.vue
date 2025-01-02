# frontend/src/components/solutions/PulsingSolution.vue
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
        y="45" 
        width="46" 
        height="68" 
        fill="#bbdefb"
        class="liquid-base"
      >
        <animate
          attributeName="y"
          values="45;43;45"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      
      <!-- Pulsing circles -->
      <circle 
        cx="50" 
        cy="75" 
        :r="innerRadius" 
        fill="#2196f3" 
        opacity="0.8"
      />
      <circle 
        cx="50" 
        cy="75" 
        :r="outerRadius" 
        fill="#2196f3" 
        opacity="0.2"
      />
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const innerRadius = ref(15);
const outerRadius = ref(22);
const pulseInterval = ref(null);

const pulse = () => {
  let phase = 0;
  const animate = () => {
    phase += 0.05;
    innerRadius.value = 15 + Math.sin(phase) * 3;
    outerRadius.value = 22 + Math.sin(phase) * 3;
    pulseInterval.value = requestAnimationFrame(animate);
  };
  animate();
};

onMounted(() => {
  pulse();
});

onUnmounted(() => {
  if (pulseInterval.value) {
    cancelAnimationFrame(pulseInterval.value);
  }
});
</script>

<style scoped>
.solution-jar {
  width: 100%;
  height: 100%;
}
</style>