package com.example.twitterapi.repository;

import com.example.twitterapi.entity.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTweetIdOrderByCreatedAtAsc(Long tweetId);
}
