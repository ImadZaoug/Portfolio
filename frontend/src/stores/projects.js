// frontend/src/stores/projects.js
import { defineStore } from 'pinia';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: {
      threeDProjects: [
        {
          id: 1,
          title: "Predicting Hamiltonian Parameters",
          type: "testTube",
          shortDesc: "Scientific research paper",
          fullDesc: "Improvement of a machine learning model for predicting Hamiltonian parameters using sequential Monte Carlo and Bayesian experimental design.",
          technologies: ["R&D", "Sequential Monte Carlo", "Bayesian Design", "Python", "Algorithms"],
          links: {
            github: "https://github.com/ImadZaoug/Predicting-Hamiltonian-parameters"
          }
        },
        {
          id: 2,
          title: "VisionVista Glasses",
          type: "laser",
          shortDesc: "AI-powered vision assistance glasses",
          fullDesc: "Developing advanced intelligent glasses to replace human vision, offering users real-time information about their surroundings and responsive interactions through a voice bot. Key implementations include object detection, pose estimation models, speech-to-text recognition, GPT-4 integration, text-to-speech using pyttsx3, object detection with Detr-resnet-50, and depth estimation using GLPN-NYU.",
          context: "MoroccoAI Hackathon 2023 | Team of 3 Members",
          technologies: ["Computer Vision", "GPT-4", "PyTTSx3", "Detr-resnet-50", "GLPN-NYU"],
          links: {
            github: "https://github.com/ImadZaoug/2023-GenAI-Hackathon"
          }
        },
        {
          id: 3,
          title: "Fraud Detection System",
          type: "diffusion",
          shortDesc: "Banking transaction fraud detection",
          fullDesc: "Conducted feature engineering to derive actionable insights from limited data, achieving significant improvements in identifying suspicious activities.",
          context: "Winner of the Mynk Hackathon | Team of 3 Members",
          technologies: ["Machine Learning", "Data Analysis", "Python", "Feature Engineering"]
        },
        {
          id: 4,
          title: "Traffic Congestion Management",
          type: "vortex",
          shortDesc: "Roundabout traffic analysis system",
          fullDesc: "Developed a comprehensive management system to address traffic congestion issues at roundabouts, by fine-tunning object detection models to accurately count vehicles and trucks on each route. Prioritized route access based on real-time conditions.",
          context: "Individual Client Project | 2 people",
          technologies: ["Computer Vision", "Object Detection", "Traffic Analysis"]
        },
        {
          id: 5,
          title: "Virtual Customer Support Teleadvisor",
          type: "freezing",
          shortDesc: "AI-powered customer support system",
          fullDesc: "Implemented a virtual customer support teleadvisor utilizing Large Language Models (LLM) for question answering and voice models for speech recognition. Successfully developed and deployed a system that efficiently handles common inquiries, leveraging prompt engineering, fine-tuning, and retrieval augmented generation (RAG) techniques.",
          context: "School project for ATTIJARIWAFA BANK",
          technologies: ["LLM", "RAG", "Voice Recognition", "Prompt Engineering"]
        },
        {
          id: 6,
          title: "AdabTranslate-Darija",
          type: "chain",
          shortDesc: "MSA to Moroccan Darija translation",
          fullDesc: "Developed a translation model to convert Modern Standard Arabic (MSA) into Moroccan Darija, achieving a BLEU score of 46.49 using 26,000 annotated text pairs and GPT-4 augmentation. Fine-tuned on moussaKam/arabart with Hugging Face Transformers and PyTorch, employing advanced training techniques for high accuracy and fluency.",
          technologies: ["PyTorch", "Transformers", "NLP", "Arabic NLP"],
          links: {
            huggingface: "https://huggingface.co/itsmeussa/AdabTranslate-Darija"
          }
        }
      ],
      otherProjects: [
        {
          id: 7,
          title: "Robruter - Recruitment through AI",
          type: "bubbling",
          shortDesc: "AI-powered recruitment automation",
          fullDesc: "Revolutionized the recruitment process by developing an AI-powered model that autonomously generates tailored interview questions, conducts interviews using video analysis, and delivers individualized scores. Leveraged Llamaindex as a RAG system and large language models (LLM) to streamline candidate evaluation, significantly reducing time and costs for the company.",
          status: "In Progress",
          context: "Start-up idea",
          technologies: ["AI/ML", "RAG", "LLM", "Python", "Computer Vision"]
        },
        {
          id: 8,
          title: "Image Deblurring Program",
          type: "crystallizing",
          shortDesc: "Highway camera image enhancement",
          fullDesc: "Create a software application designed for deblurring images captured by highway cameras, particularly those focused on license plate recognition. This program incorporates an error correction function to mitigate the blurring effects and enhance image clarity.",
          context: "School project",
          technologies: ["Computer Vision", "Image Processing", "Python", "Algorithms", "R&D"]
        },
        {
          id: 9,
          title: "HydroPredict",
          type: "circulating",
          shortDesc: "Water distribution prediction system",
          fullDesc: "Creating a predictive model for the distribution of drinking water across Morocco's regions, which involves developing a model to predict dam resources (water levels in dams) and optimizing water distribution to address the water requirements in various regions of Morocco.",
          context: "School project",
          technologies: ["Machine Learning", "Data Analysis", "Python"]
        },
        {
          id: 10,
          title: "ECCOM",
          type: "pulsing",
          shortDesc: "School space reservation platform",
          fullDesc: "Develop a platform for the school that simplifies space reservations and student life within the school.",
          context: "Club project",
          technologies: ["HTML", "JavaScript", "CSS", "PHP", "SQL"]
        },
        {
          id: 11,
          title: "Wind Farm Feasibility Study",
          type: "reactive",
          shortDesc: "Satellite data analysis for wind farms",
          fullDesc: "Using wind measurements from satellite data as an alternative to real measurements in the process of financing wind farm projects.",
          context: "School project in collaboration with TAQA Morocco",
          technologies: ["Data Analysis", "Satellite Data", "Wind Energy"]
        }
      ]
    }
  }),

  getters: {
    getAllProjects: (state) => [...state.projects.threeDProjects, ...state.projects.otherProjects],
    getThreeDProjects: (state) => state.projects.threeDProjects,
    getOtherProjects: (state) => state.projects.otherProjects
  }
});