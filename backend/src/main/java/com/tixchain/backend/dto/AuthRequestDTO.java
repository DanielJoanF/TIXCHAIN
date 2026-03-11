package com.tixchain.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthRequestDTO {
    @NotBlank(message = "Wallet address is required")
    private String walletAddress;
    @NotBlank(message = "Signature is required")
    private String signature;
    @NotBlank(message = "Original message is required")
    private String message;

    public AuthRequestDTO() {
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String w) {
        this.walletAddress = w;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String s) {
        this.signature = s;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String m) {
        this.message = m;
    }
}
