<template>
  <div v-if="show" class="delete-modal-backdrop" @click.self="closeModal">
    <div class="delete-modal">
      <div class="delete-modal-icon">
        <i class="bi bi-trash"></i>
      </div>

      <h2>Delete Playlist?</h2>

      <p>
        Playlist <strong>{{ playlistName }}</strong> akan dihapus dari library kamu.
      </p>

      <div class="delete-modal-actions">
        <button class="delete-modal-cancel" type="button" @click="closeModal">
          Cancel
        </button>

        <button class="delete-modal-confirm" type="button" @click="confirmDelete">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  playlistName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'confirm'])

function closeModal() {
  emit('close')
}

function confirmDelete() {
  emit('confirm')
}
</script>