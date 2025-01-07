import { defineStore } from 'pinia'

export const useExperienceStore = defineStore('experience', {
  state: () => ({
    experience: [
      {
        position: 'Full-stack Developer',
        company: 'ReciTAL',
        location: 'Paris, France',
        period: '2024/11 – 2025/02',
        type: 'Fixed-Term Contract "CDD"',
        responsibilities: [
          'Front-End Development: Developed user interfaces and enhanced client-side functionality using HTML, CSS, and JavaScript.',
          'Back-End Development: Implemented server-side logic and database interactions using Vue.js and Python.',
          'Database Management: Created and managed databases, executed basic queries, and handled data manipulation tasks.',
          'Web Application Development: Contributed to the development, debugging, and testing of web applications.',
          'Version Control: Collaborated with a team using Git for version control.',
          'Code Reviews: Participated in peer reviews and applied feedback to improve code quality.',
          'Application Deployment: Supported deployment processes in development and staging environments.'
        ],
        technologies: ['Vue.js', 'Python', 'HTML', 'CSS', 'JavaScript', 'Git', 'FastAPI', 'Postgresql', 'Docker']
      },
      {
        position: 'Data Scientist & Full Stack Developer',
        company: 'ReciTAL',
        location: 'Paris, France',
        period: '2024/05 – 2024/11',
        responsibilities: [
          'Developed "Ragtime," a system for evaluating LLMs & RAG systems using fact-based validation rather than traditional metrics. Achieved a fact-generation precision of 98% and a 95%+ evaluation match with human evaluations.',
          'Designed and implemented end-to-end system architecture, including LLM prompt engineering and Python-based code development (OOP).',
          'Tested and enhanced evaluation generative models, achieving >95% accuracy in fact detection and 90% contradiction identification across general and specialized topics.',
          'Integrated Ragtime into real-world applications and collaborated with DINUM to improve the performance of their ALBERT LLM.',
          'Built a front-end and back-end interface for Ragtime using Vue.js',
          'Participated in CharteGPT project: Processed LinkedIn posts, developed logo detection algorithms, and implemented OCR-based text analysis.',
          'Participated in Model Training: Prepared data and trained models for checkbox and signature detection.',
          'Developed new techniques for extracting table content to enhance chunking process in RAG systems.'
        ],
        technologies: ['Python', 'Vue.js', 'LLMs', 'RAG', 'Machine Learning', 'OCR', 'Computer Vision', 'RAG Debbuging', 'R&D', 'HTML', 'CSS', 'JavaScript', 'Git', 'FastAPI', 'Postgresql'],
        links: {
          github: ['https://github.com/recitalAI/ragtime', 'https://github.com/recitalAI/ragtime-package']
        }
      },
      {
        position: 'Data Scientist',
        company: 'MASciR',
        location: 'Rabat, Morocco',
        period: '2023/05 – 2023/09',
        responsibilities: [
          'Worked on Medical Assistance Robot project for enhancing detection of elderly in closed environments.',
          'Handled data collection and annotation processes.',
          'Performed data cleaning and preprocessing.',
          'Trained models for action recognition using LSTM and Logistic regression.',
          'Improved 3D detection models for capturing and identifying joints and individuals.'
        ],
        technologies: ['Python', 'LSTM', 'Machine Learning', 'Computer Vision', '3D Detection', 'Data Processing', 'Data collection']
      },
      {
        position: 'Data Analyst',
        company: 'AZAD Envirement',
        location: 'Rabat, Morocco',
        period: '2022/07 – 2022/09',
        responsibilities: [
          'Conducted characterization study of municipal solid waste in the city of Tangier.',
          'Implemented stratified sampling methods for data collection.',
          'Performed comprehensive data preprocessing and analysis.',
          'Conducted detailed statistical studies on waste composition.',
          'Generated insights and interpretations from collected data.',
        ],
        technologies: ['Data Analysis', 'Statistical Analysis', 'Sampling Methods', 'Data Visualization', 'Research Methods']
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