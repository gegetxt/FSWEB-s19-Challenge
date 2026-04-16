package com.example.twitterapi.service.impl;

import com.example.twitterapi.entity.Retweet;
import com.example.twitterapi.entity.Tweet;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.exception.BusinessException;
import com.example.twitterapi.exception.ResourceNotFoundException;
import com.example.twitterapi.repository.RetweetRepository;
import com.example.twitterapi.repository.TweetRepository;
import com.example.twitterapi.service.RetweetService;
import com.example.twitterapi.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class RetweetServiceImpl implements RetweetService {

    private final RetweetRepository retweetRepository;
    private final TweetRepository tweetRepository;
    private final UserService userService;

    public RetweetServiceImpl(RetweetRepository retweetRepository,
                              TweetRepository tweetRepository,
                              UserService userService) {
        this.retweetRepository = retweetRepository;
        this.tweetRepository = tweetRepository;
        this.userService = userService;
    }

    @Override
    public void retweet(Long tweetId, String username) {
        User user = userService.getByUsername(username);
        Tweet tweet = findTweet(tweetId);

        if (retweetRepository.existsByUserIdAndTweetId(user.getId(), tweetId)) {
            throw new BusinessException("You already retweeted this tweet");
        }

        Retweet retweet = new Retweet();
        retweet.setUser(user);
        retweet.setTweet(tweet);
        retweetRepository.save(retweet);
    }

    @Override
    public void deleteRetweet(Long tweetId, String username) {
        User user = userService.getByUsername(username);
        Retweet retweet = retweetRepository.findByUserIdAndTweetId(user.getId(), tweetId)
            .orElseThrow(() -> new ResourceNotFoundException("Retweet not found for the given tweet"));
        retweetRepository.delete(retweet);
    }

    private Tweet findTweet(Long tweetId) {
        return tweetRepository.findById(tweetId)
            .orElseThrow(() -> new ResourceNotFoundException("Tweet not found with id: " + tweetId));
    }
}
