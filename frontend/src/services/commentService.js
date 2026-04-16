import { request } from './apiClient';

export function getCommentsByTweetId(tweetId, auth) {
  // Backend controller currently exposes GET /comment?tweetId=...
  return request(`/comment?tweetId=${tweetId}`, {
    auth
  });
}

export function createComment(body, auth) {
  return request('/comment', {
    method: 'POST',
    body,
    auth
  });
}

export function updateComment(commentId, body, auth) {
  return request(`/comment/${commentId}`, {
    method: 'PUT',
    body,
    auth
  });
}

export function deleteComment(commentId, auth) {
  return request(`/comment/${commentId}`, {
    method: 'DELETE',
    auth
  });
}
