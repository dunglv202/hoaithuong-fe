import type { Appearance } from '@/models/common'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useThemeStore = defineStore('theme', () => {
  const theme = ref<Appearance>('light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyPreference()
  }

  const applyPreference = () => {
    document.querySelector('html')?.setAttribute('data-theme', theme.value)
  }

  applyPreference()

  return {
    theme,
    toggleTheme
  }
})

export default useThemeStore
