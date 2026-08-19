# LJN Payment System — Frontend

Frontend admin panel untuk Sistem Pembayaran WiFi PT LJN (Lintas Jaringan Nusantara). Dibangun dengan React + Vite dan Tailwind CSS, terhubung ke backend FastAPI dengan integrasi Midtrans untuk pembayaran.

## Fitur

- **Autentikasi Admin** — Login & registrasi admin, session tersimpan via token
- **Dashboard** — Ringkasan statistik (total pelanggan, tagihan, tagihan lunas) dan grafik pendapatan bulanan
- **Manajemen Pelanggan** — CRUD data pelanggan, pencarian berdasarkan nama
- **Manajemen Paket Langganan** — CRUD paket WiFi, pencarian berdasarkan nama paket
- **Manajemen Tagihan** — CRUD tagihan per pelanggan, generate transaksi pembayaran, pencarian berdasarkan nama pelanggan
- **Riwayat Transaksi** — Melihat histori transaksi pembayaran beserta status dan bukti pembayaran, pencarian berdasarkan nama pelanggan
- **Profil Admin** — Dropdown profil dengan opsi logout

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/) — HTTP client ke backend
- [Recharts](https://recharts.org/) — visualisasi grafik pendapatan

## Struktur Folder

## Struktur Folder

```
src/
├── api/            # Konfigurasi axios & fungsi request per resource (pelanggan, paket, tagihan, transaksi, auth)
├── components/
│   ├── forms/      # Form untuk create/edit data (Pelanggan, Paket, Tagihan)
│   ├── layout/      # Layout dashboard (Sidebar, Header, DashboardLayout)
│   ├── ui/          # Komponen UI reusable (Badge, Button, Modal, SearchBar, Table)
│   └── ProtectedRoute.jsx
├── context/        # AuthContext untuk state autentikasi global
├── hooks/          # Custom hooks
├── pages/          # Halaman utama (Dashboard, Login, Register, Pelanggan, Paket, Tagihan, Transaksi)
└── utils/          # Helper (format currency, format date)
```

## Persiapan & Instalasi

1. Clone repository ini
```bash
   git clone https://github.com/gymnastiarsyahputra/ljn_payment_frontend.git
   cd ljn_payment_frontend
```

2. Install dependencies
```bash
   npm install
```

3. Pastikan backend (FastAPI) sudah berjalan di `http://127.0.0.1:8000` (atau sesuaikan `baseURL` di `src/api/axiosClient.js`)

4. Jalankan development server
```bash
   npm run dev
```

5. Buka `http://localhost:5173` di browser

## Scripts

| Command | Keterangan |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Menjalankan ESLint |

## Kontribusi

Proyek ini dikembangkan untuk keperluan akademik (Kerja Praktik) dan tidak dimaksudkan untuk penggunaan produksi tanpa penyesuaian lebih lanjut, khususnya terkait keamanan dan skalabilitas.