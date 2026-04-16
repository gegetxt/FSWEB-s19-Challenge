package com.example.twitterapi.service;

import com.example.twitterapi.entity.User;

public interface UserService {

    User getByUsername(String username);

    User getById(Long id);
}
