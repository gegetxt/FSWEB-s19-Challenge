package com.example.twitterapi.service.impl;

import com.example.twitterapi.dto.request.TweetCreateRequest;
import com.example.twitterapi.dto.request.TweetUpdateRequest;
import com.example.twitterapi.dto.response.TweetResponse;
import com.example.twitterapi.entity.Tweet;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.exception.ResourceNotFoundException;
import com.example.twitterapi.exception.UnauthorizedActionException;
import com.example.twitterapi.repository.TweetRepository;
import com.example.twitterapi.service.TweetService;
import com.example.twitterapi.service.UserService;
import com.example.twitterapi.util.mapper.TweetMapper;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TweetServiceImpl implements TweetService {

    private final TweetRepository tweetRepository;
    private final UserService userService;
    private final TweetMapper tweetMapper;

    public TweetServiceImpl(TweetRepository tweetRepository, UserService userService, TweetMapper tweetMapper) {
        this.tweetRepository = tweetRepository;
        this.userService = userService;
        this.tweetMapper = tweetMapper;
    }

    @Override
    public TweetResponse createTweet(String username, TweetCreateRequest request) {
        User user = userService.getByUsername(username);

        Tweet tweet = new Tweet();
        tweet.setUser(user);
        tweet.setContent(request.getContent());

        return tweetMapper.toResponse(tweetRepository.save(tweet));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TweetResponse> getAllTweets() {
        return tweetRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(tweetMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TweetResponse> getTweetsByUserId(Long userId) {
        return tweetRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(tweetMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TweetResponse getTweetById(Long id) {
        return tweetMapper.toResponse(findTweet(id));
    }

    @Override
    public TweetResponse updateTweet(Long id, String username, TweetUpdateRequest request) {
        Tweet tweet = findTweet(id);
        validateOwner(tweet.getUser().getUsername(), username);
        tweet.setContent(request.getContent());
        return tweetMapper.toResponse(tweetRepository.save(tweet));
    }

    @Override
    public void deleteTweet(Long id, String username) {
        Tweet tweet = findTweet(id);
        validateOwner(tweet.getUser().getUsername(), username);
        tweetRepository.delete(tweet);
    }

    private Tweet findTweet(Long id) {
        return tweetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tweet not found with id: " + id));
    }

    private void validateOwner(String ownerUsername, String currentUsername) {
        if (!ownerUsername.equals(currentUsername)) {
            throw new UnauthorizedActionException("You are not allowed to modify this tweet");
        }
    }
}
