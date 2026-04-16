package com.example.twitterapi.service;

public interface RetweetService {

    void retweet(Long tweetId, String username);

    void deleteRetweet(Long tweetId, String username);
}
