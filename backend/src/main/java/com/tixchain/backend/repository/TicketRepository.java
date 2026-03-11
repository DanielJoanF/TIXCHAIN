package com.tixchain.backend.repository;

import com.tixchain.backend.model.Ticket;
import com.tixchain.backend.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByOwnerIdAndStatusIn(Long ownerId, List<TicketStatus> statuses);

    List<Ticket> findByEventIdAndOwnerId(Long eventId, Long ownerId);

    List<Ticket> findByStatus(TicketStatus status);

    Optional<Ticket> findByTokenId(String tokenId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.event.id = :eventId AND t.owner.id = :ownerId " +
            "AND t.status IN ('MINTED', 'SOLD')")
    long countActiveTicketsByEventAndOwner(@Param("eventId") Long eventId, @Param("ownerId") Long ownerId);

    @Query("SELECT t FROM Ticket t WHERE t.status = 'LISTED_FOR_SALE' ORDER BY t.listedAt DESC")
    List<Ticket> findAllListedForSale();
}
