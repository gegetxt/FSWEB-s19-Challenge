package com.example.twitterapi.controller;

import com.example.twitterapi.dto.request.LikeRequest;
import com.example.twitterapi.dto.response.MessageResponse;
import com.example.twitterapi.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/like")
    public ResponseEntity<MessageResponse> likeTweet(@Valid @RequestBody LikeRequest request,
                                                     Authentication authentication) {
        likeService.likeTweet(request.getTweetId(), authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Tweet liked successfully"));
    }

    @PostMapping("/dislike")
    public ResponseEntity<MessageResponse> dislikeTweet(@Valid @RequestBody LikeRequest request,
                                                        Authentication authentication) {
        likeService.dislikeTweet(request.getTweetId(), authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Like removed successfully"));
    }
}
