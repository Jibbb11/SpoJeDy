<template>
  <div class="content-scroll">
    <RouterLink to="/videos" class="back-link">
      <i class="bi bi-arrow-left"></i>
      Back to Videos
    </RouterLink>

    <div class="video-detail-layout">
      <div class="video-player-wrap">
        <video
          ref="videoRef"
          :poster="song.wideCover"
          :src="song.video"
          controls
          class="video-player"
          @play="pauseAudioForVideo"
        ></video>
        <div class="video-title-row">
          <div>
            <h1>{{ song.title }}</h1>
            <p>{{ song.artist }} • Official Video</p>
          </div>
          <RouterLink :to="`/songs/${song.id}`" class="btn-open-song">
            <i class="bi bi-music-note-beamed me-2"></i>Open Song Detail
          </RouterLink>
        </div>
      </div>

      <aside class="detail-side-card video-info-card">
        <img
          class="video-info-cover"
          :src="song.cover"
          :alt="song.title"
        />

        <h2>{{ song.title }}</h2>

        <p class="artist">{{ song.artist }}</p>

        <button
          class="switch-btn w-100 justify-content-center"
          type="button"
          @click="fullscreenVideo"
        >
          <i class="bi bi-fullscreen me-2"></i>
          Fullscreen Video
        </button>

        <button
          class="switch-btn w-100 justify-content-center mt-3"
          type="button"
          @click="switchToAudio"
        >
          <i class="bi bi-music-note-beamed me-2"></i>
          Switch to audio
        </button>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { songs } from '../data/songs'
import { playSong, pauseSong } from '../stores/player'

const props = defineProps({ id: String })
const videoRef = ref(null)
const song = computed(() => songs.find(item => item.id === Number(props.id)) || songs[0])

function pauseAudioForVideo() {
  pauseSong()
}

function switchToAudio() {
  if (videoRef.value) {
    videoRef.value.pause()
  }

  playSong(song.value.id)
}

function fullscreenVideo() {
  const el = videoRef.value
  if (!el) return
  if (el.requestFullscreen) el.requestFullscreen()
}
</script>
