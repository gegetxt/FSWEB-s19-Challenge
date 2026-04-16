package com.example.twitterapi.controller;

import com.example.twitterapi.dto.response.UserSummaryResponse;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/findByUsername")
    public ResponseEntity<UserSummaryResponse> getByUsername(@RequestParam String username) {
        User user = userService.getByUsername(username);
        return ResponseEntity.ok(new UserSummaryResponse(user.getId(), user.getUsername()));
    }
}
