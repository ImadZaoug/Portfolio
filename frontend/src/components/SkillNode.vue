<!-- frontend/src/components/SkillNode.vue -->
<template>
    <div 
      class="skill-node"
      :class="{ 'is-unlocked': skill.unlocked }"
      @click="$emit('node-click', skill.id)"
    >
      <div class="skill-icon">{{ skill.icon }}</div>
      <div class="skill-name">{{ skill.name }}</div>
      <div class="skill-level">
        <div 
          v-for="n in skill.maxLevel" 
          :key="n"
          class="level-dot"
          :class="{ 'is-filled': n <= skill.level }"
        ></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SkillNode',
    props: {
      skill: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .skill-node {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--background-color);
    border: 2px solid var(--primary-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .skill-node:hover {
    transform: scale(1.1);
  }
  
  .skill-icon {
    font-size: 24px;
  }
  
  .skill-name {
    position: absolute;
    top: -25px;
    white-space: nowrap;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .skill-node:hover .skill-name {
    opacity: 1;
  }
  
  .skill-level {
    position: absolute;
    bottom: -20px;
    display: flex;
    gap: 4px;
  }
  
  .level-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border-color);
    transition: background-color 0.3s ease;
  }
  
  .level-dot.is-filled {
    background: var(--primary-color);
  }
  
  .is-unlocked {
    border-color: var(--secondary-color);
    box-shadow: 0 0 10px var(--primary-color);
  }
  </style>