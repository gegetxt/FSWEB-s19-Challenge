package com.example.twitterapi.controller;

import com.example.twitterapi.dto.request.TweetCreateRequest;
import com.example.twitterapi.dto.request.TweetUpdateRequest;
import com.example.twitterapi.dto.response.MessageResponse;
import com.example.twitterapi.dto.response.TweetResponse;
import com.example.twitterapi.service.TweetService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tweet")
public class TweetController {

    private final TweetService tweetService;

    public TweetController(TweetService tweetService) {
        this.tweetService = tweetService;
    }

    @PostMapping
    public ResponseEntity<TweetResponse> createTweet(@Valid @RequestBody TweetCreateRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(tweetService.createTweet(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<TweetResponse>> getAllTweets() {
        return ResponseEntity.ok(tweetService.getAllTweets());
    }

    @GetMapping("/findByUserId")
    public ResponseEntity<List<TweetResponse>> getTweetsByUserId(@RequestParam Long userId) {
        return ResponseEntity.ok(tweetService.getTweetsByUserId(userId));
    }

    @GetMapping("/findById")
    public ResponseEntity<TweetResponse> getTweetById(@RequestParam Long id) {
        return ResponseEntity.ok(tweetService.getTweetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TweetResponse> updateTweet(@PathVariable Long id,
                                                     @Valid @RequestBody TweetUpdateRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.ok(tweetService.updateTweet(id, authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTweet(@PathVariable Long id, Authentication authentication) {
        tweetService.deleteTweet(id, authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Tweet deleted successfully"));
    }
}
