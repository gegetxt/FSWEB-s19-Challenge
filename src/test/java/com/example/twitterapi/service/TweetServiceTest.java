package com.example.twitterapi.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.twitterapi.dto.request.TweetCreateRequest;
import com.example.twitterapi.dto.request.TweetUpdateRequest;
import com.example.twitterapi.entity.Role;
import com.example.twitterapi.entity.Tweet;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.exception.UnauthorizedActionException;
import com.example.twitterapi.repository.TweetRepository;
import com.example.twitterapi.service.impl.TweetServiceImpl;
import com.example.twitterapi.util.mapper.TweetMapper;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TweetServiceTest {

    @Mock
    private TweetRepository tweetRepository;

    @Mock
    private UserService userService;

    @Mock
    private TweetMapper tweetMapper;

    @InjectMocks
    private TweetServiceImpl tweetService;

    private User user;
    private Tweet tweet;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setPasswordHash("hashed");
        user.setRole(Role.ROLE_USER);

        tweet = new Tweet();
        tweet.setId(10L);
        tweet.setUser(user);
        tweet.setContent("initial tweet");
        tweet.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createTweetShouldSaveTweet() {
        TweetCreateRequest request = new TweetCreateRequest();
        request.setContent("hello world");

        when(userService.getByUsername("alice")).thenReturn(user);
        when(tweetRepository.save(any(Tweet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        tweetService.createTweet("alice", request);

        verify(tweetRepository).save(any(Tweet.class));
    }

    @Test
    void updateTweetShouldThrowWhenUserIsNotOwner() {
        TweetUpdateRequest request = new TweetUpdateRequest();
        request.setContent("updated");

        when(tweetRepository.findById(10L)).thenReturn(Optional.of(tweet));

        assertThrows(UnauthorizedActionException.class,
            () -> tweetService.updateTweet(10L, "bob", request));
    }

    @Test
    void deleteTweetShouldDeleteWhenOwnerMatches() {
        when(tweetRepository.findById(10L)).thenReturn(Optional.of(tweet));

        tweetService.deleteTweet(10L, "alice");

        verify(tweetRepository).delete(tweet);
    }
}
