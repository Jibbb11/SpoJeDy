<template>
  <section class="now-panel">
    <div class="now-panel-head">
      <h3>{{ current.title }}</h3>
      <button class="mini-icon" aria-label="More options">
        <i class="bi bi-three-dots"></i>
      </button>
    </div>

    <img class="now-cover" :src="current.cover" :alt="current.title" />

    <div class="d-flex align-items-start justify-content-between gap-3">
      <div>
        <h2>{{ current.title }}</h2>
        <p>{{ current.artist }}</p>
      </div>
    </div>

    <div class="related">
      <h4>Related music videos</h4>
      <RouterLink
        v-for="song in related"
        :key="song.id"
        :to="`/videos/${song.id}`"
        class="related-item"
      >
        <img :src="song.cover" :alt="song.title" />
        <div>
          <strong>{{ song.title }}</strong>
          <small>{{ song.artist }}</small>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { songs } from '../data/songs'
import { addToLibrary, currentSong, isInLibrary } from '../stores/player'

const current = currentSong
const related = computed(() => songs.filter((song) => song.id !== current.value.id).slice(0, 4))
</script>
