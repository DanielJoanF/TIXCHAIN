package com.tixchain.backend.controller;

import com.tixchain.backend.dto.*;
import com.tixchain.backend.model.Ticket;
import com.tixchain.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/mint")
    public ResponseEntity<Map<String, Object>> mintTicket(@Valid @RequestBody MintRequestDTO dto) {
        Ticket ticket = ticketService.mintTicket(dto.getEventId(), dto.getWalletAddress());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "ticketId", ticket.getId(), "tokenId", ticket.getTokenId(), "status", ticket.getStatus().name()));
    }

    @PostMapping("/{id}/resale")
    public ResponseEntity<Map<String, Object>> listForResale(@PathVariable Long id,
            @Valid @RequestBody ResaleRequestDTO dto) {
        Ticket ticket = ticketService.listForResale(id, dto.getPrice());
        return ResponseEntity.ok(Map.of("ticketId", ticket.getId(), "status", ticket.getStatus().name(), "resalePrice",
                ticket.getResalePrice()));
    }

    @PostMapping("/{id}/buy")
    public ResponseEntity<Map<String, Object>> buyResaleTicket(@PathVariable Long id,
            @Valid @RequestBody BuyResaleRequestDTO dto) {
        Ticket ticket = ticketService.purchaseResale(id, dto.getBuyerWalletAddress());
        return ResponseEntity.ok(Map.of("ticketId", ticket.getId(), "newOwner", ticket.getOwner().getWalletAddress(),
                "status", ticket.getStatus().name()));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<Map<String, String>> getQRData(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.generateQR(id));
    }
}
