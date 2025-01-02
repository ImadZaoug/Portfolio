# frontend/src/components/solutions/CrystallizingSolution.vue
<template>
  <svg viewBox="0 0 100 120" class="solution-jar">
    <!-- Glass highlights -->
    <defs>
      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color: white; stop-opacity: 0.1" />
        <stop offset="20%" style="stop-color: white; stop-opacity: 0.3" />
        <stop offset="100%" style="stop-color: white; stop-opacity: 0.1" />
      </linearGradient>
      <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color: #e879f9; stop-opacity: 0.6" />
        <stop offset="100%" style="stop-color: #d946ef; stop-opacity: 0" />
      </radialGradient>
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
        fill="#fae8ff"
      >
        <animate
          attributeName="y"
          values="45;43;45"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      
      <!-- Crystals -->
      <g v-for="crystal in crystals" :key="crystal.id">
        <polygon
          :points="crystal.points"
          fill="#f0abfc"
          :style="{ opacity: crystal.opacity }"
        >
          <animate
            attributeName="opacity"
            :values="`${crystal.opacity};${crystal.opacity * 1.3};${crystal.opacity}`"
            :dur="`${crystal.duration}s`"
            repeatCount="indefinite"
          />
        </polygon>
      </g>

      <!-- Glow effects -->
      <circle
        v-for="glow in glowPoints"
        :key="glow.id"
        :cx="glow.x"
        :cy="glow.y"
        :r="glow.radius"
        fill="url(#crystalGlow)"
        :style="{ opacity: glow.opacity }"
      >
        <animate
          attributeName="opacity"
          :values="`${glow.opacity};${glow.opacity * 0.5};${glow.opacity}`"
          :dur="`${glow.duration}s`"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const crystals = ref([]);
const glowPoints = ref([]);

const generateCrystalPoints = (x, y, size) => {
  const points = [];
  const angles = [0, 72, 144, 216, 288]; // Pentagon angles
  angles.forEach(angle => {
    const radian = (angle * Math.PI) / 180;
    points.push(
      x + size * Math.cos(radian),
      y + size * Math.sin(radian)
    );
  });
  return points.join(' ');
};

onMounted(() => {
  // Generate crystals
  const crystalCount = 6;
  for (let i = 0; i < crystalCount; i++) {
    crystals.value.push({
      id: i,
      points: generateCrystalPoints(
        Math.random() * 30 + 35,
        Math.random() * 40 + 55,
        Math.random() * 4 + 3
      ),
      opacity: Math.random() * 0.3 + 0.7,
      duration: Math.random() * 2 + 2
    });
  }

  // Generate glow points
  const glowCount = 4;
  for (let i = 0; i < glowCount; i++) {
    glowPoints.value.push({
      id: i,
      x: Math.random() * 30 + 35,
      y: Math.random() * 40 + 55,
      radius: Math.random() * 8 + 4,
      opacity: Math.random() * 0.2 + 0.1,
      duration: Math.random() * 3 + 2
    });
  }
});
</script>

<style scoped>
.solution-jar {
  width: 100%;
  height: 100%;
}
</style>