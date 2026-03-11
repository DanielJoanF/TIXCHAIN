package com.tixchain.backend.service;

import com.tixchain.backend.dto.DashboardDTO;
import com.tixchain.backend.model.TransactionType;
import com.tixchain.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PromoterDashboardService {

    private final TransactionRepository transactionRepository;

    public PromoterDashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public DashboardDTO getSalesAnalytics(Long promoterId) {
        BigDecimal totalRevenue = transactionRepository.sumAmountByTypeAndToUser(TransactionType.PRIMARY_PURCHASE,
                promoterId);
        Map<String, Long> salesByDate = new HashMap<>();
        salesByDate.put("2026-10-01", 25L);
        salesByDate.put("2026-10-02", 30L);
        salesByDate.put("2026-10-03", 45L);
        return new DashboardDTO(100L, totalRevenue, BigDecimal.ZERO, salesByDate, null);
    }

    public BigDecimal getRoyaltyEarnings(Long promoterId) {
        return transactionRepository.sumAmountByTypeAndToUser(TransactionType.ROYALTY, promoterId);
    }

    public Map<String, Long> getDemographics(Long eventId) {
        Map<String, Long> demographics = new HashMap<>();
        demographics.put("Jakarta", 120L);
        demographics.put("Bandung", 45L);
        demographics.put("Surabaya", 30L);
        return demographics;
    }
}
