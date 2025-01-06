// frontend/src/stores/inventory.js
import { defineStore } from 'pinia'

// Rarity color configurations
export const RARITY_COLORS = {
  COMMON: '#C0C0C0',  // Rusty silver
  RARE: '#9C27B0',    // Purple
  LEGENDARY: '#FFD700', // Gold
  MYTHICAL: '#000000'  // Black (for fire effect)
}

// Equipment slot positions (in degrees) for circular layout
const SLOT_POSITIONS = {
  'head': { angle: 0, distance: 160 },
  'right1': { angle: 60, distance: 160 },
  'right2': { angle: 120, distance: 160 },
  'bottom': { angle: 180, distance: 160 },
  'left2': { angle: 240, distance: 160 },
  'left1': { angle: 300, distance: 160 }
}

// Calculate position based on angle and distance
const calculatePosition = (angle, distance) => {
  return {
    x: Math.sin(angle * Math.PI / 180) * distance,
    y: -Math.cos(angle * Math.PI / 180) * distance
  }
}

// Equipment slot configurations
export const EQUIPMENT_SLOTS = [
  {
    id: 'head',
    position: 'top',
    name: 'Head Equipment',
    defaultIcon: 'mdi-hat-fedora',
    tooltipPosition: 'top',
    description: 'Slot for leadership and strategic thinking skills',
    transform: `translate(${calculatePosition(SLOT_POSITIONS.head.angle, SLOT_POSITIONS.head.distance).x}px, ${calculatePosition(SLOT_POSITIONS.head.angle, SLOT_POSITIONS.head.distance).y}px)`
  },
  {
    id: 'right1',
    position: 'right-top',
    name: 'Upper Right Equipment',
    defaultIcon: 'mdi-message-text',
    tooltipPosition: 'right',
    description: 'Slot for communication and social skills',
    transform: `translate(${calculatePosition(SLOT_POSITIONS.right1.angle, SLOT_POSITIONS.right1.distance).x}px, ${calculatePosition(SLOT_POSITIONS.right1.angle, SLOT_POSITIONS.right1.distance).y}px)`
  },
  {
    id: 'right2',
    position: 'right-bottom',
    name: 'Lower Right Equipment',
    defaultIcon: 'mdi-puzzle',
    tooltipPosition: 'right',
    description: 'Slot for problem-solving abilities',
    transform: `translate(${calculatePosition(SLOT_POSITIONS.right2.angle, SLOT_POSITIONS.right2.distance).x}px, ${calculatePosition(SLOT_POSITIONS.right2.angle, SLOT_POSITIONS.right2.distance).y}px)`
  },
  {
    id: 'bottom',
    position: 'bottom',
    name: 'Bottom Equipment',
    defaultIcon: 'mdi-rotate-3d-variant',
    tooltipPosition: 'bottom',
    description: 'Slot for adaptability and versatility',
    transform: `translate(${calculatePosition(SLOT_POSITIONS.bottom.angle, SLOT_POSITIONS.bottom.distance).x}px, ${calculatePosition(SLOT_POSITIONS.bottom.angle, SLOT_POSITIONS.bottom.distance).y}px)`
  },
  {
    id: 'left2',
    position: 'left-bottom',
    name: 'Lower Left Equipment',
    defaultIcon: 'mdi-account-multiple',
    tooltipPosition: 'left',
    description: 'Slot for teamwork and collaboration',
    transform: `translate(${calculatePosition(SLOT_POSITIONS.left2.angle, SLOT_POSITIONS.left2.distance).x}px, ${calculatePosition(SLOT_POSITIONS.left2.angle, SLOT_POSITIONS.left2.distance).y}px)`
  },
  {
    id: 'left1',
    position: 'left-top',
    name: 'Upper Left Equipment',
    defaultIcon: 'mdi-clock-time-four',
    tooltipPosition: 'left',
    description: 'Slot for time management and efficiency',
    transform: `translate(${calculatePosition(SLOT_POSITIONS.left1.angle, SLOT_POSITIONS.left1.distance).x}px, ${calculatePosition(SLOT_POSITIONS.left1.angle, SLOT_POSITIONS.left1.distance).y}px)`
  }
]

// Skills data with enhanced descriptions and effects
export const SKILLS = [
  {
    id: 'skill1',
    name: 'Multitasking',
    level: 56,
    rarity: 'RARE',
    icon: 'mdi-arrange-bring-forward',
    description: 'Master the art of handling multiple tasks simultaneously with exceptional efficiency and organization.',
    color: RARITY_COLORS.RARE,
    effects: ['Increased productivity', 'Better time management']
  },
  {
    id: 'skill2',
    name: 'Multidisciplinary',
    level: 36,
    rarity: 'LEGENDARY',
    icon: 'mdi-atom-variant',
    description: 'Possess extensive knowledge and expertise across various fields, enabling unique problem-solving approaches.',
    color: RARITY_COLORS.LEGENDARY,
    effects: ['Cross-domain expertise', 'Innovative solutions']
  },
  {
    id: 'skill3',
    name: 'Creativity',
    level: 88,
    rarity: 'MYTHICAL',
    icon: 'mdi-lightbulb-outline',
    description: 'Channel boundless creative energy to forge revolutionary solutions and groundbreaking ideas.',
    color: RARITY_COLORS.MYTHICAL,
    hasFireEffect: true,
    effects: ['Revolutionary thinking', 'Unique approaches']
  },
  {
    id: 'skill4',
    name: 'Quick Learner',
    level: 82,
    rarity: 'RARE',
    icon: 'mdi-book-open-page-variant',
    description: 'Rapidly acquire and master new skills and knowledge with exceptional comprehension speed.',
    color: RARITY_COLORS.RARE,
    effects: ['Fast adaptation', 'Knowledge retention']
  },
  {
    id: 'skill5',
    name: 'Adaptability',
    level: 77,
    rarity: 'RARE',
    icon: 'mdi-rotate-3d-variant',
    description: 'Seamlessly adjust to new situations and environments with remarkable flexibility.',
    color: RARITY_COLORS.RARE,
    effects: ['Environmental adaptation', 'Situational awareness']
  },
  {
    id: 'skill6',
    name: 'Communication',
    level: 71,
    rarity: 'COMMON',
    icon: 'mdi-message-text',
    description: 'Effectively convey ideas and information across all communication channels.',
    color: RARITY_COLORS.COMMON,
    effects: ['Clear expression', 'Active listening']
  },
  {
    id: 'skill7',
    name: 'Leadership',
    level: 83,
    rarity: 'RARE',
    icon: 'mdi-account-group',
    description: 'Guide and inspire teams towards success while fostering growth and collaboration.',
    color: RARITY_COLORS.RARE,
    effects: ['Team inspiration', 'Strategic guidance']
  },
  {
    id: 'skill8',
    name: 'Problem Solving',
    level: 96,
    rarity: 'COMMON',
    icon: 'mdi-puzzle',
    description: 'Analyze complex situations and develop effective solutions with remarkable insight.',
    color: RARITY_COLORS.COMMON,
    effects: ['Analytical thinking', 'Solution crafting']
  },
  {
    id: 'skill9',
    name: 'Teamwork',
    level: 66,
    rarity: 'COMMON',
    icon: 'mdi-account-multiple',
    description: 'Excel in collaborative environments while fostering positive team dynamics.',
    color: RARITY_COLORS.COMMON,
    effects: ['Collaboration', 'Team synergy']
  },
  {
    id: 'skill10',
    name: 'Innovation',
    level: 74,
    rarity: 'COMMON',
    icon: 'mdi-lightbulb',
    description: 'Pioneer new approaches and solutions through creative thinking and experimentation.',
    color: RARITY_COLORS.COMMON,
    effects: ['Creative solutions', 'Forward thinking']
  }
]

// Interests data with enhanced descriptions and levels
export const INTERESTS = [
  {
    id: 'int1',
    name: 'Manga & Anime',
    level: 85,
    icon: 'mdi-book-open-variant',
    description: 'Passionate explorer of Japanese animation and comics, with deep appreciation for storytelling and art.',
    color: '#FF69B4',
    expertise: ['Story analysis', 'Art appreciation']
  },
  {
    id: 'int2',
    name: 'Reading',
    level: 65,
    icon: 'mdi-book-open-page-variant',
    description: 'Avid reader with a diverse taste in literature and continuous pursuit of knowledge.',
    color: '#8B4513',
    expertise: ['Literary analysis', 'Knowledge acquisition']
  },
  {
    id: 'int3',
    name: 'Football',
    level: 92,
    icon: 'mdi-soccer',
    description: 'Accomplished football player with strong tactical understanding and team coordination skills.',
    color: '#228B22',
    expertise: ['Team tactics', 'Physical coordination']
  },
  {
    id: 'int4',
    name: 'Chess',
    level: 60,
    icon: 'mdi-chess-knight',
    description: 'Strategic chess player with 1100 ELO rating, continuously developing tactical skills.',
    color: '#4B0082',
    expertise: ['Strategic thinking', 'Pattern recognition']
  },
  {
    id: 'int5',
    name: 'Traveling',
    level: 78,
    icon: 'mdi-airplane',
    description: 'Enthusiastic traveler with a passion for discovering new cultures and experiences.',
    color: '#20B2AA',
    expertise: ['Cultural awareness', 'Adaptation skills']
  },
  {
    id: 'int6',
    name: 'Testing New Things',
    level: 88,
    icon: 'mdi-test-tube',
    description: 'Fearless explorer of new experiences and innovations, always eager to learn and grow.',
    color: '#9932CC',
    expertise: ['Experimental mindset', 'Quick adaptation']
  }
]

// Inventory store definition
export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    equippedItems: {},
    equippedInterests: [],
    infoTooltip: {
      title: 'Equipment Guide',
      content: 'Drag and drop skills to equip them in the circular slots. Each slot represents a different aspect of your capabilities. Empty slots await your skills!',
      icon: 'mdi-information-outline'
    }
  }),

  getters: {
    getEquippedItem: (state) => (slotId) => state.equippedItems[slotId],
    
    isItemEquipped: (state) => (itemId) => 
      Object.values(state.equippedItems).some(item => item?.id === itemId),
    
    getSkillsByRarity: () => (rarity) => 
      SKILLS.filter(skill => skill.rarity === rarity),
    
    getEquippedInterests: (state) => state.equippedInterests,
    
    isInterestEquipped: (state) => (interestId) =>
      state.equippedInterests.some(interest => interest?.id === interestId),
    
    getTotalEquippedCount: (state) => 
      Object.keys(state.equippedItems).length + state.equippedInterests.length
  },

  actions: {
    equipItem(slotId, item) {
      // Remove item if it's equipped in another slot
      const currentSlot = Object.entries(this.equippedItems)
        .find(([, equipped]) => equipped?.id === item.id)?.[0]
      
      if (currentSlot) {
        this.unequipItem(currentSlot)
      }
      
      this.equippedItems[slotId] = item
    },
  
    unequipItem(slotId) {
      delete this.equippedItems[slotId]
    },
  
    equipInterest(interest) {
      if (this.equippedInterests.length < 3 && !this.isInterestEquipped(interest.id)) {
        this.equippedInterests.push(interest)
      }
    },
  
    equipInterestAtIndex(interest, index) {
      // Remove interest if it's already equipped
      if (this.isInterestEquipped(interest.id)) {
        const currentIndex = this.equippedInterests.findIndex(i => i.id === interest.id);
        this.equippedInterests.splice(currentIndex, 1);
      }
      
      // If the target index already has an interest, remove it
      if (this.equippedInterests[index]) {
        this.equippedInterests.splice(index, 1);
      }
      
      // Insert the new interest at the specified index
      if (index === this.equippedInterests.length) {
        this.equippedInterests.push(interest);
      } else {
        this.equippedInterests.splice(index, 0, interest);
      }
      
      // Ensure we don't exceed 3 interests
      if (this.equippedInterests.length > 3) {
        this.equippedInterests.pop();
      }
    },
  
    unequipInterest(interestId) {
      const index = this.equippedInterests.findIndex(interest => interest.id === interestId)
      if (index !== -1) {
        this.equippedInterests.splice(index, 1)
      }
    },
  
    clearAllEquipped() {
      this.equippedItems = {}
      this.equippedInterests = []
    },
  
    // Additional utility methods
    getSlotCompatibility(slotId, itemId) {
      const slot = EQUIPMENT_SLOTS.find(slot => slot.id === slotId)
      const item = SKILLS.find(skill => skill.id === itemId)
      
      if (!slot || !item) return false
      
      // Add custom compatibility logic here if needed
      return true
    },
  
    getSkillEffectiveness(skillId) {
      const skill = SKILLS.find(s => s.id === skillId)
      if (!skill) return 0
      
      // Calculate effectiveness based on level and rarity
      const rarityMultiplier = {
        COMMON: 1,
        RARE: 1.5,
        LEGENDARY: 2,
        MYTHICAL: 3
      }
      
      return skill.level * (rarityMultiplier[skill.rarity] || 1)
    }
  }
})