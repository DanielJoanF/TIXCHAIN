package com.tixchain.backend.controller;

import com.tixchain.backend.dto.EventDTO;
import com.tixchain.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasRole('PROMOTER') or hasRole('ADMIN')")
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(dto));
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getActiveEvents() {
        return ResponseEntity.ok(eventService.getActiveEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventDetail(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventDetails(id));
    }
}
