package com.tixchain.backend.dto;

public class AuthResponseDTO {
    private String token;
    private String walletAddress;
    private String role;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(String token, String walletAddress, String role) {
        this.token = token;
        this.walletAddress = walletAddress;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String t) {
        this.token = t;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String w) {
        this.walletAddress = w;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String r) {
        this.role = r;
    }
}
