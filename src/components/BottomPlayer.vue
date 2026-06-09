<template>
  <footer v-if="player.isVisible" class="bottom-player">
    <div class="track-meta">
      <img :src="song.cover" :alt="song.title" />

      <div class="track-text">
        <strong>{{ song.title }}</strong>
        <small>{{ song.artist }}</small>
      </div>

      <button
        class="mini-icon"
        type="button"
        :class="{ active: isLiked(song.id) }"
        :title="isLiked(song.id) ? 'Unlike song' : 'Like song'"
        aria-label="Like song"
        @click="toggleLike(song.id)"
      >
        <i :class="isLiked(song.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      </button>

      <div class="playlist-dropdown-wrapper">
        <button
          class="mini-icon"
          type="button"
          title="Add to playlist"
          aria-label="Add to playlist"
          @click="showPlaylistMenu = !showPlaylistMenu"
        >
          <i class="bi bi-plus-circle"></i>
        </button>

        <div v-if="showPlaylistMenu" class="playlist-dropdown">
          <button
            class="playlist-dropdown-create"
            type="button"
            @click="handleOpenCreatePlaylist"
          >
            <i class="bi bi-plus-lg"></i>
            Create new playlist
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

    <div class="player-center">
      <div class="player-controls">
        <button
          class="mini-icon player-toggle-btn"
          type="button"
          :class="{ active: player.shuffle, unavailable: !canShuffle }"
          :title="canShuffle ? 'Shuffle playlist' : 'Shuffle akan aktif penuh saat playlist berisi lebih dari 1 lagu'"
          aria-label="Shuffle"
          @click.stop="toggleShuffle"
        >
          <i class="bi bi-shuffle"></i>
          <span class="control-dot"></span>
        </button>

        <button
          class="mini-icon"
          type="button"
          aria-label="Previous song"
          @click="previousSong"
        >
          <i class="bi bi-skip-start-fill"></i>
        </button>

        <button
          class="play-main"
          type="button"
          aria-label="Play or pause"
          @click="toggle"
        >
          <i :class="player.isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
        </button>

        <button
          class="mini-icon"
          type="button"
          aria-label="Next song"
          @click="nextSong"
        >
          <i class="bi bi-skip-end-fill"></i>
        </button>

        <button
          class="mini-icon player-toggle-btn"
          type="button"
          :class="{ active: player.repeat }"
          :title="player.repeat ? 'Repeat on' : 'Repeat off'"
          aria-label="Repeat"
          @click.stop="toggleRepeat"
        >
          <i class="bi bi-repeat"></i>
          <span class="control-dot"></span>
        </button>
      </div>

      <div class="progress-row">
        <span>{{ formatTime(player.currentTime) }}</span>

        <input
          v-model="player.currentTime"
          class="range-control"
          type="range"
          min="0"
          :max="player.duration || 0"
          step="1"
          :style="progressStyle"
          aria-label="Song progress"
          @input="seek"
        />

        <span>{{ formatTime(player.duration) }}</span>
      </div>
    </div>

    <div class="player-extra">
      <button
        class="mini-icon"
        type="button"
        :class="{ active: showQueuePanel }"
        aria-label="Queue"
        title="Queue"
        @click="showQueuePanel = !showQueuePanel"
      >
        <i class="bi bi-list-ul"></i>
      </button>

      <i class="bi bi-volume-up"></i>

      <input
        v-model="player.volume"
        class="range-control volume-range"
        type="range"
        min="0"
        max="1"
        step="0.01"
        :style="volumeStyle"
        aria-label="Volume"
        @input="updateVolume"
      />

      <button
        class="mini-icon fullscreen-player-btn"
        type="button"
        title="Fullscreen player"
        aria-label="Fullscreen player"
        @click="openPlayerFullscreen"
      >
        <i class="bi bi-arrows-fullscreen"></i>
      </button>
    </div>

    <audio
      ref="audioRef"
      :src="song.audio"
      @loadedmetadata="onLoaded"
      @timeupdate="onTimeUpdate"
      @ended="handleEnded"
    ></audio>

    <Teleport to="body">
      <aside v-if="showQueuePanel" class="queue-panel">
        <div class="queue-panel-head">
          <div>
            <strong>Queue</strong>
            <small>
              {{ queueItems.length ? 'Next songs' : 'No songs in queue' }}
            </small>
          </div>

          <button
            class="mini-icon"
            type="button"
            aria-label="Close queue"
            @click="showQueuePanel = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div v-if="queueItems.length" class="queue-list">
          <button
            v-for="item in queueItems"
            :key="item.id"
            class="queue-item"
            type="button"
            @click="playQueuedSong(item)"
          >
            <img :src="item.cover" :alt="item.title" />

            <div>
              <strong>{{ item.title }}</strong>
              <small>{{ item.artist }}</small>
            </div>

            <button
              v-if="player.manualQueueIds?.includes(item.id)"
              class="queue-remove-btn"
              type="button"
              title="Remove from queue"
              @click.stop="removeSongFromQueue(item.id)"
            >
              <i class="bi bi-x-lg"></i>
            </button>

            <i v-else class="bi bi-play-fill"></i>
          </button>
        </div>

        <div v-else class="queue-empty">
          <i class="bi bi-list-ul"></i>
          <strong>Queue kosong</strong>
          <small>
            Queue otomatis muncul dari playlist, atau tambahkan lagu manual ke queue.
          </small>
        </div>
      </aside>
    </Teleport>

    <Teleport to="body">
      <section
        v-if="isPlayerFullscreen"
        ref="fullscreenRef"
        class="player-fullscreen"
      >
        <div class="player-fullscreen-top">
          <strong>{{ song.artist }}</strong>

          <button
            class="fullscreen-close-btn"
            type="button"
            title="Exit fullscreen"
            aria-label="Exit fullscreen"
            @click="closePlayerFullscreen"
          >
            <i class="bi bi-fullscreen-exit"></i>
          </button>
        </div>

        <div class="player-fullscreen-content cover-only">
          <img :src="song.cover" :alt="song.title" />
        </div>

        <div class="player-fullscreen-bottom">
          <div class="track-meta fullscreen-track-meta">
            <img :src="song.cover" :alt="song.title" />

            <div class="track-text">
              <strong>{{ song.title }}</strong>
              <small>{{ song.artist }}</small>
            </div>

            <button
              class="mini-icon"
              type="button"
              :class="{ active: isLiked(song.id) }"
              :title="isLiked(song.id) ? 'Unlike song' : 'Like song'"
              aria-label="Like song"
              @click="toggleLike(song.id)"
            >
              <i :class="isLiked(song.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
          </div>

          <div class="player-fullscreen-controls">
            <div class="player-controls">
              <button
                class="mini-icon player-toggle-btn"
                type="button"
                :class="{ active: player.shuffle, unavailable: !canShuffle }"
                aria-label="Shuffle"
                @click.stop="toggleShuffle"
              >
                <i class="bi bi-shuffle"></i>
                <span class="control-dot"></span>
              </button>

              <button
                class="mini-icon"
                type="button"
                aria-label="Previous song"
                @click="previousSong"
              >
                <i class="bi bi-skip-start-fill"></i>
              </button>

              <button
                class="play-main"
                type="button"
                aria-label="Play or pause"
                @click="toggle"
              >
                <i :class="player.isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
              </button>

              <button
                class="mini-icon"
                type="button"
                aria-label="Next song"
                @click="nextSong"
              >
                <i class="bi bi-skip-end-fill"></i>
              </button>

              <button
                class="mini-icon player-toggle-btn"
                type="button"
                :class="{ active: player.repeat }"
                aria-label="Repeat"
                @click.stop="toggleRepeat"
              >
                <i class="bi bi-repeat"></i>
                <span class="control-dot"></span>
              </button>
            </div>

            <div class="progress-row fullscreen-progress">
              <span>{{ formatTime(player.currentTime) }}</span>

              <input
                v-model="player.currentTime"
                class="range-control"
                type="range"
                min="0"
                :max="player.duration || 0"
                step="1"
                :style="progressStyle"
                aria-label="Song progress fullscreen"
                @input="seek"
              />

              <span>{{ formatTime(player.duration) }}</span>
            </div>
          </div>

          <div class="player-fullscreen-extra">
            <i class="bi bi-volume-up"></i>

            <input
              v-model="player.volume"
              class="range-control volume-range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              :style="volumeStyle"
              aria-label="Volume fullscreen"
              @input="updateVolume"
            />

            <button
              class="mini-icon"
              type="button"
              title="Exit fullscreen"
              aria-label="Exit fullscreen"
              @click="closePlayerFullscreen"
            >
              <i class="bi bi-fullscreen-exit"></i>
            </button>
          </div>
        </div>
      </section>
    </Teleport>

    <CreatePlaylistModal
      :show="showCreatePlaylistModal"
      @close="showCreatePlaylistModal = false"
      @create="handleCreatePlaylistSubmit"
    />
  </footer>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CreatePlaylistModal from './CreatePlaylistModal.vue'
import {
  canShuffle,
  currentQueueSongs,
  currentSong,
  createPlaylist,
  formatTime,
  isLiked,
  isSongInPlaylist,
  manualQueueSongs,
  nextSong,
  playSong,
  player,
  previousSong,
  removeSongFromQueue,
  setVolume,
  toggleLike,
  toggleRepeat,
  toggleShuffle,
  toggleSongInPlaylist
} from '../stores/player'

const audioRef = ref(null)
const song = currentSong

const showPlaylistMenu = ref(false)
const showCreatePlaylistModal = ref(false)
const showQueuePanel = ref(false)

const isPlayerFullscreen = ref(false)
const fullscreenRef = ref(null)

const progressStyle = computed(() => {
  const percent = player.duration
    ? (player.currentTime / player.duration) * 100
    : 0

  return {
    '--range-progress': `${Math.min(100, Math.max(0, percent))}%`
  }
})

const volumeStyle = computed(() => {
  return {
    '--range-progress': `${Math.round(player.volume * 100)}%`
  }
})

const playlistNextSongs = computed(() => {
  if (player.queueSource !== 'playlist') return []
  if (player.repeat) return []

  const queue = currentQueueSongs.value

  if (!queue.length || queue.length === 1) return []

  const currentId = song.value?.id
  const currentIndex = queue.findIndex((item) => item.id === currentId)

  if (currentIndex < 0) return []

  return queue.slice(currentIndex + 1)
})

const queueItems = computed(() => {
  if (player.repeat) return []

  const manualIds = player.manualQueueIds || []

  return [
    ...manualQueueSongs.value,
    ...playlistNextSongs.value.filter((playlistSong) => {
      return !manualIds.includes(playlistSong.id)
    })
  ]
})

function handleOpenCreatePlaylist() {
  showPlaylistMenu.value = false
  showCreatePlaylistModal.value = true
}

function handleCreatePlaylistSubmit(name) {
  createPlaylist(name)
  showPlaylistMenu.value = false
  showCreatePlaylistModal.value = false
}

function handleTogglePlaylist(playlistId) {
  toggleSongInPlaylist(playlistId, song.value.id)
}

function onLoaded() {
  player.duration = audioRef.value?.duration || 0

  if (audioRef.value) {
    audioRef.value.volume = player.volume
  }
}

function onTimeUpdate() {
  player.currentTime = audioRef.value?.currentTime || 0
}

function seek() {
  if (audioRef.value) {
    audioRef.value.currentTime = player.currentTime
  }
}

function updateVolume() {
  setVolume(player.volume)

  if (audioRef.value) {
    audioRef.value.volume = player.volume
  }
}

async function safePlay() {
  try {
    if (!audioRef.value) return

    audioRef.value.volume = player.volume
    await audioRef.value.play()

    player.isPlaying = true
  } catch (error) {
    player.isPlaying = false
  }
}

function toggle() {
  if (!audioRef.value) return

  if (player.isPlaying) {
    audioRef.value.pause()
    player.isPlaying = false
  } else {
    safePlay()
  }
}

function replayCurrentSong() {
  player.currentTime = 0

  if (audioRef.value) {
    audioRef.value.currentTime = 0
  }

  safePlay()
}

function handleEnded() {
  const hasManualQueue = (player.manualQueueIds || []).length > 0
  const hasPlaylistQueue =
    player.queueSource === 'playlist' && player.queueIds.length > 1

  if (player.repeat) {
    replayCurrentSong()
    return
  }

  if (hasManualQueue || hasPlaylistQueue) {
    nextSong()
    return
  }

  replayCurrentSong()
}

function playQueuedSong(item) {
  const songId = item.id

  if ((player.manualQueueIds || []).includes(songId)) {
    removeSongFromQueue(songId)
  }

  if (player.queueSource === 'playlist' && player.queueIds.includes(songId)) {
    playSong(songId, player.queueIds)
  } else {
    playSong(songId)
  }

  showQueuePanel.value = false
}

async function openPlayerFullscreen() {
  isPlayerFullscreen.value = true

  await nextTick()

  const el = fullscreenRef.value

  if (el?.requestFullscreen) {
    try {
      await el.requestFullscreen()
    } catch (error) {
      // Kalau browser menolak fullscreen, overlay tetap muncul.
    }
  }
}

async function closePlayerFullscreen() {
  isPlayerFullscreen.value = false

  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen()
    } catch (error) {
      // Abaikan kalau browser tidak bisa keluar fullscreen.
    }
  }
}

function handleFullscreenChange() {
  if (!document.fullscreenElement) {
    isPlayerFullscreen.value = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

watch(
  () => player.isVisible,
  async (visible) => {
    if (!visible) return

    await nextTick()

    if (audioRef.value) {
      audioRef.value.volume = player.volume

      if (player.isPlaying) {
        safePlay()
      }
    }
  }
)

watch(
  () => song.value?.id,
  async () => {
    player.currentTime = 0
    player.duration = 0

    await nextTick()

    if (audioRef.value) {
      audioRef.value.load()
      audioRef.value.volume = player.volume
    }

    if (player.isPlaying) {
      safePlay()
    }
  }
)

watch(
  () => player.isPlaying,
  async (playing) => {
    if (!audioRef.value) return

    if (playing) {
      await safePlay()
    } else {
      audioRef.value.pause()
    }
  }
)
</script>