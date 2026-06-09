<template>
  <div class="content-scroll liked-page">
    <section class="liked-hero">
      <div class="liked-cover-large">
        <i class="bi bi-heart-fill"></i>
      </div>

      <div class="liked-hero-info">
        <span>PLAYLIST</span>
        <h1>Liked Songs</h1>
        <p>
          {{ profile.username }} • {{ likedSongs.length }} song{{ likedSongs.length > 1 ? 's' : '' }}
          <template v-if="totalDurationText">, {{ totalDurationText }}</template>
        </p>
      </div>
    </section>

    <section class="liked-actions">
      <button
        class="liked-play-btn"
        type="button"
        :disabled="!likedSongs.length"
        @click="playFirstLiked"
      >
        <i class="bi bi-play-fill"></i>
      </button>

      <button
        class="mini-icon"
        type="button"
        :class="{ active: player.shuffle }"
        :disabled="likedSongs.length <= 1"
        :title="likedSongs.length > 1 ? 'Shuffle Liked Songs' : 'Shuffle butuh minimal 2 lagu'"
        @click="toggleLikedShuffle"
      >
        <i class="bi bi-shuffle"></i>
      </button>

      <button class="mini-icon" type="button">
        <i class="bi bi-download"></i>
      </button>

      <div class="liked-sort">
        <i class="bi bi-search"></i>
        <span>Recently added</span>
        <i class="bi bi-list-ul"></i>
      </div>
    </section>

    <div v-if="queueMessage" class="liked-queue-feedback">
      {{ queueMessage }}
    </div>

    <section v-if="likedSongs.length" class="liked-table">
      <div class="liked-table-head">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span>Date added</span>
        <span><i class="bi bi-clock"></i></span>
      </div>

      <div
        v-for="(song, index) in likedSongs"
        :key="song.id"
        class="liked-row"
        :class="{ 'song-is-playing': player.isVisible && currentSong?.id === song.id }"
      >
        <button class="liked-number" type="button" @click="playLikedSong(song.id)">
          <span>{{ index + 1 }}</span>
          <i class="bi bi-play-fill"></i>
        </button>

        <RouterLink :to="`/songs/${song.id}`" class="liked-title">
          <img :src="song.cover" :alt="song.title" />

          <div>
            <strong :class="{ 'song-title-active': player.isVisible && currentSong?.id === song.id }">
              {{ song.title }}
            </strong>
            <small>{{ song.artist }}</small>
          </div>
        </RouterLink>

        <span class="liked-album">{{ song.album || '-' }}</span>
        <span class="liked-date">Recently liked</span>

        <div class="liked-duration">
          <button
            class="mini-icon queue-song-btn"
            type="button"
            title="Add to queue"
            aria-label="Add to queue"
            @click="handleAddToQueue(song.id)"
          >
            <i class="bi bi-list-plus"></i>
          </button>

          <button class="mini-icon active" type="button" @click="toggleLike(song.id)">
            <i class="bi bi-heart-fill"></i>
          </button>

          <span>{{ song.duration }}</span>
        </div>
      </div>
    </section>

    <section v-else class="liked-empty-state">
      <i class="bi bi-heart"></i>
      <h2>Belum ada lagu yang disukai</h2>
      <p>Klik icon love di bottom player untuk menambahkan lagu ke Liked Songs.</p>

      <RouterLink to="/" class="btn btn-success rounded-pill px-4">
        Cari Lagu
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  addSongToQueue,
  currentSong,
  likedSongs,
  playSong,
  player,
  toggleLike
} from '../stores/player'
import { profile } from '../stores/profile'

const queueMessage = ref('')

const likedQueueIds = computed(() => {
  return likedSongs.value.map((song) => song.id)
})

function durationToSeconds(duration) {
  if (!duration || !duration.includes(':')) return 0

  const [minutes, seconds] = duration.split(':').map(Number)
  return minutes * 60 + seconds
}

const totalDurationText = computed(() => {
  const totalSeconds = likedSongs.value.reduce((total, song) => {
    return total + durationToSeconds(song.duration)
  }, 0)

  if (!totalSeconds) return ''

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours} hr ${minutes} min`
  }

  return `${minutes} min`
})

function playLikedSong(songId) {
  playSong(songId, likedQueueIds.value)
}

function playFirstLiked() {
  if (!likedSongs.value.length) return

  playSong(likedSongs.value[0].id, likedQueueIds.value)
}

function toggleLikedShuffle() {
  if (likedSongs.value.length <= 1) {
    player.shuffle = false
    return
  }

  player.shuffle = !player.shuffle
}

function handleAddToQueue(songId) {
  if (!player.isVisible) {
    queueMessage.value = 'Putar lagu dulu sebelum menambahkan queue'
  } else {
    const result = addSongToQueue(songId)

    queueMessage.value =
      result === 'exists'
        ? 'Lagu sudah ada di queue'
        : 'Added to queue'
  }

  setTimeout(() => {
    queueMessage.value = ''
  }, 1600)
}
</script>