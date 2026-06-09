<template>
  <div class="song-tile-wrapper">
    <RouterLink :to="to" class="song-tile song-tile-link">
      <img :src="song.cover" :alt="song.title" />

      <div class="tile-title">{{ song.title }}</div>
      <small>{{ song.artist }}</small>
    </RouterLink>

    <div class="song-tile-actions">
      <button
        class="song-tile-play"
        type="button"
        title="Play song"
        @mousedown.stop.prevent
        @click.stop.prevent="playSong(song.id)"
      >
        <i class="bi bi-play-fill"></i>
      </button>

      <button
        class="song-tile-queue"
        type="button"
        title="Add to queue"
        @mousedown.stop.prevent
        @click.stop.prevent="handleAddToQueue"
      >
        <i class="bi bi-list-ul"></i>
        <span class="queue-plus-dot">
          <i class="bi bi-plus-lg"></i>
        </span>
      </button>
    </div>

    <div v-if="feedbackMessage" class="song-tile-feedback">
      {{ feedbackMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { addSongToQueue, playSong, player } from '../stores/player'

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  to: {
    type: String,
    required: true
  }
})

const feedbackMessage = ref('')

function handleAddToQueue() {
  if (!player.isVisible) {
    feedbackMessage.value = 'Putar lagu dulu'
  } else {
    const result = addSongToQueue(props.song.id)

    feedbackMessage.value =
      result === 'exists'
        ? 'Already in queue'
        : 'Added to queue'
  }

  setTimeout(() => {
    feedbackMessage.value = ''
  }, 1600)
}
</script>