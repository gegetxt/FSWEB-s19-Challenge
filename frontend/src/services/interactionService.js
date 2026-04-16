import { request } from './apiClient';

export function likeTweet(tweetId, auth) {
  return request('/like', {
    method: 'POST',
    body: { tweetId },
    auth
  });
}

export function dislikeTweet(tweetId, auth) {
  return request('/dislike', {
    method: 'POST',
    body: { tweetId },
    auth
  });
}

export function retweetTweet(tweetId, auth) {
  return request('/retweet', {
    method: 'POST',
    body: { tweetId },
    auth
  });
}

export function removeRetweet(tweetId, auth) {
  return request(`/retweet/${tweetId}`, {
    method: 'DELETE',
    auth
  });
}
