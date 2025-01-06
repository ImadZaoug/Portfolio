import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import CSS before Vuetify
import './assets/main.css'
// Import tooltip overrides
import './styles/tooltip-overrides.scss'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#42b983',
          secondary: '#2c3e50',
          'on-surface': '#000000',
          'on-surface-variant': 'rgba(0, 0, 0, 0.87)',
          background: '#ffffff',
          'theme-text': 'rgba(0, 0, 0, 0.87)',
          'name-text': '#42b983',
          surface: '#ffffff',
          error: '#ff5252',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#48D597',
          secondary: '#34495e',
          'on-surface': '#ffffff',
          'on-surface-variant': 'rgba(255, 255, 255, 0.87)',
          background: '#1e1e1e',
          'theme-text': 'rgba(255, 255, 255, 0.87)',
          'name-text': '#48D597',
          surface: '#2d2d2d',
          error: '#ff5252',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00'
        }
      }
    }
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(vuetify)
app.use(router)

app.mount('#app')