# frontend/src/components/InventoryDetails.vue
<template>
  <div class="inventory-details" :class="{ 'theme--dark': isDark }">
    <div class="inventory-layout">
      <!-- Equipment Section -->
      <div class="equipment-section">
        <!-- Info Button -->
        <div class="info-button">
          <v-tooltip location="right">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-information"
                variant="tonal"
                size="small"
                color="primary"
                class="info-icon-btn"
              />
            </template>
            <div class="tooltip-content">
              <h3>{{ inventoryStore.infoTooltip.title }}</h3>
              <p>{{ inventoryStore.infoTooltip.content }}</p>
            </div>
          </v-tooltip>
        </div>

        <div class="equipment-grid">
          <!-- Avatar in Center -->
          <div class="avatar-container">
            <div class="avatar-circle"></div>
            <ThreeDAvatar ref="avatar" :current-section="0" />
          </div>

          <!-- Equipment Slots -->
          <TransitionGroup name="slot">
            <div 
              v-for="slot in EQUIPMENT_SLOTS" 
              :key="slot.id"
              class="equipment-slot"
              :style="{ transform: slot.transform }"
              @dragover.prevent
              @drop="handleDropSkill($event, slot.id)"
            >
              <v-tooltip :location="slot.tooltipPosition" :open-delay="100">
                <template #activator="{ props }">
                  <div 
                    v-bind="props"
                    class="slot-container"
                    :class="{ 
                      'equipped': inventoryStore.getEquippedItem(slot.id),
                      'empty': !inventoryStore.getEquippedItem(slot.id)
                    }"
                    draggable="true"
                    @dragstart="handleDragStart($event, inventoryStore.getEquippedItem(slot.id))"
                  >
                    <template v-if="inventoryStore.getEquippedItem(slot.id)">
                      <div 
                        class="item-frame"
                        :class="[
                          `rarity-${inventoryStore.getEquippedItem(slot.id).rarity?.toLowerCase()}`,
                          { 'mythical-fire': inventoryStore.getEquippedItem(slot.id).hasFireEffect }
                        ]"
                      >
                        <div class="frame-border"></div>
                        <v-avatar
                          :color="inventoryStore.getEquippedItem(slot.id).color"
                          size="48"
                          class="slot-avatar"
                        >
                          <v-icon 
                            :icon="inventoryStore.getEquippedItem(slot.id).icon"
                            color="white"
                            size="24"
                          />
                        </v-avatar>
                      </div>
                    </template>
                    <template v-else>
                      <div class="slot-empty-state">
                        <v-icon :icon="slot.defaultIcon" color="grey" />
                        <div class="empty-slot-ring"></div>
                      </div>
                    </template>
                  </div>
                </template>
                <div class="tooltip-content">
                  <template v-if="inventoryStore.getEquippedItem(slot.id)">
                    <div class="tooltip-header">
                      <v-avatar 
                        :color="inventoryStore.getEquippedItem(slot.id).color" 
                        size="24"
                      >
                        <v-icon color="white" size="16">
                          {{ inventoryStore.getEquippedItem(slot.id).icon }}
                        </v-icon>
                      </v-avatar>
                      <h3>{{ inventoryStore.getEquippedItem(slot.id).name }}</h3>
                    </div>
                    <div class="tooltip-stats">
                      <div class="stat-item">
                        <span class="label">Level:</span>
                        <span class="value">
                          {{ inventoryStore.getEquippedItem(slot.id).level }}
                        </span>
                      </div>
                      <v-progress-linear
                        :model-value="inventoryStore.getEquippedItem(slot.id).level"
                        :color="inventoryStore.getEquippedItem(slot.id).color"
                        height="4"
                        rounded
                      />
                      <div class="effects-list">
                        <div v-for="effect in inventoryStore.getEquippedItem(slot.id).effects"
                            :key="effect"
                            class="effect-item"
                        >
                          <v-icon size="12" color="primary">mdi-star</v-icon>
                          <span>{{ effect }}</span>
                        </div>
                      </div>
                    </div>
                    <p class="tooltip-description">
                      {{ inventoryStore.getEquippedItem(slot.id).description }}
                    </p>
                  </template>
                  <template v-else>
                    <div class="tooltip-header">
                      <v-avatar color="grey-lighten-3" size="24">
                        <v-icon color="grey" size="16">{{ slot.defaultIcon }}</v-icon>
                      </v-avatar>
                      <h3>{{ slot.name }}</h3>
                    </div>
                    <p class="tooltip-description">{{ slot.description }}</p>
                  </template>
                </div>
              </v-tooltip>
            </div>
          </TransitionGroup>
        </div>

        <!-- Interests Portion Section -->
        <div class="interests-portion">
          <div class="portion-title">
            Interests ({{ inventoryStore.getEquippedInterests.length }}/3)
            <v-tooltip location="right">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  icon="mdi-information"
                  size="small"
                  color="primary"
                  class="info-icon"
                />
              </template>
              <div class="tooltip-content">
                <h3>Interests Section</h3>
                <p>You can equip up to 3 interests that define your character's passions and hobbies.</p>
              </div>
            </v-tooltip>
          </div>
          <div class="portion-slots">
            <TransitionGroup name="interest-slot">
              <div 
                v-for="idx in 3" 
                :key="idx"
                class="portion-slot"
                :class="{ 'filled': inventoryStore.getEquippedInterests[idx - 1] }"
                @dragover.prevent
                @drop="handleDropInterest($event, idx - 1)"
              >
                <v-tooltip :location="idx === 2 ? 'bottom' : 'top'" :open-delay="100">
                  <template #activator="{ props }">
                    <div 
                      v-bind="props"
                      class="slot-container"
                    >
                      <template v-if="inventoryStore.getEquippedInterests[idx - 1]">
                        <div class="interest-frame">
                          <v-avatar
                            :color="inventoryStore.getEquippedInterests[idx - 1].color"
                            size="48"
                            class="interest-avatar"
                            draggable="true"
                            @dragstart="handleDragStart($event, inventoryStore.getEquippedInterests[idx - 1])"
                          >
                            <v-icon 
                              :icon="inventoryStore.getEquippedInterests[idx - 1].icon"
                              color="white"
                              size="24"
                            />
                          </v-avatar>
                          <div class="interest-level">
                            Lvl {{ inventoryStore.getEquippedInterests[idx - 1].level }}
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="empty-portion-slot">
                          <v-icon icon="mdi-plus" color="grey" />
                          <div class="empty-slot-pulse"></div>
                        </div>
                      </template>
                    </div>
                  </template>
                  <div class="tooltip-content">
                    <template v-if="inventoryStore.getEquippedInterests[idx - 1]">
                      <div class="tooltip-header">
                        <v-avatar 
                          :color="inventoryStore.getEquippedInterests[idx - 1].color" 
                          size="24"
                        >
                          <v-icon color="white" size="16">
                            {{ inventoryStore.getEquippedInterests[idx - 1].icon }}
                          </v-icon>
                        </v-avatar>
                        <h3>{{ inventoryStore.getEquippedInterests[idx - 1].name }}</h3>
                      </div>
                      <div class="tooltip-stats">
                        <div class="stat-item">
                          <span class="label">Level:</span>
                          <span class="value">
                            {{ inventoryStore.getEquippedInterests[idx - 1].level }}
                          </span>
                        </div>
                        <v-progress-linear
                          :model-value="inventoryStore.getEquippedInterests[idx - 1].level"
                          :color="inventoryStore.getEquippedInterests[idx - 1].color"
                          height="4"
                          rounded
                        />
                        <div class="effects-list">
                          <div 
                            v-for="expertise in inventoryStore.getEquippedInterests[idx - 1].expertise"
                            :key="expertise"
                            class="effect-item"
                          >
                            <v-icon size="12" color="primary">mdi-star</v-icon>
                            <span>{{ expertise }}</span>
                          </div>
                        </div>
                      </div>
                      <p class="tooltip-description">
                        {{ inventoryStore.getEquippedInterests[idx - 1].description }}
                      </p>
                    </template>
                    <template v-else>
                      <div class="tooltip-header">
                        <v-avatar color="grey-lighten-3" size="24">
                          <v-icon color="grey" size="16">mdi-plus</v-icon>
                        </v-avatar>
                        <h3>Empty Interest Slot</h3>
                      </div>
                      <p class="tooltip-description">
                        Drag and drop an interest here to add it to your profile.
                      </p>
                    </template>
                  </div>
                </v-tooltip>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- Inventory Items Section -->
      <div class="inventory-section">
        <v-card class="inventory-card">
          <v-tabs v-model="activeTab" color="primary" density="comfortable">
            <v-tab value="skills">Skills</v-tab>
            <v-tab value="interests">Interests</v-tab>
          </v-tabs>

          <v-card-text class="inventory-content">
            <v-window v-model="activeTab">
              <!-- Skills Tab -->
              <v-window-item value="skills">
                <TransitionGroup name="item" tag="div" class="items-grid">
                  <InventoryItem
                    v-for="skill in SKILLS"
                    :key="skill.id"
                    :item="skill"
                    :is-equipped="inventoryStore.isItemEquipped(skill.id)"
                    @dragstart="handleDragStart($event, skill)"
                  />
                </TransitionGroup>
              </v-window-item>

              <!-- Interests Tab -->
              <v-window-item value="interests">
                <TransitionGroup name="item" tag="div" class="items-grid">
                  <InventoryItem
                    v-for="interest in INTERESTS"
                    :key="interest.id"
                    :item="interest"
                    :is-equipped="inventoryStore.isInterestEquipped(interest.id)"
                    @dragstart="handleDragStart($event, interest)"
                  />
                </TransitionGroup>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useInventoryStore } from '@/stores/inventory'
import { EQUIPMENT_SLOTS, INTERESTS, SKILLS } from '@/stores/inventory'
import ThreeDAvatar from './ThreeDAvatar.vue'
import InventoryItem from './InventoryItem.vue'

export default defineComponent({
  name: 'InventoryDetails',

  components: {
    ThreeDAvatar,
    InventoryItem
  },

  setup() {
    const themeStore = useThemeStore()
    const inventoryStore = useInventoryStore()
    const activeTab = ref('skills')

    const handleDragStart = (event, item) => {
      if (!item) return
      event.dataTransfer.setData('application/json', JSON.stringify(item))
      event.target.classList.add('dragging')
    }

    const handleDropSkill = (event, slotId) => {
      const item = JSON.parse(event.dataTransfer.getData('application/json'))
      if (!item.rarity) return
      inventoryStore.equipItem(slotId, item)
      document.querySelector('.dragging')?.classList.remove('dragging')
    }

    const handleDropInterest = (event, slotIndex) => {
      const item = JSON.parse(event.dataTransfer.getData('application/json'))
      if (item.rarity) return
      inventoryStore.equipInterestAtIndex(item, slotIndex)
      document.querySelector('.dragging')?.classList.remove('dragging')
    }

    return {
      isDark: computed(() => themeStore.isDark),
      inventoryStore,
      activeTab,
      EQUIPMENT_SLOTS,
      INTERESTS,
      SKILLS,
      handleDragStart,
      handleDropSkill,
      handleDropInterest
    }
  }
})
</script>

<style lang="scss" scoped>
.inventory-details {
  height: 100%;
  width: 100%;
  position: relative;
  color: var(--v-theme-on-surface);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgb(250, 250, 250) 0%, rgb(245, 245, 245) 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.4) 100%);
    z-index: 0;
  }

  &.theme--dark {
    background: linear-gradient(135deg, rgb(30, 30, 30) 0%, rgb(25, 25, 25) 100%);
    color: rgba(255, 255, 255, 0.87);

    &::before {
      background: radial-gradient(circle at center, rgba(40,40,40,0.8) 0%, rgba(25,25,25,0.4) 100%);
    }

    .inventory-card,
    .v-card {
      background-color: rgb(40, 40, 40) !important;
      color: rgba(255, 255, 255, 0.87) !important;
    }

    .inventory-section {
      background-color: rgb(40, 40, 40);
    }

    .equipment-section {
      background-color: rgba(40, 40, 40, 0.7);
    }
  }
}

.inventory-layout {
  display: flex;
  height: 100%;
  padding: 0.75rem;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.rarity-legend {
  position: relative;
  z-index: 1;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  height: 28px;
  gap: 0.5rem;

  .theme--dark & {
    background: rgba(40, 40, 40, 0.7);
  }

  .legend-title {
    font-weight: 500;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .legend-items {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;

    .theme--dark & {
      background: rgba(50, 50, 50, 0.9);
    }

    .color-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.common .color-dot {
      background: linear-gradient(45deg, #C0C0C0, #A8A8A8);
    }

    &.rare .color-dot {
      background: linear-gradient(45deg, #9C27B0, #7B1FA2);
      box-shadow: 0 0 5px rgba(156, 39, 176, 0.3);
    }

    &.legendary .color-dot {
      background: linear-gradient(45deg, #FFD700, #FFA500);
      box-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
    }

    &.mythical .color-dot {
      background: #000;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      animation: mythicalPulse 2s infinite;
    }
  }
}

.equipment-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  min-width: 400px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 0.75rem;
  overflow-y: auto;
  height: calc(100vh - 2rem); /* This ensures proper scrolling */
  min-height: 600px; /* Minimum height to ensure content doesn't get too compressed */
}

.equipment-grid {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 2rem auto; /* Increased margin */
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-container {
  position: absolute;
  width: 140px;
  height: 220px;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
}

.avatar-circle {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px dashed rgba(var(--v-theme-primary), 0.1);
    border-radius: 50%;
  }
}

.equipment-slot {
  position: absolute;
  z-index: 2;
  transform-origin: center;
  transition: transform 0.3s ease;

  .slot-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    position: relative;
    background: rgba(var(--v-theme-surface-variant), 0.1);
    border: 2px dashed var(--v-theme-primary);
    transition: all 0.3s ease;
    cursor: pointer;

    &.equipped {
      border-style: solid;
      background: rgba(var(--v-theme-primary), 0.1);
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.2);
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    &.empty {
      .empty-slot-ring {
        position: absolute;
        inset: -2px;
        border-radius: 50%;
        border: 2px dashed rgba(var(--v-theme-primary), 0.3);
        animation: rotate 10s linear infinite;
      }
    }
  }
}

.interests-portion {
  margin-top: 0.2rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  bottom: 0;
  z-index: 2;

  .theme--dark & {
    background: rgba(40, 40, 40, 0.7);
  }

  .portion-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .portion-slots {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .portion-slot {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(var(--v-theme-surface-variant), 0.1);
    border: 2px dashed var(--v-theme-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    transition: all 0.3s ease;
    position: relative;

    &.filled {
      border-style: solid;
      background: rgba(var(--v-theme-primary), 0.1);
    }

    .interest-level {
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      background: rgba(var(--v-theme-surface), 0.9);
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      white-space: nowrap;
    }
  }
}

.inventory-section {
  width: 450px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  padding: 0.75rem;
  height: 100%; // Add this to ensure it takes full height
}


.inventory-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none !important;
  height: 100%; // Changed from max-height to ensure it takes full space

  .v-card-text {
    flex: 1;
    padding: 0.75rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--v-theme-primary);
      border-radius: 3px;
    }
  }
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 0.25rem;
  min-height: min-content; // Add this to ensure content can expand
  overflow-y: auto; // Add this to enable scrolling
}
.v-window {
  height: 100%;
  overflow-y: auto;
}

// Ensure window items can scroll
.v-window-item {
  height: 100%;
  overflow-y: auto;
}

.info-button {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  .theme--dark & {
    background: rgba(40, 40, 40, 0.9);
  }

  &:hover {
    transform: scale(1.1);
  }
}

// Animation keyframes
@keyframes mythicalPulse {
  0% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
  50% { box-shadow: 0 0 8px rgba(0, 0, 0, 0.7); }
  100% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Transition animations
.slot-enter-active,
.slot-leave-active,
.interest-slot-enter-active,
.interest-slot-leave-active {
  transition: all 0.3s ease-in-out;
}

.slot-enter-from,
.slot-leave-to,
.interest-slot-enter-from,
.interest-slot-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slot-move,
.interest-slot-move {
  transition: transform 0.3s ease-in-out;
}

// Dragging styles
.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

// Responsive styles
@media (max-width: 1200px) {
  .equipment-grid {
    width: 300px;
    height: 300px;
  }
}

@media (max-width: 992px) {
  .equipment-grid {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .inventory-layout {
    flex-direction: column;
    align-items: center;
  }

  .equipment-section,
  .inventory-section {
    width: 100%;
    min-width: auto;
  }
}

// Print styles
@media print {
  .inventory-details {
    height: auto;
    background: none;
  }

  .equipment-grid {
    page-break-inside: avoid;
  }
}

// Tooltip enhancements
:deep(.v-tooltip) {
  .v-overlay__content {
    background-color: transparent !important;
    box-shadow: none !important;
  }
  
  .v-overlay__scrim {
    opacity: 0 !important;
  }
}

// Remove all backgrounds from tooltip containers
:deep(.v-tooltip > .v-overlay__content > .v-tooltip-content) {
  background-color: transparent !important;
  box-shadow: none !important;
}

// Style our actual tooltip content
.tooltip-content {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 280px;

  .theme--dark & {
    background: rgba(40, 40, 40, 0.98) !important;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }
  }

  .tooltip-stats {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 6px;

    .theme--dark & {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;

    .label {
      color: var(--v-theme-primary);
      font-weight: 500;
    }
  }

  .effects-list {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .effect-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
    }
  }

  .tooltip-description {
    font-size: 0.875rem;
    line-height: 1.4;
    opacity: 0.9;
    margin: 0;
  }
}

// Item frame effects
.item-frame {
  padding: 2px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  z-index: 1;

  &.rarity-common {
    background: linear-gradient(45deg, #C0C0C0, #A8A8A8);
  }

  &.rarity-rare {
    background: linear-gradient(45deg, #9C27B0, #7B1FA2);
    box-shadow: 0 0 10px rgba(156, 39, 176, 0.3);
  }

  &.rarity-legendary {
    background: linear-gradient(45deg, #FFD700, #FFA500);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  }

  &.mythical-fire {
    border: 1px solid #000;
    background: linear-gradient(45deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95));
    position: relative;
    overflow: visible;
    z-index: 1;

    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      background: linear-gradient(45deg, 
        rgba(0,0,0,0.95),
        rgba(20,20,20,0.95),
        rgba(40,40,40,0.95)
      );
      border-radius: inherit;
      z-index: -1;
      filter: blur(2px);
      transition: all 0.3s ease;
    }

    &::before {
      animation: blackFireWave 3s ease-in-out infinite;
      opacity: 0.9;
    }

    &::after {
      animation: blackFireGlow 2s ease-in-out infinite alternate;
      opacity: 0.7;
    }
  }
}

// Empty slot styles
.slot-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>