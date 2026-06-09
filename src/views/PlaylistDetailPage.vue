<template>
  <div class="content-scroll liked-page">
    <section v-if="playlist" class="playlist-detail-page">
      <div class="liked-hero playlist-hero-green">
        <div class="liked-cover-large custom-cover-large">
          <i class="bi bi-music-note-list"></i>
        </div>

        <div class="liked-hero-info">
          <span>PLAYLIST</span>
          <h1>{{ playlist.name }}</h1>
          <p>
            {{ playlist.songIds.length }} song{{ playlist.songIds.length > 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <section class="liked-actions">
        <button
          class="liked-play-btn"
          type="button"
          :disabled="!playlistSongs.length"
          @click="playFirstSong"
        >
          <i class="bi bi-play-fill"></i>
        </button>

        <button
          class="mini-icon"
          type="button"
          :class="{ active: player.shuffle }"
          :disabled="playlistSongs.length <= 1"
          :title="playlistSongs.length > 1 ? 'Shuffle playlist' : 'Shuffle butuh minimal 2 lagu'"
          @click="togglePlaylistShuffle"
        >
          <i class="bi bi-shuffle"></i>
        </button>
      </section>

      <section v-if="playlistSongs.length" class="liked-table">
        <div class="liked-table-head">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Artist</span>
          <span></span>
        </div>

        <div
          v-for="(song, index) in playlistSongs"
          :key="song.id"
          class="liked-row"
          :class="{ 'song-is-playing': player.isVisible && currentSong?.id === song.id }"
        >
          <button class="liked-number" type="button" @click="playPlaylistSong(song.id)">
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
          <span class="liked-date">{{ song.artist }}</span>

          <div class="liked-duration">
            <button
              class="mini-icon"
              type="button"
              title="Remove from playlist"
              @click="removeSongFromPlaylist(playlist.id, song.id)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </section>

      <section v-else class="liked-empty-state">
        <i class="bi bi-music-note-list"></i>
        <h2>Playlist masih kosong</h2>
        <p>Putar lagu, lalu klik tombol plus di bottom player untuk menambahkan lagu ke playlist ini.</p>
      </section>
    </section>

    <section v-else class="liked-empty-state">
      <i class="bi bi-exclamation-circle"></i>
      <h2>Playlist tidak ditemukan</h2>

      <RouterLink to="/" class="btn btn-success rounded-pill px-4">
        Back to Home
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  currentSong,
  getPlaylist,
  getPlaylistSongs,
  playSong,
  player,
  removeSongFromPlaylist
} from '../stores/player'

const props = defineProps({
  id: String
})

const playlist = computed(() => {
  return getPlaylist(props.id)
})

const playlistSongs = computed(() => {
  return getPlaylistSongs(props.id)
})

const playlistQueueIds = computed(() => {
  return playlistSongs.value.map((song) => song.id)
})

function playPlaylistSong(songId) {
  playSong(songId, playlistQueueIds.value)
}

function playFirstSong() {
  if (!playlistSongs.value.length) return

  playSong(playlistSongs.value[0].id, playlistQueueIds.value)
}

function togglePlaylistShuffle() {
  if (playlistSongs.value.length <= 1) {
    player.shuffle = false
    return
  }

  player.shuffle = !player.shuffle
}
</script>