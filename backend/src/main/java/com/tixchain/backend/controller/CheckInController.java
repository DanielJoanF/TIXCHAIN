package com.tixchain.backend.controller;

import com.tixchain.backend.dto.CheckInRequestDTO;
import com.tixchain.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    private final TicketService ticketService;

    public CheckInController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROMOTER')")
    public ResponseEntity<Map<String, Object>> verifyCheckIn(@Valid @RequestBody CheckInRequestDTO dto) {
        boolean verified = ticketService.verifyCheckIn(dto.getTicketId(), dto.getQrData());
        return ResponseEntity.ok(Map.of("verified", verified, "ticketId", dto.getTicketId(),
                "message", verified ? "Check-in successful" : "Invalid QR code"));
    }
}
