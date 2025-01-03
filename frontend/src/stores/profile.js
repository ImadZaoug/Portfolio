// frontend/src/stores/profile.js
import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profileImage: '/images/profile.png',
    name: 'Imad Zaoug',
    title: 'Data scientist & Full stack',
    personalInfo: {
      'Location': 'Rabat, Morocco',
      'Email': 'imad.zaoug@centrale-casablanca.ma',
      'Specialty': 'Data Science | Web Development',
      'Experience': '2+ Years',
      'Languages': 'Arabic, French, English'
    },
    interests: [
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
    ]
  }),
  
  actions: {
    updatePersonalInfo(info) {
      this.personalInfo = { ...this.personalInfo, ...info }
    },
    
    updateBasicInfo({ name, title, profileImage }) {
      if (name) this.name = name
      if (title) this.title = title
      if (profileImage) this.profileImage = profileImage
    },

    addInterest(interest) {
      this.interests.push(interest)
    },

    removeInterest(index) {
      this.interests.splice(index, 1)
    },

    updateInterest(index, updatedInterest) {
      if (index >= 0 && index < this.interests.length) {
        this.interests[index] = updatedInterest
      }
    }
  }
})