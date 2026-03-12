# TixChain — Pitch Deck (9 Slides)

**Durasi Presentasi: 5-7 menit**

---

## SLIDE 1: Cover

### TixChain
**Fair Ticketing for True Fans**
*No Bots, No Scalpers.*

> Blockchain-Powered Anti-Scalping Ticketing Protocol
> Polygon · NFT · Smart Contract

---

## SLIDE 2: Problem — War Tiket & Calo

### Masalah Yang Kita Hadapi

**Fakta:**
- Tiket konser habis dalam **30 menit**, muncul di marketplace seharga **3-10x lipat**
- **47%** fans pernah tertipu beli tiket palsu online *(survey)*
- Promoter **kehilangan revenue** di secondary market — $0 dari resale

**3 Masalah Utama:**

| 🤖 Bot & Calo | 🎭 Tiket Palsu | 💸 No Transparency |
|---------------|----------------|-------------------|
| Tiket dibeli massal oleh bot, dijual 3x lipat | Screenshot & tiket palsu beredar di socmed | Fans tidak bisa verifikasi keaslian |

> *"Saya antri 3 jam, tiket habis. 5 menit kemudian muncul di Tokopedia 3x lipat harga."* — Curhatan fans di Twitter

---

## SLIDE 3: Solution — 4 Pilar TixChain

### Solusi: 4 Pilar Anti-Calo

| # | Pilar | Cara Kerja |
|---|-------|------------|
| 🎫 | **NFT Ticket** | Setiap tiket = NFT unik di blockchain. Tidak bisa dipalsukan. |
| 💰 | **Price Cap 110%** | Smart contract MEMAKSA harga resale max 110%. Immutable, tidak bisa di-hack. |
| 📱 | **Dynamic QR** | QR code berubah tiap 15 detik. Screenshot = tidak berguna. |
| 💎 | **Auto Royalty** | Promoter dapat 2% dari SETIAP resale. Passive income! |

**Key Insight:** Proteksi ada di level **smart contract** — bukan database yang bisa di-hack.

---

## SLIDE 4: Technical Architecture

### Arsitektur Sistem

```
User → React Frontend → MetaMask Wallet
                ↓
        Spring Boot API (Java)
         ↓              ↓
    PostgreSQL    Web3j → Polygon Network
                           ↓
                  TixChainTicket.sol
                  (Smart Contract)
```

**Stack:** React.js · Java Spring Boot · Solidity · Polygon · IPFS
**Gas Fee:** ~$0.01/transaksi (vs Ethereum $5-50)

---

## SLIDE 5: Killer Feature — Anti-Calo Price Cap

### Demo: Calo Tidak Bisa Markup

```solidity
// Di smart contract — TIDAK BISA DI-BYPASS
require(
    price <= ticket.maxResalePrice,  // 110% dari harga beli
    "Price exceeds 110% cap!"
);
```

| Skenario | Harga Asli | Calo Mau Jual | Hasil |
|----------|-----------|---------------|-------|
| ❌ Calo | Rp 650K | Rp 1.500K | **BLOCKED** oleh smart contract |
| ✅ Fair | Rp 650K | Rp 700K | OK, dalam batas 110% |

**Ini immutable** — bahkan developer TixChain tidak bisa mengubah aturan ini setelah deploy.

---

## SLIDE 6: Competitive Advantage

### TixChain vs Kompetitor

| Feature | TixChain | Tiket.com | Loket.com |
|---------|----------|-----------|-----------|
| Anti-scalping | ✅ Smart contract | ❌ | ❌ |
| Tiket palsu | ✅ Impossible (NFT) | ❌ Bisa | ❌ Bisa |
| Price cap | ✅ On-chain 110% | ❌ | ❌ |
| QR dinamis | ✅ 15 detik | ❌ Static | ❌ Static |
| Promoter royalty | ✅ Auto 2% | ❌ | ❌ |
| Transparansi | ✅ Blockchain | ❌ | ❌ |

---

## SLIDE 7: Monetization Model

### Revenue Streams

| Stream | Fee | Dari |
|--------|-----|------|
| Primary Sale | 1% | Setiap pembelian tiket |
| Secondary Market | 1% | Setiap resale |
| Promoter Royalty | 2% | Auto-distribute ke promoter |
| SaaS Dashboard | Subscription | Event organizer tools |

**Estimasi per event (1000 tiket @ Rp 650K):**
- Platform revenue: **Rp 7.9 Juta**
- Gas cost: **Rp 160K** (1000 × Rp 160)
- **Margin: 98%**

---

## SLIDE 8: Roadmap & Team

### Roadmap

| Phase | Timeline | Status |
|-------|----------|--------|
| MVP Development | Q1 2026 | ✅ Done |
| Beta Testing (3 events) | Q2 2026 | 🔜 Next |
| Security Audit | Q3 2026 | Planned |
| Partnership (5 promoters) | Q4 2026 | Planned |
| Public Launch + Mobile | Q1 2027 | Planned |

### Team
- **Blockchain Dev** — Smart Contract, Web3 integration
- **Backend Dev** — Java Spring Boot, API design
- **Frontend Dev** — React UI/UX, Web3.js

---

## SLIDE 9: Closing

### Fair Ticketing for True Fans

**3 Alasan Kenapa TixChain:**

1. 🛡️ **Anti-Calo** — Price cap 110% di level smart contract
2. 🔒 **Anti-Palsu** — Tiket = NFT, impossible to fake
3. ⚡ **Anti-Ribet** — Gas fee Rp 160, proses 2 detik

> *"TixChain mengembalikan keadilan dalam ekosistem tiket."*

**Demo live tersedia di booth kami** 🚀

---
---

# LIVE DEMO SCRIPT (5 Menit)

## 0:00 - 0:30 | Hook
> "Siapa di sini yang pernah gagal beli tiket konser karena habis dalam hitungan menit, tapi 5 menit kemudian muncul di marketplace 3x lipat harga? [raise hands] Itulah masalah yang TixChain selesaikan."

## 0:30 - 1:30 | Demo Pembelian
1. Buka TixChain di browser → Landing page
2. Klik **Connect Wallet** → Wallet terhubung, address muncul
3. Buka **Events** → 4 event dari database
4. Klik event → Detail + harga + tiket available
5. Klik **Mint Ticket as NFT** → Loading → ✅ Success! Token ID muncul

> "Tiket sudah jadi NFT di wallet anda. Tidak bisa dipalsukan."

## 1:30 - 2:30 | Killer Feature Demo
1. Buka smart contract code
2. Tunjukkan `require(price <= maxResalePrice)` 
3. Jelaskan: "Ini berjalan di blockchain — bahkan kami sebagai developer tidak bisa mengubahnya"

> "Calo coba jual 3x lipat? Smart contract bilang: TIDAK BISA."

## 2:30 - 3:30 | Secondary Market
1. Buka **Marketplace** → Tampilkan listing
2. Tunjukkan price cap indicator
3. Jelaskan payment split: 97% seller, 2% promoter, 1% platform

> "Promoter mendapat royalty otomatis dari setiap resale. Passive income."

## 3:30 - 4:30 | Check-in Demo
1. Buka **Dashboard** → My Tickets
2. Klik View Full-Screen → QR code muncul
3. Tunjukkan timer: QR berubah tiap 15 detik
4. Screenshot QR → tunggu 15 detik → QR berubah

> "Screenshot? Tidak berguna. QR berubah tiap 15 detik."

## 4:30 - 5:00 | Closing
> "TixChain: Anti-Calo, Anti-Palsu, Anti-Ribet. Tiket adil untuk fans sejati. Terima kasih!"

---
---

# Q&A PREPARATION

### Q1: Kenapa harus pakai blockchain? Database biasa kan bisa?
**A:** Database bisa di-hack atau dimanipulasi oleh admin. Smart contract di blockchain immutable — bahkan developer tidak bisa mengubah aturan price cap setelah deploy. Transparansi 100%.

### Q2: Bagaimana dengan user yang tidak paham crypto?
**A:** User TIDAK perlu tahu tentang crypto. Mereka hanya klik "Connect Wallet" (seperti login Google), pilih tiket, klik "Mint". Blockchain bekerja di background. UX sama seperti beli tiket biasa.

### Q3: Bagaimana jika calo membuat banyak wallet?
**A:** Setiap wallet tetap dibatasi 2 tiket. Calo yang buat 100 wallet = 200 tiket × markup max 10% = profit margin sangat kecil. Tidak worth it buat calo.

### Q4: Apakah legal di Indonesia?
**A:** Ya. TixChain bukan crypto trading. Ini ticketing platform yang menggunakan blockchain sebagai infrastruktur. NFT di sini bukan investasi, tapi bukti kepemilikan tiket. Comply dengan UU Perlindungan Konsumen.

### Q5: Siapa kompetitornya dan keunggulan TixChain?
**A:** Kompetitor: Tiket.com, Loket.com (Web2). Keunggulan: mereka TIDAK bisa prevent scalping karena database bisa di-bypass. TixChain menggunakan smart contract — aturan di-enforce oleh blockchain, bukan company policy.

### Q6: Bagaimana model bisnisnya?
**A:** Platform fee 1% dari setiap penjualan (primary & secondary). Gas cost cuma Rp 160/tx di Polygon. Margin 98%. Plus SaaS subscription untuk event organizer dashboard.

### Q7: Apa next step setelah hackathon?
**A:** Beta testing dengan 3 local events → Smart contract audit → Partnership dengan 5 music promoters → Fiat payment integration (QRIS) → Public launch Q1 2027.
