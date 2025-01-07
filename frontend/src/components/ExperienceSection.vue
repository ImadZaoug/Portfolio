# frontend/src/components/ExperienceSection.vue
<template>
  <div class="experience-section">
    <h1 class="main-title">Professional Experiences</h1>
    
    <div class="experience-cards">
      <div v-for="(exp, index) in experience" 
           :key="index" 
           class="experience-card-wrapper"
           @click="$emit('experience-expand', { expanded: true, experience: exp })">
        <div class="experience-card" :class="{ 'is-flipped': flippedCards[index] }"
             @mouseenter="handleMouseEnter($event, index)"
             @mouseleave="handleMouseLeave($event, index)">
          <!-- Card Back -->
          <div class="experience-card-face card-back">
            <img 
              :src="`/images/${exp.company === 'AZAD Envirement' ? 'Azad' : exp.company}_card.png`" 
              :alt="`${exp.company} card back`"
              class="card-back-image"
            >
          </div>

          <!-- Card Front -->
          <div class="experience-card-face card-front">
            <div class="card-frame">
              <div class="corner top-left">
                <div class="number">{{ index + 1 }}</div>
                <div class="suit">
                  <v-icon size="small" color="primary">
                    {{ exp.company === 'ReciTAL' ? 'mdi-cards-spade' : 
                       exp.company === 'MASciR' ? 'mdi-cards-diamond' : 'mdi-cards-club' }}
                  </v-icon>
                </div>
              </div>
              <div class="corner bottom-right">
                <div class="number">{{ index + 1 }}</div>
                <div class="suit">
                  <v-icon size="small" color="primary">
                    {{ exp.company === 'ReciTAL' ? 'mdi-cards-spade' : 
                       exp.company === 'MASciR' ? 'mdi-cards-diamond' : 'mdi-cards-club' }}
                  </v-icon>
                </div>
              </div>

              <div class="logo-background">
                <img 
                  v-if="exp.company !== 'AZAD Envirement'"
                  :src="`/images/${exp.company.toLowerCase()}-logo.png`" 
                  :alt="`${exp.company} logo`"
                  :class="[
                    'background-logo',
                    { 'rotated': exp.company === 'ReciTAL' }
                  ]"
                >
                <div v-else class="azad-text">AZAD</div>
              </div>

              <div class="card-content">
                <div class="card-info">
                  <h3>{{ exp.position }}</h3>
                  <p class="period">{{ exp.period }}</p>
                  <p class="location">{{ exp.location }}</p>
                </div>

                <!-- Centered Suits Pattern -->
                <div class="suits-pattern" :class="`pattern-${index + 1}`">
                  <template v-for="n in (index + 1)" :key="n">
                    <v-icon size="32" color="primary" class="suit-icon">
                      {{ exp.company === 'ReciTAL' ? 'mdi-cards-spade' : 
                         exp.company === 'MASciR' ? 'mdi-cards-diamond' : 'mdi-cards-club' }}
                    </v-icon>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ExperienceSection',
  
  props: {
    experience: {
      type: Array,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    }
  },

  emits: ['experience-expand'],

  setup() {
    const flippedCards = ref(Array(4).fill(false))

    const handleMouseEnter = (event, index) => {
      const card = event.currentTarget
      const rect = card.getBoundingClientRect()
      const x = event.clientX - rect.left
      flippedCards.value[index] = x < rect.width / 2
    }

    const handleMouseLeave = (event, index) => {
      const card = event.currentTarget
      const rect = card.getBoundingClientRect()
      const x = event.clientX - rect.left
      if (x > rect.width / 2) {
        flippedCards.value[index] = false
      }
    }

    return {
      flippedCards,
      handleMouseEnter,
      handleMouseLeave
    }
  }
})
</script>

<style lang="scss" scoped>
.experience-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 2rem;
}

.main-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.section-description {
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 3rem;
}

.experience-cards {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: auto 0;
  flex-wrap: nowrap;
}

.experience-card-wrapper {
  flex: 0 0 200px;
  perspective: 1500px;
  cursor: pointer;
}

.experience-card {
  position: relative;
  width: 100%;
  padding-top: 140%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.is-flipped {
    transform: rotateY(180deg);
  }
}

.experience-card-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;

  &.card-back {
    background: none;
    .card-back-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &.card-front {
    transform: rotateY(180deg);
    background: var(--v-theme-surface);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.card-frame {
  position: relative;
  height: 100%;
  padding: 1rem;
  border: 2px solid var(--v-theme-primary);
  border-radius: 8px;
  margin: 0.25rem;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface), 0.1),
    rgba(var(--v-theme-surface), 0.05)
  );
}

.corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  z-index: 2;

  &.top-left {
    top: 0.5rem;
    left: 0.5rem;
  }

  &.bottom-right {
    bottom: 0.5rem;
    right: 0.5rem;
    transform: rotate(180deg);
  }

  .number {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--v-theme-primary);
  }
}

.logo-background {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
  pointer-events: none;

  .background-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    
    &.rotated {
      transform: rotate(90deg);
    }
  }

  .azad-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--v-theme-primary);
  }
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.card-info {
  text-align: center;
  padding-top: 0.5rem;

  h3 {
    font-size: 1rem;
    margin-bottom: 0.4rem;
    color: var(--v-theme-primary);
  }

  .period, .location {
    font-size: 0.8rem;
    margin: 0.2rem 0;
    opacity: 0.8;
  }
}

.suits-pattern {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 1rem;

  &.pattern-1 {
    .suit-icon {
      transform: scale(1.5);
    }
  }

  &.pattern-2 {
    grid-template-rows: repeat(2, 1fr);
    gap: 1rem;
  }

  &.pattern-3 {
    grid-template-rows: repeat(3, 1fr);
    gap: 0.5rem;
  }

  &.pattern-4 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

@media (max-width: 1200px) {
  .experience-cards {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 1rem;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(var(--v-theme-on-surface), 0.1);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--v-theme-primary);
      border-radius: 3px;
    }
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1rem;
  }

  .experience-card-wrapper {
    flex: 0 0 180px;
  }
}
</style>