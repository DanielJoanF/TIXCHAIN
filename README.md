# TixChain

**Fair Ticketing for True Fans. No Bots, No Scalpers.**

TixChain adalah platform ticketing berbasis blockchain (Polygon) yang mengubah tiket menjadi NFT, diproteksi dengan Smart Contract untuk mencegah calo tiket dan penipuan.

---

## 🚀 Cara Menjalankan Aplikasi (Local Development)

Proyek ini terdiri dari dua bagian utama: **Backend (Java Spring Boot)** dan **Frontend (React/Vite)**. Anda harus menjalankan keduanya secara bersamaan.

### Prasyarat:
- Java 24 (atau versi yang kompatibel)
- Maven 3.9+ 
- Node.js & npm

---

### Langkah 1: Jalankan Backend (Spring Boot)
Backend menggunakan H2 in-memory database, sehingga tidak perlu setup database eksternal untuk development/demo.

1. Buka terminal baru.
2. Masuk ke folder root TixChain, lalu ke folder `backend`:
   ```bash
   cd backend
   ```
3. Set path Maven jika belum tersedia di environment variable Anda (contoh di Windows PowerShell):
   ```powershell
   $env:PATH = "C:\tools\apache-maven-3.9.6\bin;" + $env:PATH
   ```
4. Jalankan aplikasi Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
5. Tunggu hingga muncul log `Started TixChainApplication`. Backend akan berjalan di port `8080`.
   Data dummy (4 events siap pakai) akan otomatis ter-seed ke dalam database saat startup.

---

### Langkah 2: Jalankan Frontend (React/Vite)

1. Buka tab terminal baru (biarkan terminal backend tetap berjalan).
2. Masuk ke folder `tixchain-app` dari root direktori proyek:
   ```bash
   cd tixchain-app
   ```
3. Install dependensi (jika baru pertama kali):
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Terminal akan menampilkan URL lokal frontend. Buka browser dan arahkan ke:
   👉 **http://localhost:5173**

---

## 📝 Catatan Penting
- **Penting:** Pastikan backend (`localhost:8080`) sudah berjalan SEBELUM membuka atau berinteraksi dengan frontend (`localhost:5173`).
- **Simulasi Wallet:** Tombol "Connect Wallet" saat ini menggunakan simulasi wallet address yang valid secara otomatis, tidak memerlukan extension MetaMask untuk demontrasi.
- **Smart Contract:** Kode Solidity lengkap untuk TixChainTicket (NFT & Anti-scalping logic) dapat ditemukan di direktori `/contracts/TixChainTicket.sol`.
- **Dokumentasi:** Seluruh dokumentasi presentasi dan teknis dapat ditemukan di dalam folder `/docs/`.
