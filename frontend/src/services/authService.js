import { request } from './apiClient';

export function register(body) {
  return request('/register', {
    method: 'POST',
    body
  });
}

export function login(body) {
  return request('/login', {
    method: 'POST',
    body
  });
}
