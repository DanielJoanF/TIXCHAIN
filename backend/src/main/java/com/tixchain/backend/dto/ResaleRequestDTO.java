package com.tixchain.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ResaleRequestDTO {
    @NotNull
    @DecimalMin(value = "0.01", message = "Resale price must be positive")
    private BigDecimal price;

    public ResaleRequestDTO() {
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal p) {
        this.price = p;
    }
}
