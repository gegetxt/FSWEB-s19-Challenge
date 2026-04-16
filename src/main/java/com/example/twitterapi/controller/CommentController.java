package com.example.twitterapi.controller;

import com.example.twitterapi.dto.request.CommentCreateRequest;
import com.example.twitterapi.dto.request.CommentUpdateRequest;
import com.example.twitterapi.dto.response.CommentResponse;
import com.example.twitterapi.dto.response.MessageResponse;
import com.example.twitterapi.service.CommentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentCreateRequest request,
                                                         Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(commentService.createComment(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByTweetId(@RequestParam Long tweetId) {
        return ResponseEntity.ok(commentService.getCommentsByTweetId(tweetId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long id,
                                                         @Valid @RequestBody CommentUpdateRequest request,
                                                         Authentication authentication) {
        return ResponseEntity.ok(commentService.updateComment(id, authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteComment(@PathVariable Long id, Authentication authentication) {
        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Comment deleted successfully"));
    }
}
