import { ref, watch } from 'vue'

const savedTheme = localStorage.getItem('spojedy-theme') || 'light'

export const theme = ref(savedTheme)

function applyTheme(value) {
  document.documentElement.classList.remove('theme-light', 'theme-dark')
  document.documentElement.classList.add(`theme-${value}`)
}

applyTheme(theme.value)

watch(theme, (value) => {
  localStorage.setItem('spojedy-theme', value)
  applyTheme(value)
})

export function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

export function setTheme(value) {
  theme.value = value === 'dark' ? 'dark' : 'light'
}