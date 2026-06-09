<template>
  <div class="content-scroll">
    <div class="page-head">
      <div>
        <span class="muted">SpoJeDy Video</span>
        <h1>Music Videos</h1>
      </div>

      <div class="pill-tabs">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          :class="{ active: activeCategory === category.value }"
          @click="activeCategory = category.value"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <div v-if="filteredVideos.length" class="video-grid">
      <RouterLink
        v-for="song in filteredVideos"
        :key="song.id"
        :to="`/videos/${song.id}`"
        class="video-card"
      >
        <div class="video-thumb">
          <img :src="song.wideCover || song.cover" :alt="song.title" />

          <div class="video-overlay">
            <span>
              <i class="bi bi-play-fill"></i>
            </span>
          </div>
        </div>

        <h3>{{ song.title }}</h3>
        <p>{{ song.artist }}</p>
      </RouterLink>
    </div>

    <div v-else class="empty-state">
      <i class="bi bi-collection-play"></i>
      <h3>No videos found</h3>
      <p>Belum ada video untuk kategori ini.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { songs } from '../data/songs'

const activeCategory = ref('all')

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Pop', value: 'pop' },
  { label: 'R&B', value: 'rnb' },
  { label: 'Rap', value: 'rap' }
]

const filteredVideos = computed(() => {
  const videoSongs = songs.filter((song) => song.video)

  if (activeCategory.value === 'all') {
    return videoSongs
  }

  return videoSongs.filter((song) => {
    return song.category === activeCategory.value
  })
})
</script>