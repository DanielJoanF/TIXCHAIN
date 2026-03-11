package com.tixchain.backend.service;

import com.tixchain.backend.model.*;
import com.tixchain.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class TicketService {

        private final TicketRepository ticketRepository;
        private final EventRepository eventRepository;
        private final UserRepository userRepository;
        private final TransactionRepository transactionRepository;
        private final BlockchainService blockchainService;

        public TicketService(TicketRepository ticketRepository, EventRepository eventRepository,
                        UserRepository userRepository, TransactionRepository transactionRepository,
                        BlockchainService blockchainService) {
                this.ticketRepository = ticketRepository;
                this.eventRepository = eventRepository;
                this.userRepository = userRepository;
                this.transactionRepository = transactionRepository;
                this.blockchainService = blockchainService;
        }

        @Transactional
        public Ticket mintTicket(Long eventId, String walletAddress) {
                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new RuntimeException("Event not found"));
                User user = userRepository.findByWalletAddress(walletAddress)
                                .orElseThrow(() -> new RuntimeException("User not found for wallet: " + walletAddress));

                if (!event.checkAvailability())
                        throw new RuntimeException("No tickets available for this event");
                if (!user.canPurchase(event))
                        throw new RuntimeException("Purchase limit reached (max 2 tickets per wallet per event)");

                String tokenId = blockchainService.mintNFT(event.getContractAddress(), walletAddress,
                                event.getOriginalPrice());

                Ticket ticket = new Ticket(tokenId, event, user, event.getOriginalPrice());
                event.setAvailableTickets(event.getAvailableTickets() - 1);
                eventRepository.save(event);
                Ticket saved = ticketRepository.save(ticket);

                Transaction tx = new Transaction(TransactionType.PRIMARY_PURCHASE, blockchainService.getLastTxHash(),
                                event.getOriginalPrice(), null, user, saved);
                transactionRepository.save(tx);
                return saved;
        }

        @Transactional
        public Ticket listForResale(Long ticketId, BigDecimal price) {
                Ticket ticket = ticketRepository.findById(ticketId)
                                .orElseThrow(() -> new RuntimeException("Ticket not found"));
                if (!ticket.validateForResale(price)) {
                        throw new RuntimeException(
                                        "Cannot list for resale. Either event < 7 days, ticket not MINTED, or price exceeds 110% cap.");
                }
                ticket.setStatus(TicketStatus.LISTED_FOR_SALE);
                ticket.setResalePrice(price);
                ticket.setListedAt(LocalDateTime.now());
                return ticketRepository.save(ticket);
        }

        @Transactional
        public Ticket purchaseResale(Long ticketId, String buyerWallet) {
                Ticket ticket = ticketRepository.findById(ticketId)
                                .orElseThrow(() -> new RuntimeException("Ticket not found"));
                if (ticket.getStatus() != TicketStatus.LISTED_FOR_SALE)
                        throw new RuntimeException("Ticket is not listed for sale");

                User buyer = userRepository.findByWalletAddress(buyerWallet)
                                .orElseThrow(() -> new RuntimeException("Buyer wallet not registered"));
                User seller = ticket.getOwner();

                blockchainService.transferWithEscrow(ticket.getEvent().getContractAddress(), ticket.getTokenId(),
                                seller.getWalletAddress(), buyerWallet, ticket.getResalePrice());

                ticket.setOwner(buyer);
                ticket.setStatus(TicketStatus.SOLD);
                ticket.setSoldAt(LocalDateTime.now());
                Ticket saved = ticketRepository.save(ticket);

                Transaction tx = new Transaction(TransactionType.SECONDARY_SALE, blockchainService.getLastTxHash(),
                                ticket.getResalePrice(), seller, buyer, saved);
                transactionRepository.save(tx);
                return saved;
        }

        public Map<String, String> generateQR(Long ticketId) {
                Ticket ticket = ticketRepository.findById(ticketId)
                                .orElseThrow(() -> new RuntimeException("Ticket not found"));
                Map<String, String> qrData = new HashMap<>();
                qrData.put("ticketId", ticket.getId().toString());
                qrData.put("tokenId", ticket.getTokenId());
                qrData.put("hash", ticket.calculateQRHash());
                qrData.put("eventName", ticket.getEvent().getName());
                return qrData;
        }

        @Transactional
        public boolean verifyCheckIn(Long ticketId, String qrData) {
                Ticket ticket = ticketRepository.findById(ticketId)
                                .orElseThrow(() -> new RuntimeException("Ticket not found"));
                if (ticket.getStatus() == TicketStatus.USED)
                        throw new RuntimeException("Ticket has already been used");
                if (ticket.getStatus() == TicketStatus.EXPIRED)
                        throw new RuntimeException("Ticket has expired");

                String expectedHash = ticket.calculateQRHash();
                if (!expectedHash.equals(qrData))
                        return false;

                ticket.markAsUsed();
                ticketRepository.save(ticket);
                return true;
        }
}
