# TixChain Technical Architecture

**Blockchain-Powered Anti-Scalping Ticketing Protocol**

---

## Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Blockchain** | Solidity + Polygon PoS | Gas fee ~$0.01, 7000+ TPS, Ethereum security |
| **Backend** | Java Spring Boot + Web3j | OOP design, enterprise-grade, blockchain bridge |
| **Frontend** | React.js + Vite | Fast SPA, component-based UI |
| **Database** | H2/PostgreSQL | Event & user operational data |
| **Storage** | IPFS | NFT metadata (decentralized) |
| **Wallet** | MetaMask / WalletConnect | Standard Web3 wallet integration |
| **Security** | JWT + Rate Limiting + HMAC QR | Multi-layer protection |

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                       │
│  React.js Frontend ← Vite Dev Server (port 5173)            │
└─────────────┬───────────────────────────────┬───────────────┘
              │ REST API (JWT Auth)           │ Web3 / MetaMask
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   Spring Boot Backend   │     │    Polygon Network          │
│   (port 8080)           │     │                             │
│                         │     │  ┌───────────────────────┐  │
│  ┌─────────────────┐    │     │  │ TixChainTicket.sol    │  │
│  │ EventController  │   │     │  │                       │  │
│  │ TicketController │   │     │  │ • mintTicket()        │  │
│  │ AuthController   │◄──┼─────┤  │ • listForResale()    │  │
│  │ CheckInController│   │Web3j│  │ • buyResale()         │  │
│  │ DashboardCtrl    │   │     │  │ • generateQR()        │  │
│  └────────┬─────────┘   │     │  │ • verifyCheckIn()     │  │
│           │              │     │  └───────────────────────┘  │
│  ┌────────▼─────────┐   │     │                             │
│  │   PostgreSQL DB   │   │     │  Gas Fee: ~$0.01/tx         │
│  │   Events, Users   │   │     └─────────────────────────────┘
│  │   Tickets, TXs    │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

## Data Flow

### 1. Pembelian Tiket (Primary Sale)
```
Fan → Connect Wallet → Pilih Event → Mint Ticket
  → Frontend kirim ke Spring Boot API
    → Backend panggil Smart Contract via Web3j
      → NFT ter-mint di Polygon → DB sync
        → Frontend tampilkan konfirmasi + Token ID
```

### 2. Resale (Secondary Market)
```
Seller → List Ticket → Set Harga (max 110%)
  → Smart Contract validasi price cap
    → Buyer klik "Buy via Escrow"
      → Payment split otomatis:
        ├── 97% → Seller
        ├──  2% → Promoter (royalty)
        └──  1% → Platform (fee)
      → NFT transfer ke buyer
```

### 3. Check-in di Venue
```
Fan buka QR → Hash = keccak256(ticketId + secret + timestamp/15)
  → QR berubah tiap 15 detik (anti-screenshot)
    → Scanner verify hash on-chain
      → ticket.isUsed = true (burned)
```

## Security Measures

| Layer | Mechanism |
|-------|-----------|
| **Smart Contract** | OpenZeppelin Ownable + ReentrancyGuard |
| **Price Validation** | Triple-layer: Frontend → Backend → Smart Contract |
| **Authentication** | JWT token + Wallet Signature |
| **Anti-Bot** | Rate limiting (5 req/min on mint) + Max 2 tickets/wallet |
| **Anti-Fraud QR** | HMAC hash refresh every 15 seconds |
| **Anti-Double-Spend** | Ticket burned after check-in |

## Package Structure (Backend)

```
com.tixchain.backend
├── controller/     # REST endpoints (Event, Ticket, Auth, Dashboard, CheckIn)
├── service/        # Business logic (EventService, TicketService, BlockchainService)
├── model/          # JPA Entities (Event, User, Ticket, Transaction)
├── repository/     # Spring Data JPA repositories
├── dto/            # Data Transfer Objects
├── config/         # SecurityConfig, WebConfig, BlockchainConfig, DataSeeder
└── security/       # JwtUtils, JwtAuthFilter, RateLimitFilter
```

## Scalability

- **Polygon:** 7,000+ TPS, block time 2 detik
- **Backend:** Stateless Spring Boot, horizontal scalable
- **Cost:** Gas fee $0.01-0.02/tx (vs Ethereum $5-50/tx)
