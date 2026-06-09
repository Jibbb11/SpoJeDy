<template>
  <div class="content-scroll">
    <div class="profile-page">
      <div class="profile-hero">
        <img :src="profile.image" alt="profile" />

        <div>
          <span>PROFILE</span>
          <h1>{{ profile.username }}</h1>
          <p>Music lover • SpoJeDy listener</p>
        </div>
      </div>

      <div class="settings-grid profile-settings-only">
        <section class="settings-card">
          <h2>Edit Profile</h2>

          <label class="form-label">Username</label>
          <input
            v-model="username"
            class="form-control"
            type="text"
            placeholder="Masukkan username"
          />

          <label class="form-label mt-3">Upload profile image</label>
          <input
            type="file"
            accept="image/*"
            class="form-control"
            @change="handleImage"
          />

          <div v-if="loading" class="progress mt-3">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated bg-success"
              style="width: 100%"
            ></div>
          </div>

          <small class="d-block mt-3 text-muted-custom">
            Image akan dikompres otomatis dan disimpan di localStorage.
          </small>

          <button class="btn btn-success rounded-pill mt-4 px-4" @click="saveProfile">
            Save Profile
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { profile, updateUsername, updateProfileImage } from '../stores/profile'

const loading = ref(false)
const username = ref(profile.username)

function saveProfile() {
  const cleanUsername = username.value.trim()

  updateUsername(cleanUsername || 'najib')

  alert('Profile saved!')
}

function handleImage(event) {
  const file = event.target.files?.[0]
  if (!file) return

  loading.value = true

  const reader = new FileReader()

  reader.onload = (loadEvent) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 600
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1)

      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      let quality = 0.85
      let dataUrl = canvas.toDataURL('image/jpeg', quality)

      while (dataUrl.length > 1024 * 1024 * 1.35 && quality > 0.25) {
        quality -= 0.1
        dataUrl = canvas.toDataURL('image/jpeg', quality)
      }

      updateProfileImage(dataUrl)

      loading.value = false
    }

    img.onerror = () => {
      loading.value = false
      alert('Gagal membaca gambar.')
    }

    img.src = loadEvent.target.result
  }

  reader.onerror = () => {
    loading.value = false
    alert('Gagal membaca file.')
  }

  reader.readAsDataURL(file)
}
</script>