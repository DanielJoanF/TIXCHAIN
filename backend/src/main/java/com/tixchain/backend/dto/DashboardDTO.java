package com.tixchain.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardDTO {
    private Long totalTicketsSold;
    private BigDecimal totalRevenue;
    private BigDecimal royaltyEarnings;
    private Map<String, Long> salesByDate;
    private Map<String, Long> demographicsByCity;

    public DashboardDTO() {
    }

    public DashboardDTO(Long totalTicketsSold, BigDecimal totalRevenue, BigDecimal royaltyEarnings,
            Map<String, Long> salesByDate, Map<String, Long> demographicsByCity) {
        this.totalTicketsSold = totalTicketsSold;
        this.totalRevenue = totalRevenue;
        this.royaltyEarnings = royaltyEarnings;
        this.salesByDate = salesByDate;
        this.demographicsByCity = demographicsByCity;
    }

    public Long getTotalTicketsSold() {
        return totalTicketsSold;
    }

    public void setTotalTicketsSold(Long t) {
        this.totalTicketsSold = t;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal r) {
        this.totalRevenue = r;
    }

    public BigDecimal getRoyaltyEarnings() {
        return royaltyEarnings;
    }

    public void setRoyaltyEarnings(BigDecimal r) {
        this.royaltyEarnings = r;
    }

    public Map<String, Long> getSalesByDate() {
        return salesByDate;
    }

    public void setSalesByDate(Map<String, Long> s) {
        this.salesByDate = s;
    }

    public Map<String, Long> getDemographicsByCity() {
        return demographicsByCity;
    }

    public void setDemographicsByCity(Map<String, Long> d) {
        this.demographicsByCity = d;
    }
}
