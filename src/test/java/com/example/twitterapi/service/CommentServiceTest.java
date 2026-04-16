package com.example.twitterapi.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.twitterapi.dto.request.CommentCreateRequest;
import com.example.twitterapi.entity.Comment;
import com.example.twitterapi.entity.Role;
import com.example.twitterapi.entity.Tweet;
import com.example.twitterapi.entity.User;
import com.example.twitterapi.exception.UnauthorizedActionException;
import com.example.twitterapi.repository.CommentRepository;
import com.example.twitterapi.repository.TweetRepository;
import com.example.twitterapi.service.impl.CommentServiceImpl;
import com.example.twitterapi.util.mapper.CommentMapper;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TweetRepository tweetRepository;

    @Mock
    private UserService userService;

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    private User tweetOwner;
    private User commentOwner;
    private Tweet tweet;
    private Comment comment;

    @BeforeEach
    void setUp() {
        tweetOwner = new User();
        tweetOwner.setId(1L);
        tweetOwner.setUsername("tweetOwner");
        tweetOwner.setRole(Role.ROLE_USER);

        commentOwner = new User();
        commentOwner.setId(2L);
        commentOwner.setUsername("commentOwner");
        commentOwner.setRole(Role.ROLE_USER);

        tweet = new Tweet();
        tweet.setId(10L);
        tweet.setUser(tweetOwner);

        comment = new Comment();
        comment.setId(20L);
        comment.setTweet(tweet);
        comment.setUser(commentOwner);
        comment.setContent("comment");
    }

    @Test
    void createCommentShouldSaveComment() {
        CommentCreateRequest request = new CommentCreateRequest();
        request.setTweetId(10L);
        request.setContent("new comment");

        when(userService.getByUsername("commentOwner")).thenReturn(commentOwner);
        when(tweetRepository.findById(10L)).thenReturn(Optional.of(tweet));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        commentService.createComment("commentOwner", request);

        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void deleteCommentShouldThrowWhenUserHasNoPermission() {
        when(commentRepository.findById(20L)).thenReturn(Optional.of(comment));

        assertThrows(UnauthorizedActionException.class,
            () -> commentService.deleteComment(20L, "outsider"));
    }

    @Test
    void deleteCommentShouldAllowTweetOwner() {
        when(commentRepository.findById(20L)).thenReturn(Optional.of(comment));

        commentService.deleteComment(20L, "tweetOwner");

        verify(commentRepository).delete(comment);
    }
}
