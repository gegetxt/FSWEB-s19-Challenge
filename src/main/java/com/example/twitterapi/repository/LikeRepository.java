package com.example.twitterapi.repository;

import com.example.twitterapi.entity.Like;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {

    boolean existsByUserIdAndTweetId(Long userId, Long tweetId);

    Optional<Like> findByUserIdAndTweetId(Long userId, Long tweetId);
}
