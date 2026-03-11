package com.tixchain.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckInRequestDTO {
    @NotBlank(message = "QR data is required")
    private String qrData;
    private Long ticketId;

    public CheckInRequestDTO() {
    }

    public String getQrData() {
        return qrData;
    }

    public void setQrData(String q) {
        this.qrData = q;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long t) {
        this.ticketId = t;
    }
}
