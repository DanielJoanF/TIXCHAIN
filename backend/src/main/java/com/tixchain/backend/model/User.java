package com.tixchain.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String walletAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.FAN;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ticket> tickets = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {
    }

    public User(String walletAddress, Role role) {
        this.walletAddress = walletAddress;
        this.role = role;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Domain methods
    public boolean canPurchase(Event event) {
        if (!event.checkAvailability())
            return false;
        long owned = tickets.stream()
                .filter(t -> t.getEvent().getId().equals(event.getId()))
                .filter(t -> t.getStatus() == TicketStatus.MINTED || t.getStatus() == TicketStatus.SOLD)
                .count();
        return owned < 2;
    }

    public List<Ticket> getActiveTickets() {
        return tickets.stream()
                .filter(t -> t.getStatus() != TicketStatus.EXPIRED && t.getStatus() != TicketStatus.USED)
                .collect(Collectors.toList());
    }
}
