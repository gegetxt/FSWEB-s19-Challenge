package com.example.twitterapi.repository;

import com.example.twitterapi.entity.Retweet;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RetweetRepository extends JpaRepository<Retweet, Long> {

    boolean existsByUserIdAndTweetId(Long userId, Long tweetId);

    Optional<Retweet> findByUserIdAndTweetId(Long userId, Long tweetId);
}
