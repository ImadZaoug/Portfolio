// ProfileSlider.vue
<template>
  <div class="profile-slider">
    <div class="slider-container" 
         :style="{ transform: `translateY(-${slidePosition}%)` }">
      
      <!-- Profile Image Section -->
      <section class="slide">
        <div class="profile-image">
          <img :src="profileImage" alt="Profile Picture">
          <h1>{{ name }}</h1>
          <h2>{{ title }}</h2>
        </div>
      </section>

      <!-- Personal Info Section -->
      <section class="slide">
        <div class="personal-info">
          <h2>About Me</h2>
          <div class="info-grid">
            <div v-for="(info, key) in personalInfo" :key="key" class="info-item">
              <span class="label">{{ key }}:</span>
              <span class="value">{{ info }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section class="slide">
        <div class="projects">
          <h2>Projects</h2>
          <div class="projects-grid">
            <div v-for="project in projects" :key="project.title" class="project-card">
              <h3>{{ project.title }}</h3>
              <p class="project-type">{{ project.type }}</p>
              <p class="project-desc">{{ project.description }}</p>
              <div class="project-tech">
                <span v-for="tech in project.technologies" 
                      :key="tech" 
                      class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Professional Experience Section -->
      <section class="slide">
        <div class="experience">
          <h2>Professional Experience</h2>
          <div class="timeline">
            <div v-for="exp in experience" :key="exp.company" class="experience-item">
              <div class="exp-header">
                <h3>{{ exp.position }}</h3>
                <span class="company">{{ exp.company }}</span>
                <span class="date">{{ exp.period }}</span>
              </div>
              <ul class="responsibilities">
                <li v-for="(resp, idx) in exp.responsibilities" 
                    :key="idx">{{ resp }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Technical Skills Section -->
      <section class="slide skills-section">
        <div class="skills">
          <h2>Technical Skills</h2>
          <div class="skills-container" :class="{ 'fullscreen-container': isFullscreen }">
            <SkillTree 
              :initial-skills="technicalSkills"
              :available-points="availablePoints"
              :max-points="maxPoints"
              @unlock-skill="handleSkillUnlock"
              @fullscreen-change="handleFullscreenChange"
              :is-fullscreen="isFullscreen"
            />
          </div>
        </div>
      </section>

      <!-- Soft Skills Section -->
      <section class="slide">
        <div class="soft-skills">
          <h2>Soft Skills</h2>
          <div class="soft-skills-grid">
            <div v-for="skill in softSkills" 
                 :key="skill.name" 
                 class="soft-skill-item">
              <h3>{{ skill.name }}</h3>
              <p>{{ skill.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Interests Section -->
      <section class="slide">
        <div class="interests">
          <h2>Interests</h2>
          <div class="interests-grid">
            <div v-for="interest in interests" 
                 :key="interest.name" 
                 class="interest-item">
              <h3>{{ interest.name }}</h3>
              <p>{{ interest.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Navigation -->
    <div class="slider-nav">
      <div class="progress-bar">
        <div class="progress" 
             :style="{ height: `${(currentSlide / (totalSlides - 1)) * 100}%` }">
        </div>
      </div>
      <button @click="handlePrevSlide" :disabled="isAnimating || currentSlide === 0">↑</button>
      <button @click="handleNextSlide" :disabled="isAnimating || currentSlide === totalSlides - 1">↓</button>
    </div>
  </div>
</template>

//frontend/src/components/ProfileSlider.vue script section
<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SkillTree from './SkillTree.vue'

export default {
  name: 'ProfileSlider',
  components: {
    SkillTree
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['section-change', 'animation-start', 'animation-complete'],
  
  setup(props, { emit }) {
    const profileImage = ref('/images/profile.png')
    const name = ref('Imad Zaoug')
    const title = ref('Data scientist & Full stack')
    const currentSlide = ref(0)
    const totalSlides = ref(7)
    const isAnimating = ref(false)
    const isSkillTreeFullscreen = ref(false)

    // Base information
    const personalInfo = ref({
      'Location': 'Rabat, Morocco',
      'Email': 'imad.zaoug@centrale-casablanca.ma',
      'Specialty': 'Data Science | Web Development',
      'Experience': '2+ Years',
      'Languages': 'Arabic, French, English'
    })

    // Projects section
    const projects = ref([
      {
        title: 'AI-Powered Healthcare Analysis',
        type: 'Research Project',
        description: 'Developed a machine learning model for early disease detection using patient data',
        technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas']
      },
      {
        title: 'E-commerce Platform',
        type: 'Full Stack Project',
        description: 'Built a complete e-commerce solution with advanced features',
        technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Express']
      }
    ])

    // Experience section
    const experience = ref([
      {
        position: 'Data Science Intern',
        company: 'Tech Solutions Inc.',
        period: 'Jun 2023 - Dec 2023',
        responsibilities: [
          'Developed predictive models for customer behavior analysis',
          'Implemented data pipelines using Python and SQL',
          'Created visualization dashboards using PowerBI'
        ]
      },
      {
        position: 'Full Stack Developer',
        company: 'Web Innovations',
        period: 'Jan 2023 - May 2023',
        responsibilities: [
          'Developed responsive web applications using Vue.js',
          'Implemented RESTful APIs using Node.js',
          'Managed database architecture and optimization'
        ]
      }
    ])

    // Skills tree data and state
    const availablePoints = ref(5)
    const maxPoints = ref(20)
    
    const technicalSkills = ref([
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
    ])

    // Soft Skills section
    const softSkills = ref([
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
    ])

    // Interests section
    const interests = ref([
      {
        name: 'Artificial Intelligence',
        description: 'Passionate about AI advancement and its ethical implications'
      },
      {
        name: 'Open Source',
        description: 'Active contributor to open source projects and community initiatives'
      },
      {
        name: 'Tech Innovation',
        description: 'Following and experimenting with emerging technologies'
      }
    ])

    // Computed properties
    const slidePosition = computed(() => currentSlide.value * 100)

    // Animation handling
    const getScrollAnimation = (direction, currentSection) => {
      if (direction === 'down') {
        if (currentSection === 0) return 'jump'
        if (currentSection === 2) return 'RunLeft'
        if (currentSection === 4) return 'charge'
        return 'climbingDownWall'
      } else {
        if (currentSection === 1) return 'freehangClimb'
        if ([3, 5].includes(currentSection)) return 'RunRight'
        return 'climbing'
      }
    }

    // Navigation methods
    const handleNextSlide = async () => {
      if (props.disabled || isAnimating.value || currentSlide.value >= totalSlides.value - 1) return
      
      isAnimating.value = true
      const animation = getScrollAnimation('down', currentSlide.value)
      
      emit('animation-start', {
        animation,
        direction: 'down',
        fromSection: currentSlide.value,
        toSection: currentSlide.value + 1
      })

      await new Promise(resolve => setTimeout(resolve, 500))
      
      currentSlide.value++
      emit('section-change', currentSlide.value)
      
      isAnimating.value = false
      emit('animation-complete')
    }

    const handlePrevSlide = async () => {
      if (props.disabled || isAnimating.value || currentSlide.value <= 0) return
      
      isAnimating.value = true
      const animation = getScrollAnimation('up', currentSlide.value)
      
      emit('animation-start', {
        animation,
        direction: 'up',
        fromSection: currentSlide.value,
        toSection: currentSlide.value - 1
      })

      await new Promise(resolve => setTimeout(resolve, 500))
      
      currentSlide.value--
      emit('section-change', currentSlide.value)
      
      isAnimating.value = false
      emit('animation-complete')
    }

    // Skills tree methods
    const handleSkillUnlock = (skillId) => {
      const skill = technicalSkills.value.find(s => s.id === skillId)
      if (skill && !skill.unlocked && availablePoints.value >= skill.cost) {
        skill.unlocked = true
        availablePoints.value -= skill.cost
      }
    }

    const handleFullscreenChange = (isFullscreen) => {
      isSkillTreeFullscreen.value = isFullscreen
      emit('fullscreen-change', isFullscreen)
    }

    // Keyboard navigation
    const handleKeydown = (e) => {
      if (props.disabled || isSkillTreeFullscreen.value) return
      
      if (e.key === 'ArrowUp') {
        handlePrevSlide()
      } else if (e.key === 'ArrowDown') {
        handleNextSlide()
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })

    return {
      profileImage,
      name,
      title,
      currentSlide,
      totalSlides,
      isAnimating,
      isSkillTreeFullscreen,
      personalInfo,
      projects,
      experience,
      technicalSkills,
      availablePoints,
      maxPoints,
      softSkills,
      interests,
      slidePosition,
      handleNextSlide,
      handlePrevSlide,
      handleSkillUnlock,
      handleFullscreenChange
    }
  }
}
</script>

//The complete style section
<style lang="scss" scoped>
// Variables
:root {
  --fullscreen-z-index: 9999;
}

.skills-section {
  position: relative;
  z-index: 1;
}

// Main container styles
.profile-slider {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  display: flex;
  perspective: 1000px;

  &:has(.skills-section.fullscreen) {
    position: static;
  }
}

.slider-container {
  flex: 1;
  transition: transform 0.8s ease-in-out;
  transform-style: preserve-3d;
  will-change: transform;
}

// Slide styles
.slide {
  height: 100vh;
  padding: 3rem;
  overflow-y: auto;
  backface-visibility: hidden;
  transition: opacity 0.5s ease-in-out;
  background: var(--background-color);

  &::-webkit-scrollbar {
    width: 6px;
    &-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
  }

  &.skills-section {
    overflow: hidden;
    padding: 2rem;

    &.fullscreen {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: var(--fullscreen-z-index);
      margin: 0;
      padding: 0;
      overflow: hidden;

      .skills-container {
        position: fixed;
        inset: 0;
        height: 100vh;
        width: 100vw;
        border-radius: 0;
        margin: 0;
        padding: 0;
        z-index: var(--fullscreen-z-index);

        &.fullscreen {
          box-shadow: none;
        }
      }

      .skills h2 {
        position: fixed;
        top: 2rem;
        left: 2rem;
        z-index: calc(var(--fullscreen-z-index) + 1);
        margin: 0;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
  }
}

// Profile image section
.profile-image {
  text-align: center;
  padding-top: 20vh;
  
  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px var(--shadow-color);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  h1 {
    margin-top: 1rem;
    color: var(--text-color);
    font-size: 2.5rem;
  }

  h2 {
    color: var(--primary-color);
    font-size: 1.8rem;
    margin-top: 0.5rem;
  }
}

// Grid layouts
.info-grid, 
.projects-grid, 
.skills-grid, 
.soft-skills-grid, 
.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
  will-change: transform;
  transition: transform 0.3s ease;
}

// Card styles
.project-card, 
.soft-skill-item, 
.interest-item {
  background: var(--background-color);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }
}

// Skills section styles
.skills {
  .skills-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 200px);
    overflow: hidden;
    border-radius: 12px;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%);
    box-shadow: 0 4px 20px var(--shadow-color);
    transition: all 0.3s ease-in-out;
    
    &.fullscreen-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }
  }

  h2 {
    margin-bottom: 2rem;
    color: var(--text-color);
    text-align: left;
    
    &::after {
      content: '';
      display: block;
      width: 50px;
      height: 3px;
      background: var(--primary-color);
      margin-top: 0.5rem;
    }
  }
}

// Tags
.tech-tag, 
.skill-tag {
  display: inline-block;
  background: var(--primary-color);
  color: var(--background-color);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  margin: 0.25rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: var(--secondary-color);
    transform: scale(1.05);
  }
}

// Timeline
.timeline {
  .experience-item {
    margin-bottom: 2rem;
    padding-left: 1.5rem;
    border-left: 2px solid var(--primary-color);
    transition: border-left-width 0.2s ease, transform 0.3s ease;

    &:hover {
      border-left-width: 4px;
      transform: translateX(5px);
    }

    .exp-header {
      margin-bottom: 1rem;

      h3 {
        margin-bottom: 0.5rem;
        color: var(--primary-color);
      }

      .company {
        display: block;
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .date {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }

    .responsibilities {
      list-style-type: none;
      padding-left: 0;

      li {
        position: relative;
        padding-left: 1.5rem;
        margin-bottom: 0.5rem;

        &::before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--primary-color);
        }
      }
    }
  }
}

// Navigation
.slider-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 10;

  &:has(~ .slide .skills-container.fullscreen-container) {
    display: none;
  }

  .progress-bar {
    width: 4px;
    height: 200px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress {
    width: 100%;
    background: var(--primary-color);
    border-radius: 2px;
    transition: height 0.3s ease;
  }

  button {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--background-color);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    will-change: transform;

    &:hover:not(:disabled) {
      transform: scale(1.1);
      background: var(--secondary-color);
      box-shadow: 0 2px 8px var(--shadow-color);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      background: var(--border-color);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

// Section-specific styles
h2 {
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-size: 2.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 50px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
  }
}

h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

// Slide transitions
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease-in-out;
}

.slide-enter-from {
  transform: translateY(100%) rotateZ(5deg);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-100%) rotateZ(-5deg);
  opacity: 0;
}

// Responsive styles
@media (max-width: 768px) {
  .slide.skills-section.fullscreen {
    padding: 0;
    
    .skills h2 {
      top: 1rem;
      left: 1rem;
      font-size: 1.8rem;
    }
  }

  .slider-nav {
    right: 1rem;
    
    button {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }

    .progress-bar {
      height: 150px;
    }
  }

  .slide {
    padding: 1rem;

    &.skills-section {
      padding: 1rem;
    }
  }

  .profile-image {
    img {
      width: 150px;
      height: 150px;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }

  .info-grid, 
  .projects-grid, 
  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .slide.skills-section.fullscreen {
    .skills h2 {
      font-size: 1.5rem;
    }
  }

  .slider-nav {
    right: 0.5rem;
    
    button {
      width: 32px;
      height: 32px;
    }
  }

  .slide {
    padding: 0.8rem;
  }

  h2 {
    font-size: 1.6rem;
  }

  .profile-image {
    img {
      width: 120px;
      height: 120px;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.2rem;
    }
  }

  .project-card, 
  .soft-skill-item, 
  .interest-item {
    padding: 1.5rem;
  }
}

// Print styles
@media print {
  .skills-section.fullscreen {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    
    .skills-container {
      position: relative !important;
      height: auto !important;
      min-height: 500px;
    }
  }

  .slider-nav {
    display: none;
  }

  .slide {
    page-break-after: always;
  }
}
</style>