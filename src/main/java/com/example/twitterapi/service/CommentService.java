package com.example.twitterapi.service;

import com.example.twitterapi.dto.request.CommentCreateRequest;
import com.example.twitterapi.dto.request.CommentUpdateRequest;
import com.example.twitterapi.dto.response.CommentResponse;
import java.util.List;

public interface CommentService {

    CommentResponse createComment(String username, CommentCreateRequest request);

    CommentResponse updateComment(Long id, String username, CommentUpdateRequest request);

    void deleteComment(Long id, String username);

    List<CommentResponse> getCommentsByTweetId(Long tweetId);
}
