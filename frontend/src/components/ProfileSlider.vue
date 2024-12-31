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
      <button @click="prevSlide" :disabled="currentSlide === 0">↑</button>
      <button @click="nextSlide" :disabled="currentSlide === totalSlides - 1">↓</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ProfileSlider',
  setup() {
    const profileImage = ref('/images/profile.png')
    const name = ref('Imad Zaoug')
    const title = ref('Data scientist & Full stack')
    const currentSlide = ref(0)
    const totalSlides = ref(7) 

    const personalInfo = ref({
      'Location': 'Rabat, Morocco',
      'Email': 'imad.zaoug@centrale-casablanca.ma',
      'Specialty': 'Your Specialty',
      'Experience': 'X Years',
      'Languages': 'Arabe, French, English'
    })

    const projects = ref([
      {
        title: 'Project 1',
        type: 'School Project',
        description: 'Description of the project...',
        technologies: ['Tech1', 'Tech2', 'Tech3']
      },
      // Add more projects
    ])

    const experience = ref([
      {
        position: 'Position Title',
        company: 'Company Name',
        period: 'Jan 2023 - Present',
        responsibilities: [
          'Responsibility 1',
          'Responsibility 2'
        ]
      },
      // Add more experiences
    ])

    const technicalSkills = ref({
      'Programming': ['JavaScript', 'Python', 'Java'],
      'Frontend': ['Vue.js', 'React', 'HTML/CSS'],
      'Backend': ['Node.js', 'Flask', 'Django'],
      'Database': ['MongoDB', 'PostgreSQL']
    })

    const softSkills = ref([
      {
        name: 'Communication',
        description: 'Excellent verbal and written communication skills...'
      },
      // Add more soft skills
    ])

    const interests = ref([
      {
        name: 'Technology',
        description: 'Passionate about emerging technologies...'
      },
      // Add more interests
    ])

    const slidePosition = computed(() => currentSlide.value * 100)

    const nextSlide = () => {
      if (currentSlide.value < totalSlides.value - 1) {
        currentSlide.value++
      }
    }

    const prevSlide = () => {
      if (currentSlide.value > 0) {
        currentSlide.value--
      }
    }

    return {
      profileImage,
      name,
      title,
      currentSlide,
      totalSlides,
      personalInfo,
      projects,
      experience,
      technicalSkills,
      softSkills,
      interests,
      slidePosition,
      nextSlide,
      prevSlide
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
}

.slider-container {
  flex: 1;
  transition: transform 0.5s ease-in-out;
}

.slide {
  height: 100vh;
  padding: 2rem;
  overflow-y: auto;

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
  }
}

.info-grid, .projects-grid, .skills-grid, .soft-skills-grid, .interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.project-card, .soft-skill-item, .interest-item {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tech-tag, .skill-tag {
  display: inline-block;
  background: #e0e0e0;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  margin: 0.25rem;
  font-size: 0.9rem;
}

.timeline {
  .experience-item {
    margin-bottom: 2rem;
    padding-left: 1.5rem;
    border-left: 2px solid #42b883;
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
    background: #ddd;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress {
    width: 100%;
    background: #42b883;
    border-radius: 2px;
    transition: height 0.3s ease;
  }

  button {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    background: #42b883;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}

h2 {
  color: #42b883;
  margin-bottom: 2rem;
  font-size: 2rem;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.responsibilities {
  margin-top: 1rem;
  padding-left: 1.5rem;

  li {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 768px) {
  .slider-nav {
    right: 1rem;
  }

  .slide {
    padding: 1rem;
  }
}
</style>