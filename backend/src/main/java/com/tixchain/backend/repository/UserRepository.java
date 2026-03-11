package com.tixchain.backend.repository;

import com.tixchain.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByWalletAddress(String walletAddress);

    Optional<User> findByEmail(String email);

    boolean existsByWalletAddress(String walletAddress);
}
