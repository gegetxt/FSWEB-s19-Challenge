package com.example.twitterapi.repository;

import com.example.twitterapi.entity.Tweet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TweetRepository extends JpaRepository<Tweet, Long> {

    List<Tweet> findAllByOrderByCreatedAtDesc();

    List<Tweet> findByUserIdOrderByCreatedAtDesc(Long userId);
}
