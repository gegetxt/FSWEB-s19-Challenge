package com.example.twitterapi.service;

import com.example.twitterapi.dto.request.TweetCreateRequest;
import com.example.twitterapi.dto.request.TweetUpdateRequest;
import com.example.twitterapi.dto.response.TweetResponse;
import java.util.List;

public interface TweetService {

    TweetResponse createTweet(String username, TweetCreateRequest request);

    List<TweetResponse> getAllTweets();

    List<TweetResponse> getTweetsByUserId(Long userId);

    TweetResponse getTweetById(Long id);

    TweetResponse updateTweet(Long id, String username, TweetUpdateRequest request);

    void deleteTweet(Long id, String username);
}
