// frontend/src/stores/skills.js
import { defineStore } from 'pinia'

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    availablePoints: 50,
    maxPoints: 50,
    technicalSkills: [
      // Statistics Branch (Left, growing up)
      {
        id: 'statistics',
        name: 'Statistics',
        description: 'Core statistical concepts and fundamentals',
        lockedIcon: '🔒',
        icon: '📊',
        position: { x: 900, y: 700 },
        unlocked: true,
        cost: 0,
        branch: 'left'
      },

      // First Level Statistics Children
      {
        id: 'ai_ml',
        name: 'AI/ML',
        description: 'Artificial Intelligence and Machine Learning',
        lockedIcon: '🔒',
        icon: '🤖',
        position: { x: 500, y: 600 },
        dependencies: ['statistics'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'bayesian_stats',
        name: 'Bayesian Statistics',
        description: 'Bayesian statistical methods and inference',
        lockedIcon: '🔒',
        icon: '🎲',
        position: { x: 900, y: 600 },
        dependencies: ['statistics'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'inferential_stats',
        name: 'Inferential Statistics',
        description: 'Statistical inference and hypothesis testing',
        lockedIcon: '🔒',
        icon: '📈',
        position: { x: 1300, y: 600 },
        dependencies: ['statistics'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },

      // AI/ML Children
      {
        id: 'computer_vision',
        name: 'Computer Vision',
        description: 'Image and video processing techniques',
        lockedIcon: '🔒',
        icon: '👁️',
        position: { x: 300, y: 500 },
        dependencies: ['ai_ml'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'nlp_genai',
        name: 'NLP/GenAI',
        description: 'Natural Language Processing and Generative AI',
        lockedIcon: '🔒',
        icon: '🗣️',
        position: { x: 500, y: 500 },
        dependencies: ['ai_ml'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'rag_systems',
        name: 'RAG Systems',
        description: 'Retrieval Augmented Generation Systems',
        lockedIcon: '🔒',
        icon: '🔍',
        position: { x: 700, y: 500 },
        dependencies: ['ai_ml'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },

      // Bayesian Stats Child
      {
        id: 'bayesian_exp_design',
        name: 'Bayesian Experiment Design',
        description: 'Design and analysis of experiments using Bayesian methods',
        lockedIcon: '🔒',
        icon: '🔬',
        position: { x: 900, y: 500 },
        dependencies: ['bayesian_stats'],
        unlocked: false,
        cost: 3,
        branch: 'left'
      },

      // Inferential Stats Child
      {
        id: 'sampling_methods',
        name: 'Sampling Methods',
        description: 'Statistical sampling techniques',
        lockedIcon: '🔒',
        icon: '🎯',
        position: { x: 1300, y: 500 },
        dependencies: ['inferential_stats'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },

      // Computer Vision Children
      {
        id: 'object_detection',
        name: 'Object Detection',
        description: 'Detection and localization of objects in images',
        lockedIcon: '🔒',
        icon: '🎯',
        position: { x: 100, y: 400 },
        dependencies: ['computer_vision'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'pose_estimation',
        name: 'Pose Estimation',
        description: 'Human pose estimation and tracking',
        lockedIcon: '🔒',
        icon: '🏃',
        position: { x: 300, y: 400 },
        dependencies: ['computer_vision'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'autoencoders',
        name: 'Autoencoders',
        description: 'Neural network architectures for dimensionality reduction',
        lockedIcon: '🔒',
        icon: '🧬',
        position: { x: 500, y: 400 },
        dependencies: ['computer_vision'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },

      // NLP/GenAI Children
      {
        id: 'sentiment_analysis',
        name: 'Sentiment Analysis',
        description: 'Analysis of emotions and opinions in text',
        lockedIcon: '🔒',
        icon: '😊',
        position: { x: 200, y: 300 },
        dependencies: ['nlp_genai'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'transformers',
        name: 'Transformers',
        description: 'Transformer-based language models',
        lockedIcon: '🔒',
        icon: '🤖',
        position: { x: 400, y: 300 },
        dependencies: ['nlp_genai'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'document_analysis',
        name: 'Document Analysis',
        description: 'Text extraction and analysis from documents',
        lockedIcon: '🔒',
        icon: '📄',
        position: { x: 600, y: 300 },
        dependencies: ['nlp_genai'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'embeddings',
        name: 'Embeddings',
        description: 'Vector representations of text',
        lockedIcon: '🔒',
        icon: '🔤',
        position: { x: 800, y: 300 },
        dependencies: ['nlp_genai'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'translator',
        name: 'Translator',
        description: 'Machine translation systems',
        lockedIcon: '🔒',
        icon: '🌍',
        position: { x: 1000, y: 300 },
        dependencies: ['nlp_genai'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },

      // RAG Systems Children
      {
        id: 'chunking',
        name: 'Chunking',
        description: 'Text chunking strategies for RAG',
        lockedIcon: '🔒',
        icon: '✂️',
        position: { x: 600, y: 350 },
        dependencies: ['rag_systems'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'evaluation',
        name: 'Evaluation',
        description: 'RAG system evaluation methods',
        lockedIcon: '🔒',
        icon: '📊',
        position: { x: 800, y: 350 },
        dependencies: ['rag_systems'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },
      {
        id: 'indexing',
        name: 'Indexing',
        description: 'Efficient indexing for retrieval',
        lockedIcon: '🔒',
        icon: '📑',
        position: { x: 1000, y: 350 },
        dependencies: ['rag_systems'],
        unlocked: false,
        cost: 2,
        branch: 'left'
      },

      // Coding Branch (Right, growing down)
      {
        id: 'coding',
        name: 'Coding',
        description: 'Software development fundamentals',
        lockedIcon: '🔒',
        icon: '💻',
        position: { x: 800, y: 700  },
        unlocked: true,
        cost: 0,
        branch: 'right'
      },

      // First Level Coding Children
      {
        id: 'algorithms',
        name: 'Algorithms',
        description: 'Algorithm design and analysis',
        lockedIcon: '🔒',
        icon: '⚙️',
        position: { x: 400, y: 800 },
        dependencies: ['coding'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'web_dev',
        name: 'Web Development',
        description: 'Full-stack web development',
        lockedIcon: '🔒',
        icon: '🌐',
        position: { x: 1200, y: 800 },
        dependencies: ['coding'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },

      // Web Dev Children
      {
        id: 'frontend',
        name: 'Frontend',
        description: 'Frontend development',
        lockedIcon: '🔒',
        icon: '🎨',
        position: { x: 800, y: 900 },
        dependencies: ['web_dev'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'backend',
        name: 'Backend',
        description: 'Backend development',
        lockedIcon: '🔒',
        icon: '⚡',
        position: { x: 1200, y: 900 },
        dependencies: ['web_dev'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'databases',
        name: 'Databases',
        description: 'Database management',
        lockedIcon: '🔒',
        icon: '🗄️',
        position: { x: 1600, y: 900 },
        dependencies: ['web_dev'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Application deployment and Docker',
        lockedIcon: '🔒',
        icon: '🚀',
        position: { x: 2000, y: 900 },
        dependencies: ['web_dev'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },

      {
        id: 'docker',
        name: 'Docker',
        description: 'Docker',
        lockedIcon: '🔒',
        icon: '🚀',
        position: { x: 2000, y: 1100 },
        dependencies: ['deployment'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },

      // Frontend Children
      {
        id: 'vuejs',
        name: 'Vue.js',
        description: 'Vue.js framework',
        lockedIcon: '🔒',
        icon: '⚡',
        position: { x: 600, y: 1000 },
        dependencies: ['frontend'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'reactjs',
        name: 'React.js',
        description: 'React.js library',
        lockedIcon: '🔒',
        icon: '⚛️',
        position: { x: 800, y: 1000 },
        dependencies: ['frontend'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'html',
        name: 'HTML',
        description: 'HTML markup language',
        lockedIcon: '🔒',
        icon: '📝',
        position: { x: 1000, y: 1000 },
        dependencies: ['frontend'],
        unlocked: false,
        cost: 1,
        branch: 'right'
      },
      {
        id: 'css',
        name: 'CSS',
        description: 'CSS styling',
        lockedIcon: '🔒',
        icon: '🎨',
        position: { x: 1200, y: 1000 },
        dependencies: ['frontend'],
        unlocked: false,
        cost: 1,
        branch: 'right'
      },

      // Backend Children
      {
        id: 'fastapi',
        name: 'FastAPI',
        description: 'FastAPI framework',
        lockedIcon: '🔒',
        icon: '⚡',
        position: { x: 1100, y: 1000 },
        dependencies: ['backend'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'flask',
        name: 'Flask',
        description: 'Flask framework',
        lockedIcon: '🔒',
        icon: '🌶️',
        position: { x: 1400, y: 1000 },
        dependencies: ['backend'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'rest_api',
        name: 'REST API',
        description: 'RESTful API development',
        lockedIcon: '🔒',
        icon: '🔌',
        position: { x: 1300, y: 1100 },
        dependencies: ['fastapi', 'flask'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },

      // Database Children
      {
        id: 'sql',
        name: 'SQL',
        description: 'SQL query language',
        lockedIcon: '🔒',
        icon: '📊',
        position: { x: 1500, y: 1000 },
        dependencies: ['databases'],
        unlocked: false,
        cost: 2,
        branch: 'right'
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        description: 'PostgreSQL database',
        lockedIcon: '🔒',
        icon: '🐘',
        position: { x: 1800, y: 1000 },
        dependencies: ['databases'],
        unlocked: false,
        cost: 2,
        branch: 'right'
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
    },

    skillsByBranch: (state) => (branch) => {
      return state.technicalSkills.filter(skill => skill.branch === branch)
    },

    totalUnlockedSkills: (state) => {
      return state.technicalSkills.filter(skill => skill.unlocked && skill.id !== 'statistics' && skill.id !== 'coding').length
    },

    totalSkills: (state) => {
      return state.technicalSkills.length - 2 // Excluding the two root skills
    },

    getSkillProgress: (state) => (skillId) => {
      const skill = state.technicalSkills.find(s => s.id === skillId)
      if (!skill || !skill.dependencies) return 100
      const deps = skill.dependencies.map(depId => state.technicalSkills.find(s => s.id === depId))
      const unlockedDeps = deps.filter(dep => dep && dep.unlocked).length
      return Math.round((unlockedDeps / deps.length) * 100)
    }
  },

  actions: {
    unlockSkill(skillId) {
      const skill = this.getSkillById(skillId)
      if (!skill || skill.unlocked || this.availablePoints < skill.cost) return false

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
        if (!['statistics', 'coding'].includes(skill.id)) {
          skill.unlocked = false
        }
      })
    },

    unlockAllSkills() {
      this.technicalSkills.forEach(skill => {
        if (!skill.unlocked && skill.cost <= this.availablePoints) {
          this.unlockSkill(skill.id)
        }
      })
    },

    unlockBranch(branchId) {
      const branchSkills = this.skillsByBranch(branchId)
      branchSkills.sort((a, b) => {
        const aDepth = this.getSkillDepth(a.id)
        const bDepth = this.getSkillDepth(b.id)
        return aDepth - bDepth
      })
      
      branchSkills.forEach(skill => {
        if (!skill.unlocked && this.availablePoints >= skill.cost) {
          this.unlockSkill(skill.id)
        }
      })
    },

    getSkillDepth(skillId, memo = new Set()) {
      if (memo.has(skillId)) return 0
      memo.add(skillId)
      
      const skill = this.getSkillById(skillId)
      if (!skill || !skill.dependencies || skill.dependencies.length === 0) return 0
      
      return 1 + Math.max(...skill.dependencies.map(depId => 
        this.getSkillDepth(depId, memo)
      ))
    },

    calculateTotalCost(skillId, visited = new Set()) {
      if (visited.has(skillId)) return 0
      visited.add(skillId)
      
      const skill = this.getSkillById(skillId)
      if (!skill || skill.unlocked) return 0
      
      let cost = skill.cost
      if (skill.dependencies) {
        cost += skill.dependencies.reduce((acc, depId) => 
          acc + this.calculateTotalCost(depId, visited), 0
        )
      }
      return cost
    },

    exportState() {
      return {
        availablePoints: this.availablePoints,
        unlockedSkills: this.technicalSkills
          .filter(skill => skill.unlocked)
          .map(skill => skill.id)
      }
    },

    importState(state) {
      if (!state || !state.unlockedSkills) return false
      
      this.resetSkills()
      this.availablePoints = state.availablePoints

      state.unlockedSkills.forEach(skillId => {
        const skill = this.getSkillById(skillId)
        if (skill) skill.unlocked = true
      })

      return true
    }
  }
})