import { request } from './apiClient';

export function getUserByUsername(username, auth) {
  return request(`/user/findByUsername?username=${encodeURIComponent(username)}`, {
    auth
  });
}
