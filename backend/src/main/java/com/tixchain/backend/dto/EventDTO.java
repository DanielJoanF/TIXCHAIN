package com.tixchain.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventDTO {
    private Long id;
    @NotBlank(message = "Event name is required")
    private String name;
    private String description;
    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDateTime eventDate;
    @NotNull
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal originalPrice;
    @NotNull
    @Min(value = 1, message = "Must have at least 1 ticket")
    private Integer totalTickets;
    private Integer availableTickets;
    private String contractAddress;
    private Boolean isActive;
    private BigDecimal maxResalePrice;

    public EventDTO() {
    }

    public EventDTO(Long id, String name, String description, LocalDateTime eventDate, BigDecimal originalPrice,
            Integer totalTickets, Integer availableTickets, String contractAddress, Boolean isActive,
            BigDecimal maxResalePrice) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.eventDate = eventDate;
        this.originalPrice = originalPrice;
        this.totalTickets = totalTickets;
        this.availableTickets = availableTickets;
        this.contractAddress = contractAddress;
        this.isActive = isActive;
        this.maxResalePrice = maxResalePrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String d) {
        this.description = d;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime d) {
        this.eventDate = d;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal p) {
        this.originalPrice = p;
    }

    public Integer getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(Integer t) {
        this.totalTickets = t;
    }

    public Integer getAvailableTickets() {
        return availableTickets;
    }

    public void setAvailableTickets(Integer a) {
        this.availableTickets = a;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String c) {
        this.contractAddress = c;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean a) {
        this.isActive = a;
    }

    public BigDecimal getMaxResalePrice() {
        return maxResalePrice;
    }

    public void setMaxResalePrice(BigDecimal m) {
        this.maxResalePrice = m;
    }
}
