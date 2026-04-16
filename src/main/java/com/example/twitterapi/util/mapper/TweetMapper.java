package com.example.twitterapi.util.mapper;

import com.example.twitterapi.dto.response.TweetResponse;
import com.example.twitterapi.entity.Tweet;
import org.springframework.stereotype.Component;

@Component
public class TweetMapper {

    public TweetResponse toResponse(Tweet tweet) {
        TweetResponse response = new TweetResponse();
        response.setId(tweet.getId());
        response.setUserId(tweet.getUser().getId());
        response.setUsername(tweet.getUser().getUsername());
        response.setContent(tweet.getContent());
        response.setCreatedAt(tweet.getCreatedAt());
        response.setUpdatedAt(tweet.getUpdatedAt());
        return response;
    }
}
