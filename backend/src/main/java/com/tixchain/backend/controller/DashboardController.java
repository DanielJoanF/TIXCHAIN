package com.tixchain.backend.controller;

import com.tixchain.backend.dto.DashboardDTO;
import com.tixchain.backend.service.PromoterDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final PromoterDashboardService dashboardService;

    public DashboardController(PromoterDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/promoter")
    @PreAuthorize("hasRole('PROMOTER') or hasRole('ADMIN')")
    public ResponseEntity<DashboardDTO> getPromoterDashboard(@RequestParam Long promoterId) {
        return ResponseEntity.ok(dashboardService.getSalesAnalytics(promoterId));
    }

    @GetMapping("/promoter/royalties")
    @PreAuthorize("hasRole('PROMOTER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, BigDecimal>> getRoyalties(@RequestParam Long promoterId) {
        return ResponseEntity.ok(Map.of("totalRoyaltyEarnings", dashboardService.getRoyaltyEarnings(promoterId)));
    }

    @GetMapping("/promoter/demographics")
    @PreAuthorize("hasRole('PROMOTER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getDemographics(@RequestParam Long eventId) {
        return ResponseEntity.ok(dashboardService.getDemographics(eventId));
    }
}
