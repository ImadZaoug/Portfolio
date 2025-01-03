// frontend/src/stores/experience.js
import { defineStore } from 'pinia'

export const useExperienceStore = defineStore('experience', {
  state: () => ({
    experience: [
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
    ]
  }),
  
  actions: {
    addExperience(newExperience) {
      this.experience.push(newExperience)
    },
    
    updateExperience(index, updatedExperience) {
      if (index >= 0 && index < this.experience.length) {
        this.experience[index] = updatedExperience
      }
    },
    
    removeExperience(index) {
      if (index >= 0 && index < this.experience.length) {
        this.experience.splice(index, 1)
      }
    }
  }
})