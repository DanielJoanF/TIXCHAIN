package com.tixchain.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String tokenId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.MINTED;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal purchasePrice;

    @Column(precision = 19, scale = 4)
    private BigDecimal resalePrice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime mintedAt = LocalDateTime.now();

    private LocalDateTime listedAt;
    private LocalDateTime soldAt;
    private LocalDateTime checkedInAt;

    public Ticket() {
    }

    public Ticket(String tokenId, Event event, User owner, BigDecimal purchasePrice) {
        this.tokenId = tokenId;
        this.event = event;
        this.owner = owner;
        this.purchasePrice = purchasePrice;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public BigDecimal getResalePrice() {
        return resalePrice;
    }

    public void setResalePrice(BigDecimal resalePrice) {
        this.resalePrice = resalePrice;
    }

    public LocalDateTime getMintedAt() {
        return mintedAt;
    }

    public LocalDateTime getListedAt() {
        return listedAt;
    }

    public void setListedAt(LocalDateTime listedAt) {
        this.listedAt = listedAt;
    }

    public LocalDateTime getSoldAt() {
        return soldAt;
    }

    public void setSoldAt(LocalDateTime soldAt) {
        this.soldAt = soldAt;
    }

    public LocalDateTime getCheckedInAt() {
        return checkedInAt;
    }

    public void setCheckedInAt(LocalDateTime checkedInAt) {
        this.checkedInAt = checkedInAt;
    }

    // Domain methods
    public boolean validateForResale(BigDecimal proposedPrice) {
        if (status != TicketStatus.MINTED)
            return false;
        if (event.getEventDate().isBefore(LocalDateTime.now().plusDays(7)))
            return false;
        return proposedPrice.compareTo(event.calculateMaxResalePrice()) <= 0;
    }

    public String calculateQRHash() {
        long timeBucket = System.currentTimeMillis() / 15_000;
        String raw = tokenId + ":" + id + ":" + timeBucket;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    public void markAsUsed() {
        this.status = TicketStatus.USED;
        this.checkedInAt = LocalDateTime.now();
    }
}
