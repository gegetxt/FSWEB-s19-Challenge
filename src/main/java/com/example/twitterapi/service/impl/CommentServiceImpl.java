package com.example.twitterapi.service.impl;

import com.example.twitterapi.dto.request.CommentCreateRequest;
import com.example.twitterapi.dto.request.CommentUpdateRequest;
import com.example.twitterapi.dto.response.CommentResponse;
import com.example.twitterapi.entity.Comment;
import com.example.twitterapi.entity.Tweet;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.exception.ResourceNotFoundException;
import com.example.twitterapi.exception.UnauthorizedActionException;
import com.example.twitterapi.repository.CommentRepository;
import com.example.twitterapi.repository.TweetRepository;
import com.example.twitterapi.service.CommentService;
import com.example.twitterapi.service.UserService;
import com.example.twitterapi.util.mapper.CommentMapper;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TweetRepository tweetRepository;
    private final UserService userService;
    private final CommentMapper commentMapper;

    public CommentServiceImpl(CommentRepository commentRepository,
                              TweetRepository tweetRepository,
                              UserService userService,
                              CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.tweetRepository = tweetRepository;
        this.userService = userService;
        this.commentMapper = commentMapper;
    }

    @Override
    public CommentResponse createComment(String username, CommentCreateRequest request) {
        User user = userService.getByUsername(username);
        Tweet tweet = findTweet(request.getTweetId());

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setTweet(tweet);
        comment.setContent(request.getContent());

        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Override
    public CommentResponse updateComment(Long id, String username, CommentUpdateRequest request) {
        Comment comment = findComment(id);
        if (!comment.getUser().getUsername().equals(username)) {
            throw new UnauthorizedActionException("You are not allowed to update this comment");
        }
        comment.setContent(request.getContent());
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Override
    public void deleteComment(Long id, String username) {
        Comment comment = findComment(id);
        String commentOwner = comment.getUser().getUsername();
        String tweetOwner = comment.getTweet().getUser().getUsername();

        if (!commentOwner.equals(username) && !tweetOwner.equals(username)) {
            throw new UnauthorizedActionException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTweetId(Long tweetId) {
        return commentRepository.findByTweetIdOrderByCreatedAtAsc(tweetId)
            .stream()
            .map(commentMapper::toResponse)
            .toList();
    }

    private Comment findComment(Long id) {
        return commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
    }

    private Tweet findTweet(Long tweetId) {
        return tweetRepository.findById(tweetId)
            .orElseThrow(() -> new ResourceNotFoundException("Tweet not found with id: " + tweetId));
    }
}
