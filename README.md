# 🎲 Petualangan Sistem Pencernaan (Digestive Adventure)

[![Mainkan Sekarang](https://img.shields.io/badge/🎮%20Mainkan%20Game-KLIK%20DISINI-emerald?style=for-the-badge)](https://ahmadzikri1320-beep.github.io/digestive-adventure/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](LICENSE)

> 🎮 **Link Langsung Game**: [https://ahmadzikri1320-beep.github.io/digestive-adventure/](https://ahmadzikri1320-beep.github.io/digestive-adventure/)  
> **Media Pembelajaran Interaktif IPA SD/MI Fase B & C (Kurikulum Merdeka)**  
> Permainan papan edukasi digital 28 petak keliling untuk memahami anatomi, enzim, proses mekanik & kimiawi, serta kesehatan sistem pencernaan manusia secara seru dan interaktif.

---

## 🌟 Fitur Utama

- **Papan Permainan 28 Petak Keliling (10x6 Perimeter Grid)**:
  - Jalur anatomi lengkap: Mulut &rarr; Gigi &rarr; Lidah &rarr; Kerongkongan &rarr; Lambung &rarr; Usus Halus &rarr; Usus Besar &rarr; Anus.
  - Petak edukasi, jebakan sakit perut, kartu misteri, kuis QR, bonus poin, hingga petak Misi Final (Kotak 27).
- **Animasi Gerak Pion Dinamis & Mulus (*Smooth Ease*)**:
  - Transisi pergerakan pion melintasi petak menggunakan *spring physics* & *hop arc* dengan bayangan dinamis yang sangat hidup di smartphone maupun desktop.
- **Dua Mode Dadu (Dadu 3D Virtual & Input Dadu Fisik)**:
  - **Dadu 3D**: Animasi rotasi kubus 3D realistis dengan efek suara lemparan dadu.
  - **Dadu Fisik**: Tombol cepat 1–6 langsung di papan dan modal layar penuh untuk mengakomodasi penggunaan dadu fisik asli di ruang kelas.
- **Aturan Organ Eksklusif & Akumulasi Poin Finish**:
  - Kartu organ tubuh bersifat eksklusif hanya untuk penemu pertama.
  - Kartu organ yang disimpan di inventaris diakumulasikan menjadi bonus **+10 Poin per kartu** saat mencapai garis Finish.
- **Kuis Kilat IPA & Tantangan Pengetahuan**:
  - Bank soal kurikulum terintegrasi untuk menguji pemahaman siswa dengan penjelasan langsung dan hadiah poin bonus.
- **Peta & Pelacak Organ Interaktif**:
  - Pelacak 8 organ tubuh berurutan dengan fitur narasi audio (*Text-to-Speech*) berbahasa Indonesia ramah anak.
- **Mode Layar Penuh Papan Permainan (*Fullscreen Mode*)**:
  - Papan permainan dapat diperbesar penuh ke seluruh layar dengan tombol perkecil yang responsif dan dukungan tombol keyboard `Esc`.
- **Audio & Musik Ceria Anak**:
  - Efek suara langkah pion, kartu, lemparan dadu, bonus, hingga lagu latar anak yang ceria (*ON/OFF toggle*).
- **Responsif Smartphone, Tablet, & Smartboard**:
  - Dioptimalkan khusus agar nyaman dimainkan secara vertikal maupun horizontal di berbagai perangkat.

---

## 🚀 Panduan Memulai Cepat (Local Development)

### Prasyarat
- Node.js versi 18 atau lebih baru
- npm / yarn / pnpm / bun

### Instalasi & Menjalankan

```bash
# 1. Clone repositori
git clone https://github.com/ahmadzikri1320-beep/digestive-adventure.git

# 2. Masuk ke direktori
cd digestive-adventure

# 3. Pasang dependensi
npm install

# 4. Jalankan dev server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` atau port yang ditentukan oleh Vite.

### Build untuk Produksi

```bash
npm run build
```

Hasil build statis siap disajikan dari folder `dist/`.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Audio**: Web Audio API & Audio Elements

---

## 👨‍🏫 Sasaran Pendidikan

- **Mata Pelajaran**: Ilmu Pengetahuan Alam dan Sosial (IPAS)
- **Jenjang**: SD/MI Kelas 4, 5, dan 6 (Fase B & C)
- **Tujuan Pembelajaran**:
  1. Mengidentifikasi organ-organ penyusun sistem pencernaan manusia secara urut.
  2. Menjelaskan fungsi masing-masing organ dan enzim pencernaan yang berperan.
  3. Menganalisis kebiasaan hidup sehat untuk menjaga organ pencernaan dari penyakit.

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [Apache License 2.0](LICENSE).
