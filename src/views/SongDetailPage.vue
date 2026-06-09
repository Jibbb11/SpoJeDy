<template>
  <div class="content-scroll">
    <RouterLink to="/" class="back-link">
      <i class="bi bi-arrow-left"></i>
      Back to Home
    </RouterLink>

    <section v-if="song" class="song-detail-spotify">
      <img
        :src="song.cover"
        :alt="song.title"
        class="detail-cover"
        @click="showImageFullscreen = true"
      />

      <div class="detail-info">
        <span>SONG</span>
        <h1>{{ song.title }}</h1>
        <p>{{ song.artist }}</p>

        <div class="d-flex gap-3 align-items-center flex-wrap">
          <button
            class="big-play"
            type="button"
            title="Play song"
            @click="playSong(song.id)"
          >
            <i class="bi bi-play-fill"></i>
          </button>

          <RouterLink
            v-if="song.video"
            :to="`/videos/${song.id}`"
            class="btn-open-song"
          >
            <i class="bi bi-collection-play-fill me-2"></i>
            Watch Video
          </RouterLink>

          <div class="song-detail-playlist-wrapper">
            <button
              class="circle-outline"
              type="button"
              title="Add to playlist"
              aria-label="Add to playlist"
              @click="showPlaylistMenu = !showPlaylistMenu"
            >
              <i class="bi bi-plus-lg"></i>
            </button>

            <div v-if="showPlaylistMenu" class="playlist-dropdown song-detail-dropdown">
              <button
                class="playlist-dropdown-create"
                type="button"
                @click="handleOpenCreatePlaylist"
              >
                <span>Create new playlist</span>
                <i class="bi bi-plus-lg"></i>
              </button>

              <div v-if="player.customPlaylists.length" class="playlist-dropdown-list">
                <button
                  v-for="playlist in player.customPlaylists"
                  :key="playlist.id"
                  type="button"
                  @click="handleTogglePlaylist(playlist.id)"
                >
                  <span>{{ playlist.name }}</span>

                  <i
                    :class="
                      isSongInPlaylist(playlist.id, song.id)
                        ? 'bi bi-check-circle-fill text-success'
                        : 'bi bi-plus-circle'
                    "
                  ></i>
                </button>
              </div>

              <small v-else>Belum ada playlist.</small>
            </div>
          </div>
        </div>

        <p v-if="song.description" class="description mt-4">
          {{ song.description }}
        </p>
      </div>
    </section>

    <section v-else class="empty-state">
      <i class="bi bi-exclamation-circle"></i>
      <h3>Song not found</h3>
      <p>Lagu tidak ditemukan.</p>
    </section>

    <div
      v-if="showImageFullscreen && song"
      class="image-fullscreen"
      @click.self="showImageFullscreen = false"
    >
      <button class="close-full" type="button" @click="showImageFullscreen = false">
        <i class="bi bi-x-lg"></i>
      </button>

      <img :src="song.cover" :alt="song.title" />
    </div>

    <CreatePlaylistModal
      :show="showCreatePlaylistModal"
      @close="showCreatePlaylistModal = false"
      @create="handleCreatePlaylistSubmit"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import CreatePlaylistModal from '../components/CreatePlaylistModal.vue'
import { songs } from '../data/songs'
import {
  createPlaylist,
  isSongInPlaylist,
  playSong,
  player,
  toggleSongInPlaylist
} from '../stores/player'

const props = defineProps({
  id: String
})

const showImageFullscreen = ref(false)
const showPlaylistMenu = ref(false)
const showCreatePlaylistModal = ref(false)

const song = computed(() => {
  return songs.find((item) => item.id === Number(props.id))
})

function handleOpenCreatePlaylist() {
  showPlaylistMenu.value = false
  showCreatePlaylistModal.value = true
}

function handleCreatePlaylistSubmit(name) {
  createPlaylist(name)
  showCreatePlaylistModal.value = false
}

function handleTogglePlaylist(playlistId) {
  if (!song.value?.id) return

  toggleSongInPlaylist(playlistId, song.value.id)
}
</script>