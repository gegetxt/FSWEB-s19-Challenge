package com.example.twitterapi.service;

import com.example.twitterapi.dto.request.LoginRequest;
import com.example.twitterapi.dto.request.RegisterRequest;
import com.example.twitterapi.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
