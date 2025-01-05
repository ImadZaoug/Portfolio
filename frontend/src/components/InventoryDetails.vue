# frontend/src/components/InventoryDetails.vue
<template>
  <div class="inventory-details" :class="{ 'theme--dark': isDark }">
    <div class="inventory-layout">
      <!-- Combined Equipment and Avatar Section -->
      <div class="equipment-section">
        <!-- Equipment Grid -->
        <div class="equipment-grid">
          <!-- Avatar in Center -->
          <div class="avatar-container">
            <ThreeDAvatar ref="avatar" :current-section="0" />
          </div>

          <!-- Equipment Slots -->
          <div 
            v-for="(slot, index) in equipmentSlots" 
            :key="index"
            class="equipment-slot"
            :class="slot.position"
            @dragover.prevent
            @drop="handleDrop($event, slot.id)"
          >

            <!-- Slot Content -->
            <v-tooltip :location="slot.tooltipPosition" :open-delay="100">
              <template v-slot:activator="{ props }">
                <div 
                  v-bind="props"
                  class="slot-container"
                  :class="{ 'equipped': getEquippedItem(slot.id) }"
                  draggable="true"
                  @dragstart="handleDragStart($event, getEquippedItem(slot.id))"
                >
                  <template v-if="getEquippedItem(slot.id)">
                    <v-avatar
                      :color="getEquippedItem(slot.id).color"
                      size="48"
                      class="slot-avatar"
                    >
                      <v-icon 
                        :icon="getEquippedItem(slot.id).icon"
                        color="white"
                        size="24"
                      />
                    </v-avatar>
                  </template>
                  <template v-else>
                    <div class="slot-empty-state">
                      <v-icon :icon="slot.defaultIcon" color="grey" />
                      <span class="empty-text">{{ slot.name }}</span>
                    </div>
                  </template>
                </div>
              </template>
              <div class="tooltip-content">
                <template v-if="getEquippedItem(slot.id)">
                  <div class="tooltip-header">
                    <v-avatar :color="getEquippedItem(slot.id).color" size="24">
                      <v-icon color="white" size="16">{{ getEquippedItem(slot.id).icon }}</v-icon>
                    </v-avatar>
                    <h3>{{ getEquippedItem(slot.id).name }}</h3>
                  </div>
                  <div class="tooltip-stats">
                    <div class="stat-item">
                      <span class="label">Level:</span>
                      <span class="value">{{ getEquippedItem(slot.id).level }}</span>
                    </div>
                    <v-progress-linear
                      :model-value="getEquippedItem(slot.id).level"
                      :color="getEquippedItem(slot.id).color"
                      height="4"
                      rounded
                    />
                  </div>
                  <p class="tooltip-description">{{ getEquippedItem(slot.id).description }}</p>
                </template>
                <template v-else>
                  <div class="tooltip-header">
                    <v-avatar color="grey-lighten-3" size="24">
                      <v-icon color="grey" size="16">{{ slot.defaultIcon }}</v-icon>
                    </v-avatar>
                    <h3>{{ slot.name }}</h3>
                  </div>
                  <p class="tooltip-description">Drop a skill here to equip</p>
                </template>
              </div>
            </v-tooltip>
          </div>
        </div>
        <div class="info-button">
          <v-tooltip location="left">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                icon="mdi-information"
                size="small"
                color="primary"
                class="info-icon"
              />
            </template>
            <div class="tooltip-content">
              <h3>Equipment Slots</h3>
              <p>Drag and drop skills from your inventory to equip them in the corresponding slots.</p>
            </div>
          </v-tooltip>
        </div>
      </div>

      <!-- Inventory Items Section -->
      <div class="inventory-section">
        <v-card class="inventory-card">
          <v-tabs v-model="activeTab" color="primary" density="comfortable">
            <v-tab value="softskills">Soft Skills</v-tab>
            <v-tab value="interests">Interests</v-tab>
          </v-tabs>

          <v-card-text class="inventory-content">
            <v-window v-model="activeTab">
              <!-- Soft Skills Tab -->
              <v-window-item value="softskills">
                <div class="items-grid">
                  <div 
                    v-for="skill in softSkills"
                    :key="skill.id"
                    class="inventory-item"
                    draggable="true"
                    @dragstart="handleDragStart($event, skill)"
                  >
                    <v-hover v-slot="{ isHovering }">
                      <v-card 
                        class="item-card"
                        :class="{ 'on-hover': isHovering }"
                        elevation="2"
                      >
                        <v-card-item>
                          <div class="item-wrapper">
                            <v-avatar :color="skill.color" size="40" class="skill-icon">
                              <v-icon color="white">{{ skill.icon }}</v-icon>
                            </v-avatar>
                            <div class="item-details">
                              <div class="item-name">{{ skill.name }}</div>
                              <v-progress-linear
                                :model-value="skill.level"
                                :color="skill.color"
                                height="4"
                                rounded
                                class="mt-1"
                              />
                            </div>
                            <div v-if="isEquipped(skill.id)" class="equipped-indicator">
                              <v-icon color="success" size="16">mdi-check-circle</v-icon>
                            </div>
                          </div>
                        </v-card-item>
                      </v-card>
                    </v-hover>
                  </div>
                </div>
              </v-window-item>

              <!-- Interests Tab -->
              <v-window-item value="interests">
                <div class="items-grid">
                  <div 
                    v-for="interest in interests"
                    :key="interest.id"
                    class="inventory-item"
                    draggable="true"
                    @dragstart="handleDragStart($event, interest)"
                  >
                    <v-hover v-slot="{ isHovering }">
                      <v-card 
                        class="item-card"
                        :class="{ 'on-hover': isHovering }"
                        elevation="2"
                      >
                        <v-card-item>
                          <div class="item-wrapper">
                            <v-avatar :color="interest.color" size="40" class="skill-icon">
                              <v-icon color="white">{{ interest.icon }}</v-icon>
                            </v-avatar>
                            <div class="item-details">
                              <div class="item-name">{{ interest.name }}</div>
                              <v-progress-linear
                                :model-value="interest.level"
                                :color="interest.color"
                                height="4"
                                rounded
                                class="mt-1"
                              />
                            </div>
                            <div v-if="isEquipped(interest.id)" class="equipped-indicator">
                              <v-icon color="success" size="16">mdi-check-circle</v-icon>
                            </div>
                          </div>
                        </v-card-item>
                      </v-card>
                    </v-hover>
                  </div>
                </div>
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
import ThreeDAvatar from './ThreeDAvatar.vue'

export default defineComponent({
  name: 'InventoryDetails',

  components: {
    ThreeDAvatar
  },

  setup() {
    const themeStore = useThemeStore()
    const isDark = computed(() => themeStore.isDark)
    const activeTab = ref('softskills')
    const equippedItems = ref({})

    const equipmentSlots = [
      { id: 'head', position: 'top', name: 'Leadership', defaultIcon: 'mdi-hat-fedora', tooltipPosition: 'top' },
      { id: 'right1', position: 'right-top', name: 'Communication', defaultIcon: 'mdi-message-text', tooltipPosition: 'right' },
      { id: 'right2', position: 'right-bottom', name: 'Problem Solving', defaultIcon: 'mdi-puzzle', tooltipPosition: 'right' },
      { id: 'bottom', position: 'bottom', name: 'Adaptability', defaultIcon: 'mdi-rotate-3d-variant', tooltipPosition: 'bottom' },
      { id: 'left1', position: 'left-top', name: 'Time Management', defaultIcon: 'mdi-clock-time-four', tooltipPosition: 'left' },
      { id: 'left2', position: 'left-bottom', name: 'Teamwork', defaultIcon: 'mdi-account-multiple', tooltipPosition: 'left' }
    ]

    // Extended skills list
    const softSkills = [
      { id: 'skill1', name: 'Leadership', icon: 'mdi-account-group', level: 85, color: 'blue', description: 'Expert at guiding teams and making strategic decisions' },
      { id: 'skill2', name: 'Communication', icon: 'mdi-message-text', level: 90, color: 'green', description: 'Exceptional verbal and written communication abilities' },
      { id: 'skill3', name: 'Problem Solving', icon: 'mdi-puzzle', level: 95, color: 'purple', description: 'Advanced analytical and problem-solving capabilities' },
      { id: 'skill4', name: 'Adaptability', icon: 'mdi-rotate-3d-variant', level: 88, color: 'cyan', description: 'Quick to adapt to new situations and requirements' },
      { id: 'skill5', name: 'Time Management', icon: 'mdi-clock-time-four', level: 92, color: 'pink', description: 'Efficient at prioritizing and managing multiple tasks' },
      { id: 'skill6', name: 'Teamwork', icon: 'mdi-account-multiple', level: 94, color: 'orange', description: 'Strong collaborative skills and team spirit' },
      { id: 'skill7', name: 'Innovation', icon: 'mdi-lightbulb', level: 87, color: 'amber', description: 'Creative approach to problem-solving and new ideas' },
      { id: 'skill8', name: 'Analysis', icon: 'mdi-chart-bar', level: 91, color: 'deep-purple', description: 'Strong analytical thinking and data interpretation' },
      { id: 'skill9', name: 'Strategic Thinking', icon: 'mdi-chess-knight', level: 89, color: 'indigo', description: 'Long-term planning and strategic decision making' }
    ]

    // Extended interests list
    const interests = [
      { id: 'int1', name: 'Reading', icon: 'mdi-book-open-page-variant', level: 90, color: 'brown', description: 'Passionate about technical literature and sci-fi' },
      { id: 'int2', name: 'Music', icon: 'mdi-music', level: 85, color: 'deep-purple', description: 'Enjoy various genres and playing instruments' },
      { id: 'int3', name: 'Gaming', icon: 'mdi-gamepad-variant', level: 95, color: 'indigo', description: 'Enthusiast of strategy and RPG games' },
      { id: 'int4', name: 'Technology', icon: 'mdi-laptop', level: 98, color: 'blue', description: 'Deep interest in emerging technologies' },
      { id: 'int5', name: 'Travel', icon: 'mdi-airplane', level: 88, color: 'light-blue', description: 'Love exploring new places and cultures' },
      { id: 'int6', name: 'Photography', icon: 'mdi-camera', level: 82, color: 'amber', description: 'Keen on capturing moments and landscapes' },
      { id: 'int7', name: 'Cooking', icon: 'mdi-chef-hat', level: 84, color: 'red', description: 'Exploring cuisines and culinary techniques' },
      { id: 'int8', name: 'Art', icon: 'mdi-palette', level: 80, color: 'pink', description: 'Appreciation for visual arts and design' },
      { id: 'int9', name: 'Fitness', icon: 'mdi-dumbbell', level: 86, color: 'teal', description: 'Regular exercise and healthy lifestyle' }
    ]

    const handleDragStart = (event, item) => {
      if (!item) return
      event.dataTransfer.setData('application/json', JSON.stringify(item))
    }

    const handleDrop = (event, slotId) => {
      const item = JSON.parse(event.dataTransfer.getData('application/json'))
      equippedItems.value[slotId] = item
    }

    const getEquippedItem = (slotId) => {
      return equippedItems.value[slotId]
    }

    const isEquipped = (itemId) => {
      return Object.values(equippedItems.value).some(item => item?.id === itemId)
    }

    return {
      isDark,
      activeTab,
      equipmentSlots,
      softSkills,
      interests,
      equippedItems,
      handleDragStart,
      handleDrop,
      getEquippedItem,
      isEquipped
    }
  }
})
</script>

<style lang="scss" scoped>
.inventory-details {
  height: 100%;
  background: rgb(250, 250, 250);
  color: var(--v-theme-on-surface);
  transition: all 0.3s ease;

  &.theme--dark {
    background: rgb(30, 30, 30);
    color: white;

    .inventory-card,
    .v-card {
      background: rgb(40, 40, 40) !important;
      color: white !important;
    }

    .item-name {
      color: white !important;
    }
  }
}

.inventory-layout {
  display: flex;
  height: 100%;
  padding: 1rem;
  gap: 1.5rem;
}


.avatar-section {
  width: 120px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container {
  position: absolute;
  width: 168px;  // Increased by 40%
  height: 280px; // Increased by 40%
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
}

.equipment-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.equipment-grid {
  position: relative;
  width: 450px;  // Slightly increased
  height: 450px; // Slightly increased
  display: flex;
  justify-content: center;
  align-items: center;
}

.equipment-slot {
  position: absolute;
  z-index: 2;

  .slot-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border-radius: 50%;  // Ensure consistent roundness
    width: 64px;  // Fixed width for consistent size
    height: 64px; // Fixed height for consistent size
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

      .slot-avatar {
        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .slot-empty-state {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }
  }

  &.top { top: 0; left: 50%; transform: translateX(-50%); }
  &.right-top { top: 25%; right: 0; }
  &.right-bottom { bottom: 25%; right: 0; }
  &.bottom { bottom: 0; left: 50%; transform: translateX(-50%); }
  &.left-top { top: 25%; left: 0; }
  &.left-bottom { bottom: 25%; left: 0; }
}

.inventory-section {
  width: 450px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.inventory-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.inventory-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(var(--v-theme-on-surface), 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--v-theme-primary);
    border-radius: 4px;
    
    &:hover {
      background: var(--v-theme-secondary);
    }
  }
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0.5rem;
}
.info-button {
  position: absolute;
  top: 0;
  left: -24px;
  z-index: 4;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.inventory-item {
  cursor: grab;

  &.is-equipped {
    opacity: 0.5;
    pointer-events: none;
  }

  &:active {
    cursor: grabbing;
  }
}

.item-card {
  background: var(--v-theme-surface-variant);
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: visible;
  position: relative;

  &.on-hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .v-card-item {
    padding: 0.75rem;
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

  .theme--dark & {
    background: rgb(40, 40, 40);
  }
}

.tooltip-content {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.87);
  max-width: 250px;
  z-index: 9999;

  .theme--dark & {
    background: rgba(30, 30, 30, 0.8) !important;
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.87);
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }
  }

  .tooltip-stats {
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;

    .stat-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;

      .label {
        color: var(--v-theme-primary);
        font-weight: 500;
      }
    }
  }

  .tooltip-description {
    font-size: 0.875rem;
    line-height: 1.4;
    opacity: 0.9;
    margin: 0;
  }
}

// Responsive styles
@media (max-width: 1200px) {
  .inventory-layout {
    padding: 1rem;
    gap: 1.5rem;
  }

  .avatar-section {
    width: 100px;
    min-width: 100px;
  }

  .avatar-container {
    height: 180px;
  }

  .inventory-section {
    width: 400px;
  }
}

@media (max-width: 992px) {
  .avatar-section {
    width: 90px;
    min-width: 90px;
  }

  .avatar-container {
    height: 160px;
  }

  .equipment-grid {
    width: 350px;
    height: 350px;
  }

  .inventory-section {
    width: 100%;
    max-width: 600px;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .inventory-layout {
    padding: 0.75rem;
    gap: 1rem;
  }

  .avatar-section {
    width: 80px;
    min-width: 80px;
  }

  .avatar-container {
    height: 140px;
  }

  .equipment-grid {
    width: 300px;
    height: 300px;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>