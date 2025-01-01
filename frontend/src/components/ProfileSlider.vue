//frontend/src/components/ProfileSlider.vue
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
      <section class="slide">
        <div class="skills">
          <h2>Technical Skills</h2>
          <div class="skills-grid">
            <div v-for="(skills, category) in technicalSkills" 
                 :key="category" 
                 class="skill-category">
              <h3>{{ category }}</h3>
              <div class="skill-tags">
                <span v-for="skill in skills" 
                      :key="skill" 
                      class="skill-tag">
                  {{ skill }}
                </span>
              </div>
            </div>
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

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ProfileSlider',
  props: {
    disabled: {
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

    const personalInfo = ref({
      'Location': 'Rabat, Morocco',
      'Email': 'imad.zaoug@centrale-casablanca.ma',
      'Specialty': 'Data Science | Web Development',
      'Experience': '2+ Years',
      'Languages': 'Arabic, French, English'
    })

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

    const technicalSkills = ref({
      'Programming': ['Python', 'JavaScript', 'Java', 'R'],
      'Frontend': ['Vue.js', 'React', 'HTML/CSS', 'Tailwind'],
      'Backend': ['Node.js', 'Flask', 'Django', 'Express'],
      'Database': ['MongoDB', 'PostgreSQL', 'MySQL'],
      'Data Science': ['TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy']
    })

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

    const slidePosition = computed(() => currentSlide.value * 100)

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

    const handleNextSlide = async () => {
      if (props.disabled || isAnimating.value || currentSlide.value >= totalSlides.value - 1) return
      
      isAnimating.value = true
      const animation = getScrollAnimation('down', currentSlide.value)
      
      // Emit animation start event
      emit('animation-start', {
        animation,
        direction: 'down',
        fromSection: currentSlide.value,
        toSection: currentSlide.value + 1
      })

      // Wait for animation and transition
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update slide
      currentSlide.value++
      emit('section-change', currentSlide.value)
      
      // Reset animation state
      isAnimating.value = false
      emit('animation-complete')
    }

    const handlePrevSlide = async () => {
      if (props.disabled || isAnimating.value || currentSlide.value <= 0) return
      
      isAnimating.value = true
      const animation = getScrollAnimation('up', currentSlide.value)
      
      // Emit animation start event
      emit('animation-start', {
        animation,
        direction: 'up',
        fromSection: currentSlide.value,
        toSection: currentSlide.value - 1
      })

      // Wait for animation and transition
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update slide
      currentSlide.value--
      emit('section-change', currentSlide.value)
      
      // Reset animation state
      isAnimating.value = false
      emit('animation-complete')
    }

    // Add keyboard navigation
    onMounted(() => {
      window.addEventListener('keydown', (e) => {
        if (!props.disabled) {
          if (e.key === 'ArrowUp') {
            handlePrevSlide()
          } else if (e.key === 'ArrowDown') {
            handleNextSlide()
          }
        }
      })
    })

    return {
      profileImage,
      name,
      title,
      currentSlide,
      totalSlides,
      isAnimating,
      personalInfo,
      projects,
      experience,
      technicalSkills,
      softSkills,
      interests,
      slidePosition,
      handleNextSlide,
      handlePrevSlide
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-slider {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  display: flex;
  perspective: 1000px;
}

.slider-container {
  flex: 1;
  transition: transform 0.8s ease-in-out;
  transform-style: preserve-3d;
  will-change: transform;
}

.slide {
  height: 100vh;
  padding: 2rem;
  overflow-y: auto;
  backface-visibility: hidden;
  transition: opacity 0.5s ease-in-out;
  background: var(--background-color);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
}

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

.info-grid, .projects-grid, .skills-grid, .soft-skills-grid, .interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  will-change: transform;
  transition: transform 0.3s ease;
}

.project-card, .soft-skill-item, .interest-item {
  background: var(--background-color);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }
}

.tech-tag, .skill-tag {
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
  }
}

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
  font-size: 2rem;
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

// Responsive styles
@media (max-width: 768px) {
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

  .info-grid, .projects-grid, .skills-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .slider-nav {
    right: 0.5rem;
    
    button {
      width: 32px;
      height: 32px;
    }
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
}

// Animation classes
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

// Add transition states
.is-transitioning {
  pointer-events: none;
  user-select: none;

  .slide {
    transition: transform 0.8s ease-in-out, opacity 0.4s ease-in-out;
  }
}
</style>