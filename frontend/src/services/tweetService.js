import { request } from './apiClient';

export function createTweet(body, auth) {
  return request('/tweet', {
    method: 'POST',
    body,
    auth
  });
}

export function getAllTweets(auth) {
  return request('/tweet', {
    auth
  });
}

export function getTweetsByUserId(userId, auth) {
  return request(`/tweet/findByUserId?userId=${userId}`, {
    auth
  });
}

export function getTweetById(tweetId, auth) {
  return request(`/tweet/findById?id=${tweetId}`, {
    auth
  });
}

export function updateTweet(tweetId, body, auth) {
  return request(`/tweet/${tweetId}`, {
    method: 'PUT',
    body,
    auth
  });
}

export function deleteTweet(tweetId, auth) {
  return request(`/tweet/${tweetId}`, {
    method: 'DELETE',
    auth
  });
}
