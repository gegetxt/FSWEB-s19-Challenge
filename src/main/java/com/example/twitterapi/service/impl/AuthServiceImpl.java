package com.example.twitterapi.service.impl;

import com.example.twitterapi.dto.request.LoginRequest;
import com.example.twitterapi.dto.request.RegisterRequest;
import com.example.twitterapi.dto.response.AuthResponse;
import com.example.twitterapi.entity.Role;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.exception.BusinessException;
import com.example.twitterapi.repository.UserRepository;
import com.example.twitterapi.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);

        User savedUser = userRepository.save(user);
        return new AuthResponse("User registered successfully", savedUser.getUsername(), savedUser.getId());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new BusinessException("User not found"));
        return new AuthResponse("Login successful", user.getUsername(), user.getId());
    }
}
