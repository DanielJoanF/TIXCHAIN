package com.tixchain.backend.controller;

import com.tixchain.backend.dto.AuthRequestDTO;
import com.tixchain.backend.dto.AuthResponseDTO;
import com.tixchain.backend.model.Role;
import com.tixchain.backend.model.User;
import com.tixchain.backend.repository.UserRepository;
import com.tixchain.backend.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/wallet")
    public ResponseEntity<AuthResponseDTO> authenticateWallet(@Valid @RequestBody AuthRequestDTO dto) {
        User user = userRepository.findByWalletAddress(dto.getWalletAddress())
                .orElseGet(() -> {
                    User newUser = new User(dto.getWalletAddress(), Role.FAN);
                    return userRepository.save(newUser);
                });

        String token = jwtUtils.generateToken(user.getWalletAddress(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponseDTO(token, user.getWalletAddress(), user.getRole().name()));
    }
}
