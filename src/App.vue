<template>
  <div :class="['app-shell', themeClass]">
    <AppLayout />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, provide } from 'vue'
import AppLayout from './components/AppLayout.vue'

const theme = ref(localStorage.getItem('spojedy-theme') || 'light')

const themeClass = computed(() => theme.value === 'light' ? 'theme-light' : 'theme-dark')

function setTheme(value) {
  theme.value = value
  localStorage.setItem('spojedy-theme', value)
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', theme.value)
})

provide('theme', theme)
provide('setTheme', setTheme)
</script>
