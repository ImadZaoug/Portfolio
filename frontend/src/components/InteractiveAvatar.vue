<template>
  <div class="avatar-container" @mousemove="handleMouseMove" @click="handleClick">
    <svg
      class="avatar"
      :style="avatarStyle"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Body -->
      <circle
        cx="100"
        cy="100"
        r="50"
        :fill="currentColor"
        class="body"
        :class="{ 'is-clicked': isClicked }"
      />
      
      <!-- Eyes -->
      <g class="eyes" :transform="eyesRotation">
        <circle
          cx="85"
          cy="90"
          r="8"
          fill="white"
        />
        <circle
          cx="115"
          cy="90"
          r="8"
          fill="white"
        />
        <circle
          :cx="85 + eyeMovement.x"
          :cy="90 + eyeMovement.y"
          r="4"
          fill="#2c3e50"
          class="pupil"
        />
        <circle
          :cx="115 + eyeMovement.x"
          :cy="90 + eyeMovement.y"
          r="4"
          fill="#2c3e50"
          class="pupil"
        />
      </g>

      <!-- Mouth -->
      <path
        :d="mouthPath"
        fill="none"
        stroke="#2c3e50"
        stroke-width="3"
        stroke-linecap="round"
        class="mouth"
      />

      <!-- Glasses (optional) -->
      <g class="glasses" v-if="currentSection === 4">
        <rect x="75" y="82" width="20" height="16" rx="8" fill="none" stroke="#2c3e50" stroke-width="2"/>
        <rect x="105" y="82" width="20" height="16" rx="8" fill="none" stroke="#2c3e50" stroke-width="2"/>
        <line x1="95" y1="90" x2="105" y2="90" stroke="#2c3e50" stroke-width="2"/>
      </g>
    </svg>

    <!-- Navigation Hint -->
    <div class="navigation-hint" :class="{ 'show-hint': showHint }">
      {{ currentHint }}
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'InteractiveAvatar',
  props: {
    currentSection: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const mousePosition = ref({ x: 0, y: 0 })
    const isClicked = ref(false)
    const showHint = ref(false)
    const currentHint = ref('')
    
    const hints = [
      "Hi! I'm your guide!",
      "Let me tell you about myself!",
      "Check out my awesome projects!",
      "Here's where I've worked!",
      "These are my technical skills!",
      "My soft skills make me unique!",
      "Want to know what I love?"
    ]

    const colors = [
      '#42b883', // Default Vue green
      '#64b5f6', // About - Blue
      '#ffd54f', // Projects - Yellow
      '#81c784', // Experience - Light Green
      '#7986cb', // Technical - Indigo
      '#f06292', // Soft Skills - Pink
      '#ff8a65'  // Interests - Orange
    ]

    const currentColor = computed(() => colors[props.currentSection])

    const eyeMovement = computed(() => {
      const maxMove = 3
      const x = (mousePosition.value.x - 0.5) * maxMove
      const y = (mousePosition.value.y - 0.5) * maxMove
      return { x, y }
    })

    const mouthPath = computed(() => {
      const happy = isClicked.value
      const startX = 80
      const endX = 120
      const baseY = 110
      const controlY = baseY + (happy ? -10 : 10)
      
      return `M ${startX} ${baseY} Q 100 ${controlY} ${endX} ${baseY}`
    })

    const handleMouseMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      mousePosition.value = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height
      }
    }

    const handleClick = () => {
      isClicked.value = true
      setTimeout(() => {
        isClicked.value = false
      }, 1000)
    }

    const avatarStyle = computed(() => {
      const x = (mousePosition.value.x - 0.5) * 20
      const y = (mousePosition.value.y - 0.5) * 20
      return {
        transform: `translate(${x}px, ${y}px)`
      }
    })

    const eyesRotation = computed(() => {
      const angle = Math.atan2(
        mousePosition.value.y - 0.5,
        mousePosition.value.x - 0.5
      ) * (180 / Math.PI)
      return `rotate(${angle * 0.1} 100 90)`
    })

    watch(() => props.currentSection, (newSection) => {
      currentHint.value = hints[newSection]
      showHint.value = true
      setTimeout(() => {
        showHint.value = false
      }, 3000)
    })

    return {
      mousePosition,
      eyeMovement,
      mouthPath,
      isClicked,
      showHint,
      currentHint,
      currentColor,
      handleMouseMove,
      handleClick,
      avatarStyle,
      eyesRotation
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-container {
  position: fixed;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  height: 100px;
  z-index: 1000;
}

.avatar {
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
  cursor: pointer;

  .body {
    transition: transform 0.3s ease, fill 0.3s ease;
    
    &.is-clicked {
      transform: scale(1.1);
    }
  }

  .eyes {
    transition: transform 0.2s ease;
  }

  .pupil {
    transition: all 0.1s ease-out;
  }

  .mouth {
    transition: all 0.2s ease;
  }

  .glasses {
    transition: transform 0.3s ease;
    transform-origin: center;
    animation: glassesAppear 0.5s ease;
  }
}

.navigation-hint {
  position: absolute;
  right: 120%;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
  font-size: 0.9rem;
  color: #2c3e50;

  &.show-hint {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  &::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 10px solid white;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
}

@keyframes glassesAppear {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .avatar-container {
    right: 80px;
    width: 80px;
    height: 80px;
  }

  .navigation-hint {
    font-size: 0.8rem;
    padding: 0.6rem 1rem;
  }
}
</style>