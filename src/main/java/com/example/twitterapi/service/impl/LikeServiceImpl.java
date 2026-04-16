package com.example.twitterapi.service.impl;

import com.example.twitterapi.entity.Like;
import com.example.twitterapi.entity.Tweet;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.exception.BusinessException;
import com.example.twitterapi.exception.ResourceNotFoundException;
import com.example.twitterapi.repository.LikeRepository;
import com.example.twitterapi.repository.TweetRepository;
import com.example.twitterapi.service.LikeService;
import com.example.twitterapi.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final TweetRepository tweetRepository;
    private final UserService userService;

    public LikeServiceImpl(LikeRepository likeRepository, TweetRepository tweetRepository, UserService userService) {
        this.likeRepository = likeRepository;
        this.tweetRepository = tweetRepository;
        this.userService = userService;
    }

    @Override
    public void likeTweet(Long tweetId, String username) {
        User user = userService.getByUsername(username);
        Tweet tweet = findTweet(tweetId);

        if (likeRepository.existsByUserIdAndTweetId(user.getId(), tweetId)) {
            throw new BusinessException("You already liked this tweet");
        }

        Like like = new Like();
        like.setUser(user);
        like.setTweet(tweet);
        likeRepository.save(like);
    }

    @Override
    public void dislikeTweet(Long tweetId, String username) {
        User user = userService.getByUsername(username);
        Like like = likeRepository.findByUserIdAndTweetId(user.getId(), tweetId)
            .orElseThrow(() -> new ResourceNotFoundException("Like not found for the given tweet"));
        likeRepository.delete(like);
    }

    private Tweet findTweet(Long tweetId) {
        return tweetRepository.findById(tweetId)
            .orElseThrow(() -> new ResourceNotFoundException("Tweet not found with id: " + tweetId));
    }
}
