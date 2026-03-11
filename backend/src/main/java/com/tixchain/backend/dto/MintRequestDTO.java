package com.tixchain.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class MintRequestDTO {
    @NotBlank(message = "Wallet address is required")
    private String walletAddress;
    private Long eventId;
    private Integer quantity;

    public MintRequestDTO() {
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String w) {
        this.walletAddress = w;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long e) {
        this.eventId = e;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer q) {
        this.quantity = q;
    }
}
