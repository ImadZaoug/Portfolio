// src/stores/cave.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCaveStore = defineStore('cave', () => {
  const isCaveMode = ref(false)

  function toggleCaveMode() {
    isCaveMode.value = !isCaveMode.value
    document.body.classList.toggle('cave-mode', isCaveMode.value)
  }

  // Disable cave mode if switching to dark theme
  function disableCaveMode() {
    if (isCaveMode.value) {
      isCaveMode.value = false
      document.body.classList.remove('cave-mode')
    }
  }

  return {
    isCaveMode,
    toggleCaveMode,
    disableCaveMode
  }
})