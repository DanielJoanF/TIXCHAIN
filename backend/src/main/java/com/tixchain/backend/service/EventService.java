package com.tixchain.backend.service;

import com.tixchain.backend.dto.EventDTO;
import com.tixchain.backend.model.Event;
import com.tixchain.backend.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final BlockchainService blockchainService;

    public EventService(EventRepository eventRepository, BlockchainService blockchainService) {
        this.eventRepository = eventRepository;
        this.blockchainService = blockchainService;
    }

    @Transactional
    public EventDTO createEvent(EventDTO dto) {
        Event event = new Event(dto.getName(), dto.getDescription(), dto.getEventDate(),
                dto.getOriginalPrice(), dto.getTotalTickets());

        String contractAddress = blockchainService.deployTicketContract(
                event.getName(), event.getTotalTickets(), event.getOriginalPrice());
        event.setContractAddress(contractAddress);

        Event saved = eventRepository.save(event);
        return toDTO(saved);
    }

    public List<EventDTO> getActiveEvents() {
        return eventRepository.findActiveEvents().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public EventDTO getEventDetails(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        return toDTO(event);
    }

    private EventDTO toDTO(Event e) {
        return new EventDTO(e.getId(), e.getName(), e.getDescription(), e.getEventDate(),
                e.getOriginalPrice(), e.getTotalTickets(), e.getAvailableTickets(),
                e.getContractAddress(), e.getIsActive(), e.calculateMaxResalePrice());
    }
}
