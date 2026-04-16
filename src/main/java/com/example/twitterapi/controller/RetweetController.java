package com.example.twitterapi.controller;

import com.example.twitterapi.dto.request.RetweetRequest;
import com.example.twitterapi.dto.response.MessageResponse;
import com.example.twitterapi.service.RetweetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/retweet")
public class RetweetController {

    private final RetweetService retweetService;

    public RetweetController(RetweetService retweetService) {
        this.retweetService = retweetService;
    }

    @PostMapping
    public ResponseEntity<MessageResponse> retweet(@Valid @RequestBody RetweetRequest request,
                                                   Authentication authentication) {
        retweetService.retweet(request.getTweetId(), authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Tweet retweeted successfully"));
    }

    @DeleteMapping("/{tweetId}")
    public ResponseEntity<MessageResponse> deleteRetweet(@PathVariable Long tweetId, Authentication authentication) {
        retweetService.deleteRetweet(tweetId, authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Retweet deleted successfully"));
    }
}
