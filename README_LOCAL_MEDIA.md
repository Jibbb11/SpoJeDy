# SpoJeDy - Local Media Version

Versi ini sudah diatur untuk memakai file lokal langsung dari folder `public/media`.

## Jalankan project

```bash
npm install
npm run dev
```

## Tempat menaruh file

```txt
public/media/covers/  -> file cover .jpg / .png / .webp
public/media/audio/   -> file audio .mp3
public/media/videos/  -> file video .mp4
```

## Nama file default

Data di `src/data/songs.js` sudah memakai nama default:

```txt
public/media/covers/song-1.jpg
public/media/audio/song-1.mp3
public/media/videos/song-1.mp4
```

sampai:

```txt
public/media/covers/song-5.jpg
public/media/audio/song-5.mp3
public/media/videos/song-5.mp4
```

Kalau kamu mau pakai nama lain, edit `src/data/songs.js`.

## File yang biasanya diedit

```txt
src/data/songs.js        -> ubah title, artist, album, duration, cover, audio, video
src/assets/main.css      -> ubah warna/layout
public/media/            -> taruh file cover/audio/video
```
