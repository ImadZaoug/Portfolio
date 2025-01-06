<template>
  <div 
    class="inventory-item"
    :class="{ 'is-equipped': isEquipped }"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
  >
    <v-hover v-slot="{ isHovering }">
      <v-card 
        class="item-card"
        :class="[
          'rarity-' + (item.rarity?.toLowerCase() || 'normal'),
          { 'on-hover': isHovering },
          { 'mythical-fire': item.hasFireEffect }
        ]"
        elevation="2"
      >
        <v-card-item>
          <div class="item-wrapper">
            <v-avatar :color="item.color" size="40" class="skill-icon">
              <v-icon color="white">{{ item.icon }}</v-icon>
            </v-avatar>
            <div class="item-details">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-level">
                Level {{ item.level }}
                <span v-if="item.rarity" class="rarity-tag">
                  {{ item.rarity.toLowerCase() }}
                </span>
              </div>
              <v-progress-linear
                :model-value="item.level"
                :color="item.color"
                height="4"
                rounded
                class="mt-1"
              />
            </div>
            <div v-if="isEquipped" class="equipped-indicator">
              <v-icon color="success" size="16">mdi-check-circle</v-icon>
            </div>
          </div>
        </v-card-item>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'InventoryItem',
  
  props: {
    item: {
      type: Object,
      required: true
    },
    isEquipped: {
      type: Boolean,
      default: false
    }
  },

  emits: ['dragstart']
}
</script>

<style lang="scss" scoped>
.inventory-item {
  cursor: grab;
  transition: all 0.3s ease;

  &.is-equipped {
    opacity: 0.6;
    pointer-events: none;
  }

  &:active {
    cursor: grabbing;
  }
}

.item-card {
  background: var(--v-theme-surface);
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: visible;
  position: relative;

  &.on-hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  // Rarity-specific styles
  &.rarity-common {
    border: 1px solid #C0C0C0;
    background: linear-gradient(45deg, rgba(192,192,192,0.1), rgba(168,168,168,0.1));
  }

  &.rarity-rare {
    border: 1px solid #9C27B0;
    background: linear-gradient(45deg, rgba(156,39,176,0.1), rgba(123,31,162,0.1));
    box-shadow: 0 0 10px rgba(156,39,176,0.2);
  }

  &.rarity-legendary {
    border: 1px solid #FFD700;
    background: linear-gradient(45deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1));
    box-shadow: 0 0 15px rgba(255,215,0,0.3);
  }

  &.mythical-fire {
    border: 1px solid #000;
    background: linear-gradient(45deg, rgba(0,0,0,0.9), rgba(51,51,51,0.9));
    box-shadow: 0 0 20px rgba(0,0,0,0.4);
    animation: mythicalPulse 2s infinite;

    .item-name, .item-level {
      color: white;
    }

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, #000, #333);
      border-radius: inherit;
      z-index: -1;
      animation: fireEffect 2s infinite;
    }
  }
}

.item-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.item-details {
  flex: 1;
  min-width: 0;

  .item-name {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-level {
    font-size: 0.875rem;
    opacity: 0.8;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.rarity-tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  text-transform: capitalize;

  .rarity-common & {
    background: #C0C0C0;
    color: #fff;
  }

  .rarity-rare & {
    background: #9C27B0;
    color: #fff;
  }

  .rarity-legendary & {
    background: #FFD700;
    color: #000;
  }

  .mythical-fire & {
    background: #000;
    color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
}

.equipped-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

@keyframes mythicalPulse {
  0% { box-shadow: 0 0 10px rgba(0,0,0,0.5); }
  50% { box-shadow: 0 0 20px rgba(0,0,0,0.7); }
  100% { box-shadow: 0 0 10px rgba(0,0,0,0.5); }
}

@keyframes fireEffect {
  0% { box-shadow: 0 0 10px #000, 0 0 20px #000; }
  50% { box-shadow: 0 0 15px #000, 0 0 25px #000; }
  100% { box-shadow: 0 0 10px #000, 0 0 20px #000; }
}
</style>