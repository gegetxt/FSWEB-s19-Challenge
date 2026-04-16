package com.example.twitterapi.dto.request;

import jakarta.validation.constraints.NotNull;

public class LikeRequest {

    @NotNull
    private Long tweetId;

    public Long getTweetId() {
        return tweetId;
    }

    public void setTweetId(Long tweetId) {
        this.tweetId = tweetId;
    }
}
