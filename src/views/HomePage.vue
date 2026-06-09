<template>
  <div class="content-scroll">
    <section class="quick-grid playlist-only-grid">
      <RouterLink to="/liked-songs" class="quick-card playlist-card">
        <div class="playlist-card-icon liked">
          <i class="bi bi-heart-fill"></i>
        </div>

        <div>
          <span>Liked Songs</span>
          <small>{{ likedSongs.length }} song{{ likedSongs.length > 1 ? 's' : '' }}</small>
        </div>
      </RouterLink>
    </section>

    <section v-if="trendingSongs.length" class="trending-section">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2>Trending now!</h2>
        <RouterLink to="/videos" class="show-link">Show all</RouterLink>
      </div>

      <div class="trending-grid">
        <div
          v-for="song in trendingSongs"
          :key="song.id"
          class="trending-card"
        >
          <RouterLink :to="`/songs/${song.id}`" class="trending-cover">
            <img :src="song.cover" :alt="song.title" />
          </RouterLink>

          <div class="trending-info">
            <RouterLink :to="`/songs/${song.id}`">
              <h3>{{ song.title }}</h3>
            </RouterLink>

            <p>{{ song.artist }}</p>

            <div class="trending-actions">
              <button class="big-play small" type="button" @click="playSong(song.id)">
                <i class="bi bi-play-fill"></i>
              </button>

              <button
                class="circle-outline"
                type="button"
                :class="{ active: isLiked(song.id) }"
                :title="isLiked(song.id) ? 'Unlike song' : 'Like song'"
                @click="toggleLike(song.id)"
              >
                <i :class="isLiked(song.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-row">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2>{{ player.query ? `Search results for “${player.query}”` : 'New Releases' }}</h2>
        <RouterLink to="/videos" class="show-link">Show all</RouterLink>
      </div>

      <div v-if="filtered.length" class="card-grid">
        <SongTile
          v-for="song in filtered"
          :key="song.id"
          :song="song"
          :to="`/songs/${song.id}`"
        />
      </div>

      <div v-else class="empty-state">
        <i class="bi bi-search"></i>
        <h3>No songs found</h3>
        <p>Coba cari judul lagu atau nama artist lain.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SongTile from '../components/SongTile.vue'
import { songs } from '../data/songs'
import {
  isLiked,
  likedSongs,
  playSong,
  player,
  searchResults,
  toggleLike
} from '../stores/player'

const filtered = searchResults

const trendingSongs = computed(() => {
  return songs
    .filter((song) => song.isTrending === true)
    .sort((a, b) => (a.trendingOrder || 999) - (b.trendingOrder || 999))
    .slice(0, 6)
})
</script>