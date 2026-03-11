package com.tixchain.backend.repository;

import com.tixchain.backend.model.Transaction;
import com.tixchain.backend.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByFromUserIdOrToUserIdOrderByCreatedAtDesc(Long fromUserId, Long toUserId);

    List<Transaction> findByTicketEventIdOrderByCreatedAtDesc(Long eventId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.type = :type AND t.toUser.id = :userId")
    BigDecimal sumAmountByTypeAndToUser(@Param("type") TransactionType type, @Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.ticket.event.id = :eventId AND t.type = 'PRIMARY_PURCHASE'")
    long countPrimarySalesByEvent(@Param("eventId") Long eventId);
}
