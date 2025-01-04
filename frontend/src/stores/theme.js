// frontend/src/stores/theme.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    colors: {
      light: {
        primary: '#42b983',
        secondary: '#2c3e50',
        accent: '#ff4081',
        background: '#ffffff',
        surface: '#ffffff',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#fb8c00',
        'on-surface': '#000000',
        'on-surface-variant': 'rgba(0, 0, 0, 0.87)',
        'theme-text': 'rgba(0, 0, 0, 0.87)',
        'name-text': '#42b983'
      },
      dark: {
        primary: '#48D597',
        secondary: '#34495e',
        accent: '#ff4081',
        background: '#1e1e1e',
        surface: '#2d2d2d',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#fb8c00',
        'on-surface': '#ffffff',
        'on-surface-variant': 'rgba(255, 255, 255, 0.87)',
        'theme-text': 'rgba(255, 255, 255, 0.87)',
        'name-text': '#48D597'
      }
    }
  }),

  getters: {
    currentTheme: (state) => state.isDark ? 'dark' : 'light',
    themeColors: (state) => state.colors[state.currentTheme]
  },

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.currentTheme)
      // Ensure body class is updated
      document.body.classList.toggle('dark-theme', this.isDark)
      // Update CSS custom properties
      this.updateCSSVariables()
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.isDark = prefersDark
      }
      // Initialize theme on load
      document.body.classList.toggle('dark-theme', this.isDark)
      this.updateCSSVariables()
    },

    setCustomColors(theme, colors) {
      this.colors[theme] = { ...this.colors[theme], ...colors }
      this.updateCSSVariables()
    },

    updateCSSVariables() {
      const colors = this.themeColors
      Object.entries(colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--v-theme-${key}`, value)
      })
    }
  }
})