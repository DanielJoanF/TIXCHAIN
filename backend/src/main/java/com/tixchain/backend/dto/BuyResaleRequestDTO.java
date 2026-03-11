package com.tixchain.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class BuyResaleRequestDTO {
    @NotBlank(message = "Buyer wallet address is required")
    private String buyerWalletAddress;

    public BuyResaleRequestDTO() {
    }

    public String getBuyerWalletAddress() {
        return buyerWalletAddress;
    }

    public void setBuyerWalletAddress(String w) {
        this.buyerWalletAddress = w;
    }
}
