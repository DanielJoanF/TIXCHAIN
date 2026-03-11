package com.tixchain.backend.config;

import com.tixchain.backend.model.Event;
import com.tixchain.backend.repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(EventRepository eventRepository) {
        return args -> {
            if (eventRepository.count() == 0) {
                eventRepository.save(new Event("Crypto Music Festival 2026",
                        "The biggest Web3 music festival in Asia. Live performances from top global DJs with metaverse integration.",
                        LocalDateTime.of(2026, 10, 15, 19, 0),
                        new BigDecimal("650000"), 100));

                eventRepository.save(new Event("Web3 Builder Summit",
                        "A conference for blockchain developers, founders, and investors from around the world.",
                        LocalDateTime.of(2026, 11, 2, 9, 0),
                        new BigDecimal("1500000"), 200));

                eventRepository.save(new Event("NFT Art Exhibition",
                        "Explore digital art by the world's leading NFT artists in an immersive gallery experience.",
                        LocalDateTime.of(2026, 12, 10, 10, 0),
                        new BigDecimal("300000"), 150));

                eventRepository.save(new Event("Metaverse Gaming League",
                        "Asia's premier competitive gaming event with blockchain-verified prizes and achievements.",
                        LocalDateTime.of(2027, 1, 20, 14, 0),
                        new BigDecimal("500000"), 300));

                System.out.println("[DataSeeder] 4 sample events created.");
            }
        };
    }
}
