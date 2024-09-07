import { type Appearance, type ThemeConfig } from '@/models/common'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const useThemeStore = defineStore('theme', () => {
  const themeConfig = ref<ThemeConfig>('SYSTEM')
  const theme = ref<Appearance>('light')
  const systemDarkPref = window.matchMedia('(prefers-color-scheme: dark)')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const applyConfig = (config: ThemeConfig) => {
    themeConfig.value = config
    switch (config) {
      case 'LIGHT':
        theme.value = 'light'
        break
      case 'DARK':
        theme.value = 'dark'
        break
      case 'SYSTEM':
        theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  }

  const saveConfig = () => {
    localStorage.setItem('themeConfig', themeConfig.value)
  }

  systemDarkPref.addEventListener('change', (e) => {
    if (themeConfig.value === 'SYSTEM') {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })

  const applyPreference = () => {
    document.querySelector('html')?.setAttribute('data-theme', theme.value)
  }

  watch(themeConfig, applyConfig)
  watch(theme, applyPreference)
  applyConfig((localStorage.getItem('themeConfig') as ThemeConfig) || 'LIGHT')

  return {
    theme: theme,
    config: themeConfig,
    toggleTheme,
    applyConfig,
    saveConfig
  }
})

export default useThemeStore
