// frontend/src/stores/skills.js
import { defineStore } from 'pinia'

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    availablePoints: 5,
    maxPoints: 20,
    technicalSkills: [
      // Core Skills
      {
        id: 'core_programming',
        name: 'Programming',
        description: 'Core programming fundamentals',
        icon: '💻',
        position: { x: 600, y: 400 },
        unlocked: true,
        cost: 0
      },
      // Data Science Branch
      {
        id: 'python',
        name: 'Python',
        description: 'Python programming & data analysis',
        icon: '🐍',
        position: { x: 450, y: 300 },
        dependencies: ['core_programming'],
        unlocked: false,
        cost: 1
      },
      {
        id: 'machine_learning',
        name: 'Machine Learning',
        description: 'ML algorithms & model training',
        icon: '🤖',
        position: { x: 350, y: 200 },
        dependencies: ['python'],
        unlocked: false,
        cost: 2
      },
      {
        id: 'deep_learning',
        name: 'Deep Learning',
        description: 'Neural networks & deep learning',
        icon: '🧠',
        position: { x: 250, y: 150 },
        dependencies: ['machine_learning'],
        unlocked: false,
        cost: 2
      },
      // Web Development Branch
      {
        id: 'javascript',
        name: 'JavaScript',
        description: 'JavaScript & modern web development',
        icon: '🌐',
        position: { x: 750, y: 300 },
        dependencies: ['core_programming'],
        unlocked: false,
        cost: 1
      },
      {
        id: 'frontend',
        name: 'Frontend',
        description: 'Frontend frameworks & UI development',
        icon: '🎨',
        position: { x: 850, y: 200 },
        dependencies: ['javascript'],
        unlocked: false,
        cost: 2
      },
      {
        id: 'backend',
        name: 'Backend',
        description: 'Backend development & APIs',
        icon: '⚙️',
        position: { x: 950, y: 150 },
        dependencies: ['javascript'],
        unlocked: false,
        cost: 2
      },
      // Database Branch
      {
        id: 'sql',
        name: 'SQL',
        description: 'Relational databases & SQL',
        icon: '📊',
        position: { x: 500, y: 500 },
        dependencies: ['core_programming'],
        unlocked: false,
        cost: 1
      },
      {
        id: 'nosql',
        name: 'NoSQL',
        description: 'NoSQL databases & data modeling',
        icon: '🗄️',
        position: { x: 700, y: 500 },
        dependencies: ['core_programming'],
        unlocked: false,
        cost: 1
      },
      // DevOps Branch
      {
        id: 'devops',
        name: 'DevOps',
        description: 'CI/CD & deployment',
        icon: '🔄',
        position: { x: 600, y: 600 },
        dependencies: ['sql', 'nosql'],
        unlocked: false,
        cost: 3
      }
    ],
    softSkills: [
      {
        name: 'Problem Solving',
        description: 'Strong analytical and creative approach to solving complex problems'
      },
      {
        name: 'Communication',
        description: 'Excellent verbal and written communication skills in multiple languages'
      },
      {
        name: 'Leadership',
        description: 'Experience leading technical teams and mentoring junior developers'
      }
    ]
  }),

  getters: {
    getSkillById: (state) => (id) => {
      return state.technicalSkills.find(skill => skill.id === id)
    },
    
    unlockedSkills: (state) => {
      return state.technicalSkills.filter(skill => skill.unlocked)
    },
    
    availableSkills: (state) => {
      return state.technicalSkills.filter(skill => {
        if (skill.unlocked) return false
        if (!skill.dependencies) return true
        return skill.dependencies.every(depId => {
          const depSkill = state.technicalSkills.find(s => s.id === depId)
          return depSkill && depSkill.unlocked
        })
      })
    }
  },

  actions: {
    unlockSkill(skillId) {
      const skill = this.getSkillById(skillId)
      if (!skill || skill.unlocked || this.availablePoints < skill.cost) return false

      // Check dependencies
      if (skill.dependencies) {
        const allDependenciesUnlocked = skill.dependencies.every(depId => {
          const depSkill = this.getSkillById(depId)
          return depSkill && depSkill.unlocked
        })
        if (!allDependenciesUnlocked) return false
      }

      skill.unlocked = true
      this.availablePoints -= skill.cost
      return true
    },

    resetSkills() {
      this.availablePoints = this.maxPoints
      this.technicalSkills.forEach(skill => {
        if (skill.id !== 'core_programming') {
          skill.unlocked = false
        }
      })
    },

    updateSkillPosition(skillId, position) {
      const skill = this.getSkillById(skillId)
      if (skill) {
        skill.position = position
      }
    },

    addSoftSkill(skill) {
      this.softSkills.push(skill)
    },

    removeSoftSkill(index) {
      this.softSkills.splice(index, 1)
    },

    updateSoftSkill(index, updatedSkill) {
      if (index >= 0 && index < this.softSkills.length) {
        this.softSkills[index] = updatedSkill
      }
    }
  }
})