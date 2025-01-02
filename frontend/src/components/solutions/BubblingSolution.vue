# frontend/src/components/solutions/BubblingSolution.vue
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
      class="jar-neck"
    />
    
    <path
      d="M30,10 L70,10 Q71,8 70,6 L30,6 Q29,8 30,10 Z"
      fill="url(#glassGradient)"
      stroke="#ccc"
      stroke-width="2"
      class="jar-rim"
    />
    
    <path
      d="M25,30 Q25,28 35,30 L65,30 Q75,28 75,30 L75,110 Q75,115 65,115 L35,115 Q25,115 25,110 Z"
      fill="url(#glassGradient)"
      stroke="#ccc"
      stroke-width="2"
      class="jar-body"
    />
    
    <!-- Content area -->
    <g clip-path="url(#jarContent)">
      <clipPath id="jarContent">
        <path d="M27,32 L73,32 L73,113 Q73,113 65,113 L35,113 Q27,113 27,113 Z" />
      </clipPath>
      
      <!-- Liquid base -->
      <rect 
        x="27" 
        y="50" 
        width="46" 
        height="63" 
        fill="#c8e6c9"
        class="liquid-base"
      >
        <animate
          attributeName="y"
          values="50;48;50"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>
      
      <!-- Dynamic bubbles -->
      <circle
        v-for="bubble in bubbles"
        :key="bubble.id"
        :cx="bubble.x"
        :cy="bubble.y"
        :r="bubble.size"
        fill="#81c784"
        :style="{ opacity: bubble.opacity }"
        class="bubble"
      />
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const bubbles = ref([]);
const bubbleInterval = ref(null);

const createBubble = () => ({
  id: Math.random(),
  x: Math.random() * 40 + 30,
  y: 110,
  size: Math.random() * 4 + 2,
  opacity: 0.6
});

const animateBubble = (bubble) => {
  const duration = 4000;
  const startTime = Date.now();
  const startY = bubble.y;
  const targetY = 45;
  
  const animate = () => {
    const currentTime = Date.now();
    const progress = (currentTime - startTime) / duration;
    
    if (progress >= 1) {
      const index = bubbles.value.indexOf(bubble);
      if (index !== -1) {
        bubbles.value.splice(index, 1);
      }
      return;
    }
    
    bubble.y = startY - (startY - targetY) * progress;
    bubble.opacity = 0.6 * (1 - progress);
    
    requestAnimationFrame(animate);
  };
  
  requestAnimationFrame(animate);
};

onMounted(() => {
  bubbleInterval.value = setInterval(() => {
    const newBubble = createBubble();
    bubbles.value.push(newBubble);
    animateBubble(newBubble);
  }, 800);
});

onUnmounted(() => {
  if (bubbleInterval.value) {
    clearInterval(bubbleInterval.value);
  }
});
</script>

<style scoped>
.solution-jar {
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: transform 0.5s ease-in-out;
}

.jar-neck,
.jar-rim,
.jar-body {
  transition: all 0.3s ease-in-out;
}

.bubble {
  transition: opacity 0.3s ease-in-out;
}

.liquid-base {
  transition: all 0.3s ease-in-out;
}

/* Hover effects */
.solution-jar:hover {
  transform: scale(1.02);
}

/* Enlarged state */
.solution-jar.enlarged {
  transform: scale(1.1);
}

/* Print styles */
@media print {
  .solution-jar {
    transform: none !important;
  }

  .bubble {
    display: none;
  }
}
</style>