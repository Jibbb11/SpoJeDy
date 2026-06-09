import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import MusicVideoPage from '../views/MusicVideoPage.vue'
import VideoDetailPage from '../views/VideoDetailPage.vue'
import SongDetailPage from '../views/SongDetailPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import LikedSongsPage from '../views/LikedSongsPage.vue'
import PlaylistDetailPage from '../views/PlaylistDetailPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/videos',
    name: 'videos',
    component: MusicVideoPage
  },
  {
    path: '/videos/:id',
    name: 'video-detail',
    component: VideoDetailPage,
    props: true
  },
  {
    path: '/songs/:id',
    name: 'song-detail',
    component: SongDetailPage,
    props: true
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage
  },
  {
    path: '/liked-songs',
    name: 'liked-songs',
    component: LikedSongsPage
  },
  {
  path: '/playlists/:id',
  name: 'playlist-detail',
  component: PlaylistDetailPage,
  props: true
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})