<template>
  <div :class="['spotify-layout', { 'player-hidden': !player.isVisible }]">
    <aside class="left-sidebar">
      <div class="sidebar-logo">
        <div class="spotify-logo">
          <i class="bi bi-music-note-beamed"></i>
        </div>
        <span>SpoJeDy</span>
      </div>

      <nav class="sidebar-menu">
        <RouterLink to="/" class="sidebar-link" active-class="active">
          <i class="bi bi-house-door-fill"></i>
          <span>Home</span>
        </RouterLink>

        <RouterLink to="/videos" class="sidebar-link" active-class="active">
          <i class="bi bi-collection-play-fill"></i>
          <span>Video</span>
        </RouterLink>

        <RouterLink to="/profile" class="sidebar-link" active-class="active">
          <i class="bi bi-person-fill"></i>
          <span>Profile</span>
        </RouterLink>
      </nav>

      <div class="library-head">
        <h2>Your Library</h2>

        <button
          class="btn btn-dark btn-sm rounded-pill"
          type="button"
          @click="handleOpenCreatePlaylist"
        >
          <i class="bi bi-plus-lg me-1"></i>
          Create
        </button>
      </div>

      <div class="library-filters">
        <button type="button">Playlists</button>
      </div>

      <div class="library-list">
        <RouterLink to="/liked-songs" class="library-playlist-title">
          <div class="liked-playlist-icon">
            <i class="bi bi-heart-fill"></i>
          </div>

          <div>
            <strong>Liked Songs</strong>
            <small>
              {{ likedSongs.length }} song{{ likedSongs.length > 1 ? 's' : '' }}
            </small>
          </div>
        </RouterLink>

        <div
          v-for="playlist in player.customPlaylists"
          :key="playlist.id"
          class="library-playlist-title custom-playlist-card"
        >
          <RouterLink
            :to="`/playlists/${playlist.id}`"
            class="playlist-link-area"
          >
            <div class="custom-playlist-icon">
              <i class="bi bi-music-note-list"></i>
            </div>

            <div>
              <strong>{{ playlist.name }}</strong>
              <small>
                {{ playlist.songIds?.length || 0 }}
                song{{ (playlist.songIds?.length || 0) > 1 ? 's' : '' }}
              </small>
            </div>
          </RouterLink>

          <button
            class="delete-playlist-btn"
            type="button"
            title="Delete playlist"
            @click.stop.prevent="openDeleteModal(playlist)"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </aside>

    <main class="main-panel">
      <TopBar />
      <RouterView />
    </main>

    <aside class="right-sidebar">
      <NowPlayingPanel />
    </aside>

    <BottomPlayer />

    <CreatePlaylistModal
      :show="showCreatePlaylistModal"
      @close="showCreatePlaylistModal = false"
      @create="handleCreatePlaylistSubmit"
    />

    <DeletePlaylistModal
      :show="showDeletePlaylistModal"
      :playlist-name="playlistToDelete?.name || ''"
      @close="closeDeleteModal"
      @confirm="confirmDeletePlaylist"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import TopBar from './TopBar.vue'
import NowPlayingPanel from './NowPlayingPanel.vue'
import BottomPlayer from './BottomPlayer.vue'
import CreatePlaylistModal from './CreatePlaylistModal.vue'
import DeletePlaylistModal from './DeletePlaylistModal.vue'
import {
  createPlaylist,
  deletePlaylist,
  likedSongs,
  player
} from '../stores/player'

const showCreatePlaylistModal = ref(false)
const showDeletePlaylistModal = ref(false)
const playlistToDelete = ref(null)

function handleOpenCreatePlaylist() {
  showCreatePlaylistModal.value = true
}

function handleCreatePlaylistSubmit(name) {
  createPlaylist(name)
}

function openDeleteModal(playlist) {
  playlistToDelete.value = playlist
  showDeletePlaylistModal.value = true
}

function closeDeleteModal() {
  playlistToDelete.value = null
  showDeletePlaylistModal.value = false
}

function confirmDeletePlaylist() {
  if (!playlistToDelete.value) return

  deletePlaylist(playlistToDelete.value.id)
  closeDeleteModal()
}
</script>