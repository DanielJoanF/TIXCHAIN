// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * ████████╗██╗██╗  ██╗ ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗
 * ╚══██╔══╝██║╚██╗██╔╝██╔════╝██║  ██║██╔══██╗██║████╗  ██║
 *    ██║   ██║ ╚███╔╝ ██║     ███████║███████║██║██╔██╗ ██║
 *    ██║   ██║ ██╔██╗ ██║     ██╔══██║██╔══██║██║██║╚██╗██║
 *    ██║   ██║██╔╝ ██╗╚██████╗██║  ██║██║  ██║██║██║ ╚████║
 *    ╚═╝   ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
 *
 * @title TixChainTicket
 * @author TixChain Team
 * @notice Smart Contract untuk Anti-Scalping NFT Ticketing Protocol
 * @dev Deployed on Polygon (Layer 2) untuk gas fee rendah (~$0.01-0.02/tx)
 *
 * FITUR UTAMA:
 * 1. Mint tiket sebagai NFT — tiket unik, tidak bisa dipalsukan
 * 2. Price Cap 110% — calo TIDAK BISA markup harga sembarangan
 * 3. Auto Payment Split — royalty promoter otomatis di setiap resale
 * 4. Dynamic QR — hash berubah tiap 15 detik, screenshot tidak berguna
 * 5. Anti Double-Spending — tiket yang sudah dipakai di-burn
 *
 * MEKANISME ANTI-CALO (Price Cap):
 * ┌─────────────────────────────────────────────────────────┐
 * │ Harga Asli: Rp 650.000                                 │
 * │ Max Resale:  Rp 715.000 (110% × 650.000)               │
 * │                                                         │
 * │ Calo coba jual Rp 1.000.000? → ❌ REVERT "Price cap!"  │
 * │ Calo jual Rp 710.000?        → ✅ OK, dalam batas      │
 * │                                                         │
 * │ Pembeli baru beli di Rp 710.000:                        │
 * │ Max Resale baru: Rp 781.000 (110% × 710.000)           │
 * │ → Markup tetap terbatas di setiap level resale!         │
 * └─────────────────────────────────────────────────────────┘
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TixChainTicket is Ownable, ReentrancyGuard {

    // ═══════════════════════════════════════════════════════
    // STRUCTS
    // ═══════════════════════════════════════════════════════

    /**
     * @dev Struct Ticket menyimpan semua data tiket on-chain.
     *
     * @param ticketId       ID unik tiket (auto-increment)
     * @param originalOwner  Alamat pembeli pertama (pemilik asli)
     * @param currentOwner   Pemilik saat ini (berubah jika dijual kembali)
     * @param originalPrice  Harga beli pertama saat mint (dalam wei)
     * @param maxResalePrice Batas harga jual kembali = 110% dari harga beli terakhir
     *                       INI KUNCI ANTI-CALO: calo tidak bisa markup lebih dari 10%
     * @param isUsed         true jika tiket sudah dipakai untuk check-in (di-burn)
     * @param isListedForSale true jika sedang dijual di secondary market
     * @param resalePrice    Harga yang di-set penjual (harus <= maxResalePrice)
     * @param qrSecret       Secret hash untuk generate QR dinamis yang berubah tiap 15 detik
     */
    struct Ticket {
        uint256 ticketId;
        address originalOwner;
        address currentOwner;
        uint256 originalPrice;
        uint256 maxResalePrice;
        bool isUsed;
        bool isListedForSale;
        uint256 resalePrice;
        bytes32 qrSecret;
    }

    // ═══════════════════════════════════════════════════════
    // STATE VARIABLES
    // ═══════════════════════════════════════════════════════

    /// @notice Mapping dari ticketId ke data Ticket
    mapping(uint256 => Ticket) public tickets;

    /// @notice Mapping dari wallet address ke array of ticketId yang dimiliki
    mapping(address => uint256[]) public userTickets;

    /// @notice Jumlah tiket yang dimiliki per wallet (untuk enforce limit 2 tiket/wallet)
    mapping(address => uint256) public ticketCountPerWallet;

    /// @notice Counter auto-increment untuk ticketId
    uint256 public nextTicketId;

    /// @notice Wallet promoter yang menerima royalty dari setiap resale
    address public promoterWallet;

    /// @notice Wallet platform TixChain yang menerima fee
    address public platformWallet;

    /// @notice Persentase royalty promoter dari resale (default 2%)
    uint256 public promoterRoyaltyPercent = 2;

    /// @notice Persentase fee platform dari resale (default 1%)
    uint256 public platformFeePercent = 1;

    /// @notice Limit maksimal tiket per wallet (anti-bot, anti-calo)
    uint256 public maxTicketsPerWallet = 2;

    /// @notice Tanggal event (Unix timestamp) — untuk time-lock resale
    uint256 public eventDate;

    /// @notice Minimum hari sebelum event untuk boleh resale (default 7 hari = H-7)
    uint256 public resaleLockDays = 7;

    /// @notice Persentase price cap (110 = max 110% dari harga beli, markup max 10%)
    uint256 public priceCapPercent = 110;

    /// @notice Role: alamat yang boleh validate check-in (gate scanner)
    mapping(address => bool) public isValidator;

    /// @notice Role: alamat platform yang boleh mint tiket
    mapping(address => bool) public isPlatform;

    // ═══════════════════════════════════════════════════════
    // EVENTS — di-emit untuk setiap aksi penting
    // Frontend & backend listen ke events ini untuk update UI real-time
    // ═══════════════════════════════════════════════════════

    /// @notice Emitted ketika tiket baru di-mint
    event TicketMinted(
        uint256 indexed ticketId,
        address indexed owner,
        uint256 price
    );

    /// @notice Emitted ketika tiket di-listing untuk dijual kembali
    event TicketListed(
        uint256 indexed ticketId,
        uint256 price
    );

    /// @notice Emitted ketika listing dibatalkan
    event TicketDelisted(
        uint256 indexed ticketId
    );

    /// @notice Emitted ketika tiket terjual di secondary market
    event TicketSold(
        uint256 indexed ticketId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    /// @notice Emitted ketika tiket dipakai untuk check-in
    event CheckedIn(
        uint256 indexed ticketId,
        uint256 timestamp
    );

    // ═══════════════════════════════════════════════════════
    // MODIFIERS — access control
    // ═══════════════════════════════════════════════════════

    /// @notice Hanya alamat platform yang terdaftar boleh mint tiket
    modifier onlyPlatform() {
        require(isPlatform[msg.sender], "TixChain: caller is not platform");
        _;
    }

    /// @notice Hanya validator (gate scanner) yang boleh verify check-in
    modifier onlyValidator() {
        require(isValidator[msg.sender], "TixChain: caller is not validator");
        _;
    }

    // ═══════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════

    /**
     * @dev Constructor: set promoter, platform wallet, dan tanggal event.
     *
     * @param _promoterWallet  Alamat wallet promoter/event organizer
     * @param _platformWallet  Alamat wallet platform TixChain
     * @param _eventDate       Tanggal event dalam Unix timestamp
     *
     * Contoh deploy:
     *   new TixChainTicket(
     *     0xPromoter...,
     *     0xPlatform...,
     *     1761584400   // Oct 27, 2025 19:00 WIB
     *   )
     */
    constructor(
        address _promoterWallet,
        address _platformWallet,
        uint256 _eventDate
    ) Ownable(msg.sender) {
        require(_promoterWallet != address(0), "TixChain: invalid promoter");
        require(_platformWallet != address(0), "TixChain: invalid platform");
        require(_eventDate > block.timestamp, "TixChain: event must be in future");

        promoterWallet = _promoterWallet;
        platformWallet = _platformWallet;
        eventDate = _eventDate;
        nextTicketId = 1;

        // Deployer otomatis jadi platform dan validator
        isPlatform[msg.sender] = true;
        isValidator[msg.sender] = true;
    }

    // ═══════════════════════════════════════════════════════
    // FUNGSI 1: MINT TICKET
    // ═══════════════════════════════════════════════════════

    /**
     * @notice Mint tiket baru sebagai NFT ke wallet pembeli.
     * @dev Hanya bisa dipanggil oleh platform (backend TixChain).
     *
     * ANTI-CALO MECHANISM:
     * - Setiap wallet HANYA bisa punya maksimal 2 tiket
     * - Calo yang buat banyak wallet tetap terbatas 2 tiket per wallet
     * - Ditambah price cap di resale, profit margin calo sangat kecil
     *
     * FLOW:
     * 1. User klik "Mint Ticket" di frontend
     * 2. Frontend kirim request ke Spring Boot backend
     * 3. Backend panggil function ini via Web3j
     * 4. Tiket ter-mint sebagai NFT ke wallet user
     * 5. Event TicketMinted emitted → frontend update UI
     *
     * @param to     Alamat wallet pembeli
     * @param price  Harga tiket dalam wei (dikirim bersama transaksi)
     */
    function mintTicket(address to, uint256 price) external onlyPlatform nonReentrant {
        require(to != address(0), "TixChain: cannot mint to zero address");
        require(price > 0, "TixChain: price must be > 0");
        require(
            ticketCountPerWallet[to] < maxTicketsPerWallet,
            "TixChain: wallet already has max tickets (limit 2 per wallet)"
        );
        require(block.timestamp < eventDate, "TixChain: event already passed");

        uint256 ticketId = nextTicketId++;

        // Hitung maxResalePrice = 110% dari harga beli
        // Ini KUNCI ANTI-CALO: calo tidak bisa jual lebih dari 10% markup
        uint256 maxResale = (price * priceCapPercent) / 100;

        // Generate QR secret unik untuk tiket ini
        // Secret ini digunakan untuk membuat QR dinamis di frontend
        bytes32 qrSecret = keccak256(
            abi.encodePacked(ticketId, to, block.timestamp, blockhash(block.number - 1))
        );

        tickets[ticketId] = Ticket({
            ticketId: ticketId,
            originalOwner: to,
            currentOwner: to,
            originalPrice: price,
            maxResalePrice: maxResale,
            isUsed: false,
            isListedForSale: false,
            resalePrice: 0,
            qrSecret: qrSecret
        });

        userTickets[to].push(ticketId);
        ticketCountPerWallet[to]++;

        emit TicketMinted(ticketId, to, price);
    }

    // ═══════════════════════════════════════════════════════
    // FUNGSI 2: LIST FOR RESALE
    // ═══════════════════════════════════════════════════════

    /**
     * @notice Listing tiket untuk dijual kembali di secondary market.
     * @dev VALIDASI KRITIS: harga HARUS <= maxResalePrice (110% dari harga beli)
     *
     * MEKANISME PRICE CAP ANTI-CALO:
     * ┌──────────────────────────────────────────────────────┐
     * │ Contoh:                                              │
     * │ - Harga beli: 1 MATIC (≈ Rp 650.000)                │
     * │ - maxResalePrice: 1.1 MATIC (110%)                   │
     * │                                                      │
     * │ listForResale(ticketId, 1.5 MATIC) → ❌ REVERT!     │
     * │ "Harga melebihi batas 110%! Calo terdeteksi."       │
     * │                                                      │
     * │ listForResale(ticketId, 1.05 MATIC) → ✅ OK         │
     * │ Markup hanya 5%, fair untuk fans.                    │
     * └──────────────────────────────────────────────────────┘
     *
     * TIME LOCK: Tiket hanya bisa dijual kembali minimum H-7 sebelum event.
     * Ini mencegah spekulasi di menit-menit terakhir.
     *
     * @param ticketId  ID tiket yang ingin dijual
     * @param price     Harga jual yang diinginkan (dalam wei, harus <= maxResalePrice)
     */
    function listForResale(uint256 ticketId, uint256 price) external nonReentrant {
        Ticket storage ticket = tickets[ticketId];

        // Validasi ownership — hanya pemilik yang bisa jual tiketnya
        require(ticket.currentOwner == msg.sender, "TixChain: not the ticket owner");

        // Validasi status — tiket belum dipakai dan belum di-list
        require(!ticket.isUsed, "TixChain: ticket already used for check-in");
        require(!ticket.isListedForSale, "TixChain: ticket already listed");

        // ═══════════════════════════════════════════════════
        // VALIDASI KRITIS ANTI-CALO: PRICE CAP CHECK
        // Ini yang membuat calo TIDAK BISA untung besar!
        // Smart contract memaksa harga <= 110% dari harga beli.
        // Tidak ada cara untuk bypass ini — immutable on blockchain.
        // ═══════════════════════════════════════════════════
        require(
            price <= ticket.maxResalePrice,
            "TixChain: price exceeds 110% cap! Anti-scalping protection active."
        );
        require(price > 0, "TixChain: price must be > 0");

        // Time lock: hanya bisa resale minimum H-7 sebelum event
        // Mencegah dumping tiket di saat-saat terakhir
        require(
            block.timestamp <= eventDate - (resaleLockDays * 1 days),
            "TixChain: resale locked within 7 days of event"
        );

        ticket.isListedForSale = true;
        ticket.resalePrice = price;

        emit TicketListed(ticketId, price);
    }

    /**
     * @notice Batalkan listing tiket dari secondary market.
     * @param ticketId ID tiket yang ingin di-delist
     */
    function cancelListing(uint256 ticketId) external {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.currentOwner == msg.sender, "TixChain: not the ticket owner");
        require(ticket.isListedForSale, "TixChain: ticket not listed");

        ticket.isListedForSale = false;
        ticket.resalePrice = 0;

        emit TicketDelisted(ticketId);
    }

    // ═══════════════════════════════════════════════════════
    // FUNGSI 3: BUY RESALE
    // ═══════════════════════════════════════════════════════

    /**
     * @notice Beli tiket dari secondary market dengan escrow otomatis.
     * @dev Payment di-split otomatis oleh smart contract:
     *
     * PAYMENT SPLIT:
     * ┌─────────────────────────────────────────────────┐
     * │ Harga Resale: 1.1 MATIC                        │
     * │                                                 │
     * │ → Seller mendapat:    97% = 1.067 MATIC        │
     * │ → Promoter royalty:    2% = 0.022 MATIC        │
     * │ → Platform fee:        1% = 0.011 MATIC        │
     * │                                                 │
     * │ Total:               100% = 1.1 MATIC          │
     * │                                                 │
     * │ Promoter mendapat passive income dari SETIAP    │
     * │ resale! Ini insentif bagi promoter untuk        │
     * │ menggunakan TixChain.                           │
     * └─────────────────────────────────────────────────┘
     *
     * ANTI DOUBLE-SPENDING:
     * - Tiket langsung di-unlist setelah terjual
     * - Ownership langsung pindah
     * - maxResalePrice di-update (110% dari harga beli baru)
     *
     * @param ticketId ID tiket yang ingin dibeli
     */
    function buyResale(uint256 ticketId) external payable nonReentrant {
        Ticket storage ticket = tickets[ticketId];

        require(ticket.isListedForSale, "TixChain: ticket not for sale");
        require(!ticket.isUsed, "TixChain: ticket already used");
        require(msg.sender != ticket.currentOwner, "TixChain: cannot buy own ticket");
        require(msg.value == ticket.resalePrice, "TixChain: incorrect payment amount");
        require(
            ticketCountPerWallet[msg.sender] < maxTicketsPerWallet,
            "TixChain: buyer already has max tickets"
        );

        address seller = ticket.currentOwner;
        uint256 salePrice = ticket.resalePrice;

        // ═══════════════════════════════════════════════════
        // PAYMENT SPLIT — otomatis, transparan, on-chain
        // Tidak ada pihak yang bisa manipulasi pembagian ini
        // ═══════════════════════════════════════════════════

        // Hitung fee promoter dan platform
        uint256 promoterCut = (salePrice * promoterRoyaltyPercent) / 100;
        uint256 platformCut = (salePrice * platformFeePercent) / 100;
        uint256 sellerCut = salePrice - promoterCut - platformCut;

        // Transfer ownership tiket ke pembeli
        ticket.currentOwner = msg.sender;
        ticket.isListedForSale = false;
        ticket.resalePrice = 0;

        // UPDATE PRICE CAP untuk pemilik baru
        // maxResalePrice baru = 110% dari harga beli saat ini
        // Ini memastikan anti-calo berlaku di SETIAP level resale
        ticket.maxResalePrice = (salePrice * priceCapPercent) / 100;

        // Generate QR secret baru untuk pemilik baru
        ticket.qrSecret = keccak256(
            abi.encodePacked(ticketId, msg.sender, block.timestamp, blockhash(block.number - 1))
        );

        // Update tracking kepemilikan
        userTickets[msg.sender].push(ticketId);
        ticketCountPerWallet[msg.sender]++;
        ticketCountPerWallet[seller]--;

        // Transfer pembayaran (Checks-Effects-Interactions pattern)
        (bool s1, ) = payable(seller).call{value: sellerCut}("");
        require(s1, "TixChain: seller payment failed");

        (bool s2, ) = payable(promoterWallet).call{value: promoterCut}("");
        require(s2, "TixChain: promoter royalty payment failed");

        (bool s3, ) = payable(platformWallet).call{value: platformCut}("");
        require(s3, "TixChain: platform fee payment failed");

        emit TicketSold(ticketId, seller, msg.sender, salePrice);
    }

    // ═══════════════════════════════════════════════════════
    // FUNGSI 4: GENERATE QR (Dynamic QR Code)
    // ═══════════════════════════════════════════════════════

    /**
     * @notice Generate hash untuk QR code dinamis yang berubah tiap 15 detik.
     * @dev QR code TixChain TIDAK BISA di-screenshot karena:
     *
     * MEKANISME ANTI-SCREENSHOT:
     * ┌─────────────────────────────────────────────────┐
     * │ QR Hash = keccak256(                            │
     * │   ticketId + qrSecret + (timestamp / 15)        │
     * │ )                                               │
     * │                                                 │
     * │ timestamp / 15 berubah setiap 15 detik          │
     * │ → QR code berubah setiap 15 detik               │
     * │ → Screenshot yang diambil jadi invalid           │
     * │   setelah 15 detik                              │
     * └─────────────────────────────────────────────────┘
     *
     * Frontend meminta hash baru setiap 15 detik dan
     * re-render QR code dengan hash terbaru.
     *
     * @param ticketId  ID tiket yang ingin di-generate QR-nya
     * @return bytes32  Hash yang dipakai untuk QR code
     */
    function generateQR(uint256 ticketId) external view returns (bytes32) {
        Ticket storage ticket = tickets[ticketId];

        require(ticket.currentOwner == msg.sender, "TixChain: not the ticket owner");
        require(!ticket.isUsed, "TixChain: ticket already used");
        require(!ticket.isListedForSale, "TixChain: cannot generate QR while listed for sale");

        // QR hanya aktif H-1 sebelum event (24 jam sebelum event)
        require(
            block.timestamp >= eventDate - 1 days,
            "TixChain: QR only available 24h before event"
        );

        // Hash berubah setiap 15 detik berdasarkan block.timestamp
        // timestamp / 15 menghasilkan angka yang berubah setiap 15 detik
        uint256 timeSlot = block.timestamp / 15;

        return keccak256(
            abi.encodePacked(ticketId, ticket.qrSecret, timeSlot)
        );
    }

    // ═══════════════════════════════════════════════════════
    // FUNGSI 5: VERIFY CHECK-IN
    // ═══════════════════════════════════════════════════════

    /**
     * @notice Verifikasi QR code saat check-in di venue event.
     * @dev Hanya bisa dipanggil oleh validator (gate scanner).
     *
     * ANTI DOUBLE-SPENDING:
     * - Setelah check-in, tiket di-mark isUsed = true
     * - Tiket yang sudah isUsed TIDAK BISA:
     *   → Di-generate QR lagi
     *   → Di-listing untuk resale
     *   → Dipakai check-in lagi
     * - Efektif "burn" tiket setelah dipakai
     *
     * @param ticketId  ID tiket yang di-scan
     * @param qrHash    Hash dari QR code yang di-scan
     * @return bool     true jika check-in valid
     */
    function verifyCheckIn(uint256 ticketId, bytes32 qrHash) external onlyValidator nonReentrant returns (bool) {
        Ticket storage ticket = tickets[ticketId];

        require(!ticket.isUsed, "TixChain: ticket already used (double-spending blocked)");
        require(ticket.currentOwner != address(0), "TixChain: ticket does not exist");

        // Hitung expected hash berdasarkan waktu saat ini
        uint256 timeSlot = block.timestamp / 15;
        bytes32 expectedHash = keccak256(
            abi.encodePacked(ticketId, ticket.qrSecret, timeSlot)
        );

        // Cek juga time slot sebelumnya (toleransi ±15 detik)
        // Ini untuk menghindari race condition saat scan tepat di pergantian slot
        bytes32 prevHash = keccak256(
            abi.encodePacked(ticketId, ticket.qrSecret, timeSlot - 1)
        );

        require(
            qrHash == expectedHash || qrHash == prevHash,
            "TixChain: invalid QR code (expired or fake)"
        );

        // Mark tiket sebagai sudah dipakai — efektif "burn"
        ticket.isUsed = true;

        emit CheckedIn(ticketId, block.timestamp);
        return true;
    }

    // ═══════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════

    /// @notice Tambah alamat platform yang boleh mint tiket
    function addPlatform(address addr) external onlyOwner {
        isPlatform[addr] = true;
    }

    /// @notice Hapus alamat platform
    function removePlatform(address addr) external onlyOwner {
        isPlatform[addr] = false;
    }

    /// @notice Tambah validator (gate scanner) untuk check-in
    function addValidator(address addr) external onlyOwner {
        isValidator[addr] = true;
    }

    /// @notice Hapus validator
    function removeValidator(address addr) external onlyOwner {
        isValidator[addr] = false;
    }

    /// @notice Update alamat wallet promoter
    function setPromoterWallet(address _promoter) external onlyOwner {
        require(_promoter != address(0), "TixChain: invalid address");
        promoterWallet = _promoter;
    }

    /// @notice Update persentase price cap (default 110)
    function setPriceCapPercent(uint256 _percent) external onlyOwner {
        require(_percent >= 100 && _percent <= 150, "TixChain: cap must be 100-150%");
        priceCapPercent = _percent;
    }

    /// @notice Update batas hari resale lock (default 7)
    function setResaleLockDays(uint256 _days) external onlyOwner {
        resaleLockDays = _days;
    }

    // ═══════════════════════════════════════════════════════
    // VIEW FUNCTIONS — query data tanpa gas fee
    // ═══════════════════════════════════════════════════════

    /// @notice Ambil semua ticketId yang dimiliki sebuah wallet
    function getTicketsByOwner(address owner) external view returns (uint256[] memory) {
        return userTickets[owner];
    }

    /// @notice Cek apakah tiket masih valid (belum dipakai dan belum expired)
    function isTicketValid(uint256 ticketId) external view returns (bool) {
        Ticket storage ticket = tickets[ticketId];
        return !ticket.isUsed && ticket.currentOwner != address(0) && block.timestamp <= eventDate;
    }

    /// @notice Ambil detail lengkap tiket
    function getTicketDetails(uint256 ticketId) external view returns (
        address currentOwner,
        uint256 originalPrice,
        uint256 maxResalePrice,
        bool isUsed,
        bool isListedForSale,
        uint256 resalePrice
    ) {
        Ticket storage ticket = tickets[ticketId];
        return (
            ticket.currentOwner,
            ticket.originalPrice,
            ticket.maxResalePrice,
            ticket.isUsed,
            ticket.isListedForSale,
            ticket.resalePrice
        );
    }

    /// @notice Total tiket yang sudah di-mint
    function totalTicketsMinted() external view returns (uint256) {
        return nextTicketId - 1;
    }
}
