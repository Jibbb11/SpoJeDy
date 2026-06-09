import { reactive } from 'vue'

const savedProfile = JSON.parse(localStorage.getItem('spojedy-profile') || '{}')

export const profile = reactive({
  username: savedProfile.username || 'najib',
  image:
    savedProfile.image ||
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
})

export function saveProfileData() {
  localStorage.setItem(
    'spojedy-profile',
    JSON.stringify({
      username: profile.username,
      image: profile.image
    })
  )
}

export function updateUsername(username) {
  profile.username = username
  saveProfileData()
}

export function updateProfileImage(image) {
  profile.image = image
  saveProfileData()
}