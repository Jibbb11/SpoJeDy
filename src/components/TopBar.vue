<template>
  <header class="topbar">
    <div class="topbar-left">
      <RouterLink to="/" class="top-icon" aria-label="Home">
        <i class="bi bi-house-door-fill"></i>
      </RouterLink>

      <div class="search-box">
        <i class="bi bi-search"></i>

        <input
          v-model="player.query"
          type="text"
          placeholder="What do you want to play?"
          aria-label="Search songs"
        />

        <button
          v-if="player.query"
          class="search-clear"
          type="button"
          aria-label="Clear search"
          @click="player.query = ''"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <div class="topbar-actions">
      <button class="icon-btn" type="button" aria-label="Notifications">
        <i class="bi bi-bell"></i>
      </button>

      <button class="icon-btn" type="button" aria-label="Friends">
        <i class="bi bi-people"></i>
      </button>

      <!-- Tombol Dark Mode / Light Mode -->
      <button
        class="icon-btn theme-toggle-btn"
        type="button"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        aria-label="Toggle theme"
        @click="toggleTheme"
      >
        <i :class="theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'"></i>
      </button>

      <RouterLink to="/profile" class="profile-chip" aria-label="Open profile">
        <img :src="profile.image" alt="profile" />
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { player } from '../stores/player'
import { profile } from '../stores/profile'
import { theme, toggleTheme } from '../stores/theme'
</script>