package com.tixchain.backend.repository;

import com.tixchain.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByIsActiveTrueAndAvailableTicketsGreaterThanOrderByEventDateAsc(int minAvailable);

    List<Event> findByEventDateAfterAndIsActiveTrue(LocalDateTime now);

    default List<Event> findActiveEvents() {
        return findByIsActiveTrueAndAvailableTicketsGreaterThanOrderByEventDateAsc(0);
    }
}
