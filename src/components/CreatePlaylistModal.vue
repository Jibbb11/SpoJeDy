<template>
  <div v-if="show" class="playlist-modal-backdrop" @click.self="closeModal">
    <div class="playlist-modal">
      <div class="playlist-modal-header">
        <div>
          <small>NEW PLAYLIST</small>
          <h2>Create Playlist</h2>
        </div>

        <button class="playlist-modal-close" type="button" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <label class="playlist-modal-label">Playlist name</label>

      <input
        ref="inputRef"
        v-model="playlistName"
        class="playlist-modal-input"
        type="text"
        placeholder="Contoh: Chill Night"
        @keyup.enter="submitPlaylist"
      />

      <p v-if="errorMessage" class="playlist-modal-error">
        {{ errorMessage }}
      </p>

      <div class="playlist-modal-actions">
        <button class="playlist-modal-cancel" type="button" @click="closeModal">
          Cancel
        </button>

        <button class="playlist-modal-create" type="button" @click="submitPlaylist">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'create'])

const playlistName = ref('')
const errorMessage = ref('')
const inputRef = ref(null)

watch(
  () => props.show,
  async (value) => {
    if (value) {
      playlistName.value = ''
      errorMessage.value = ''

      await nextTick()
      inputRef.value?.focus()
    }
  }
)

function closeModal() {
  playlistName.value = ''
  errorMessage.value = ''
  emit('close')
}

function submitPlaylist() {
  const cleanName = playlistName.value.trim()

  if (!cleanName) {
    errorMessage.value = 'Nama playlist tidak boleh kosong.'
    return
  }

  emit('create', cleanName)
  closeModal()
}
</script>