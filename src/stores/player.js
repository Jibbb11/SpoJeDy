import { computed, reactive } from 'vue'
import { songs } from '../data/songs'

function readArrayFromStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const savedLibrary = readArrayFromStorage('spojedy-library')
const savedLiked = readArrayFromStorage('spojedy-liked')
const savedRecent = readArrayFromStorage('spojedy-recent')
const savedCustomPlaylists = readArrayFromStorage('spojedy-custom-playlists')
const savedVolume = Number(localStorage.getItem('spojedy-volume') || 0.75)

const normalizedPlaylists = savedCustomPlaylists.map((playlist) => ({
  ...playlist,
  songIds: Array.isArray(playlist.songIds) ? playlist.songIds : []
}))

export const player = reactive({
  currentIndex: null,
  isVisible: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: Number.isFinite(savedVolume) ? savedVolume : 0.75,
  query: '',
  shuffle: false,
  repeat: false,

  // single = lagu dari Home/Search/New Releases/Detail
  // playlist = lagu dari Liked Songs atau custom playlist
  queueSource: 'single',
  queueIds: [],

  // queue manual dari tombol Add to queue
  manualQueueIds: [],

  libraryIds: savedLibrary,
  likedIds: savedLiked,
  recentIds: savedRecent,
  customPlaylists: normalizedPlaylists
})

export const currentSong = computed(() => {
  if (player.currentIndex === null) return songs[0]
  return songs[player.currentIndex] || songs[0]
})

export const currentQueueSongs = computed(() => {
  return player.queueIds
    .map((id) => songs.find((song) => song.id === Number(id)))
    .filter(Boolean)
})

export const manualQueueSongs = computed(() => {
  return player.manualQueueIds
    .map((id) => songs.find((song) => song.id === Number(id)))
    .filter(Boolean)
})

export const canShuffle = computed(() => {
  return player.queueSource === 'playlist' && currentQueueSongs.value.length > 1
})

export const searchResults = computed(() => {
  const keyword = player.query.trim().toLowerCase()

  if (!keyword) return songs

  return songs.filter((song) => {
    return (
      song.title.toLowerCase().includes(keyword) ||
      song.artist.toLowerCase().includes(keyword) ||
      song.album.toLowerCase().includes(keyword)
    )
  })
})

export const librarySongs = computed(() => {
  return player.libraryIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean)
})

export const likedSongs = computed(() => {
  return player.likedIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean)
})

export const recentSongs = computed(() => {
  return player.recentIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean)
})

function saveLibrary() {
  localStorage.setItem('spojedy-library', JSON.stringify(player.libraryIds))
}

function saveLiked() {
  localStorage.setItem('spojedy-liked', JSON.stringify(player.likedIds))
}

function saveRecent() {
  localStorage.setItem('spojedy-recent', JSON.stringify(player.recentIds))
}

function saveCustomPlaylists() {
  localStorage.setItem(
    'spojedy-custom-playlists',
    JSON.stringify(player.customPlaylists)
  )
}

function findIndex(songId) {
  const index = songs.findIndex((song) => song.id === Number(songId))
  return index >= 0 ? index : 0
}

function normalizeQueue(songId, queueIds) {
  const mainId = Number(songId)

  if (!Array.isArray(queueIds) || !queueIds.length) {
    return [mainId]
  }

  const validIds = queueIds
    .map((id) => Number(id))
    .filter((id) => songs.some((song) => song.id === id))

  const uniqueIds = [...new Set(validIds)]

  if (!uniqueIds.includes(mainId)) {
    uniqueIds.unshift(mainId)
  }

  return uniqueIds.length ? uniqueIds : [mainId]
}

function setupQueue(songId, queueIds = null) {
  const isPlaylistQueue = Array.isArray(queueIds) && queueIds.length > 0

  player.queueIds = normalizeQueue(songId, queueIds)
  player.queueSource = isPlaylistQueue ? 'playlist' : 'single'

  if (!canShuffle.value) {
    player.shuffle = false
  }
}

function moveToSong(songId) {
  player.currentIndex = findIndex(songId)
  player.currentTime = 0
  player.duration = 0
  player.isVisible = true
  player.isPlaying = true
  addToRecent(songId)
}

export function addToRecent(songId) {
  const id = Number(songId)

  if (!id) return

  player.recentIds = player.recentIds.filter((item) => item !== id)
  player.recentIds.unshift(id)

  if (player.recentIds.length > 8) {
    player.recentIds = player.recentIds.slice(0, 8)
  }

  saveRecent()
}

export function selectSong(songId, autoplay = false, queueIds = null) {
  setupQueue(songId, queueIds)

  player.currentIndex = findIndex(songId)
  player.isVisible = true
  player.currentTime = 0
  player.duration = 0
  player.isPlaying = autoplay

  if (autoplay) {
    addToRecent(songId)
  }
}

export function playSong(songId, queueIds = null) {
  selectSong(songId, true, queueIds)
}

export function pauseSong() {
  player.isPlaying = false
}

export function toggleCurrentSong(songId, queueIds = null) {
  const index = findIndex(songId)

  if (player.currentIndex !== index || !player.isVisible) {
    selectSong(songId, true, queueIds)
    return
  }

  player.isPlaying = !player.isPlaying

  if (player.isPlaying) {
    addToRecent(songId)
  }
}

export function toggleShuffle() {
  player.shuffle = !player.shuffle
}

export function toggleRepeat() {
  player.repeat = !player.repeat
}

export function addSongToQueue(songId) {
  const id = Number(songId)

  if (!id) return 'invalid'

  const exists = songs.some((song) => song.id === id)
  if (!exists) return 'invalid'

  if (player.manualQueueIds.includes(id)) {
    return 'exists'
  }

  player.manualQueueIds.push(id)
  return 'added'
}

export function removeSongFromQueue(songId) {
  const id = Number(songId)

  player.manualQueueIds = player.manualQueueIds.filter((item) => {
    return item !== id
  })
}

export function clearManualQueue() {
  player.manualQueueIds = []
}

export function nextSong() {
  if (!player.repeat && player.manualQueueIds.length) {
    const nextQueueId = player.manualQueueIds.shift()
    moveToSong(nextQueueId)
    return
  }

  const queue = currentQueueSongs.value

  if (!queue.length) return

  if (queue.length === 1) {
    moveToSong(queue[0].id)
    return
  }

  const currentId = currentSong.value?.id
  const currentQueueIndex = queue.findIndex((song) => song.id === currentId)

  let nextIndex = currentQueueIndex >= 0 ? currentQueueIndex + 1 : 0

  if (player.shuffle && canShuffle.value) {
    let randomIndex = currentQueueIndex

    while (randomIndex === currentQueueIndex) {
      randomIndex = Math.floor(Math.random() * queue.length)
    }

    nextIndex = randomIndex
  } else {
    nextIndex = nextIndex % queue.length
  }

  moveToSong(queue[nextIndex].id)
}

export function previousSong() {
  const queue = currentQueueSongs.value

  if (!queue.length) return

  if (queue.length === 1) {
    moveToSong(queue[0].id)
    return
  }

  const currentId = currentSong.value?.id
  const currentQueueIndex = queue.findIndex((song) => song.id === currentId)

  let previousIndex = currentQueueIndex >= 0 ? currentQueueIndex - 1 : 0

  if (previousIndex < 0) {
    previousIndex = queue.length - 1
  }

  moveToSong(queue[previousIndex].id)
}

export function toggleLike(songId) {
  const id = Number(songId)

  if (!id) return

  if (player.likedIds.includes(id)) {
    player.likedIds = player.likedIds.filter((item) => item !== id)
  } else {
    player.likedIds.push(id)
  }

  saveLiked()
}

export function toggleCurrentLike() {
  if (!player.isVisible || player.currentIndex === null) return

  const song = currentSong.value
  if (!song?.id) return

  toggleLike(song.id)
}

export function isLiked(songId) {
  return player.likedIds.includes(Number(songId))
}

export function addToLibrary(songId) {
  const id = Number(songId)

  if (!id) return

  if (!player.libraryIds.includes(id)) {
    player.libraryIds.push(id)
    saveLibrary()
  }
}

export function removeFromLibrary(songId) {
  const id = Number(songId)

  player.libraryIds = player.libraryIds.filter((item) => item !== id)
  saveLibrary()
}

export function isInLibrary(songId) {
  return player.libraryIds.includes(Number(songId))
}

export function toggleLibrary(songId) {
  if (isInLibrary(songId)) {
    removeFromLibrary(songId)
  } else {
    addToLibrary(songId)
  }
}

export function createPlaylist(name) {
  const cleanName = name?.trim()

  if (!cleanName) return

  player.customPlaylists.push({
    id: Date.now(),
    name: cleanName,
    songIds: []
  })

  saveCustomPlaylists()
}

export function deletePlaylist(playlistId) {
  const id = Number(playlistId)

  player.customPlaylists = player.customPlaylists.filter((playlist) => {
    return playlist.id !== id
  })

  saveCustomPlaylists()
}

export function getPlaylist(playlistId) {
  const id = Number(playlistId)

  return player.customPlaylists.find((playlist) => {
    return playlist.id === id
  })
}

export function getPlaylistSongs(playlistId) {
  const playlist = getPlaylist(playlistId)

  if (!playlist) return []

  return playlist.songIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean)
}

export function isSongInPlaylist(playlistId, songId) {
  const playlist = getPlaylist(playlistId)

  if (!playlist) return false

  return playlist.songIds.includes(Number(songId))
}

export function addSongToPlaylist(playlistId, songId) {
  const playlist = getPlaylist(playlistId)
  const id = Number(songId)

  if (!playlist || !id) return

  if (!playlist.songIds.includes(id)) {
    playlist.songIds.push(id)
    saveCustomPlaylists()
  }
}

export function removeSongFromPlaylist(playlistId, songId) {
  const playlist = getPlaylist(playlistId)
  const id = Number(songId)

  if (!playlist) return

  playlist.songIds = playlist.songIds.filter((songIdItem) => {
    return songIdItem !== id
  })

  saveCustomPlaylists()
}

export function toggleSongInPlaylist(playlistId, songId) {
  if (isSongInPlaylist(playlistId, songId)) {
    removeSongFromPlaylist(playlistId, songId)
  } else {
    addSongToPlaylist(playlistId, songId)
  }
}

export function setVolume(value) {
  const numberValue = Number(value)

  player.volume = Number.isFinite(numberValue) ? numberValue : 0.75
  localStorage.setItem('spojedy-volume', String(player.volume))
}

export function formatTime(value) {
  if (!value || Number.isNaN(value)) return '0:00'

  const mins = Math.floor(value / 60)
  const secs = Math.floor(value % 60).toString().padStart(2, '0')

  return `${mins}:${secs}`
}