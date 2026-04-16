const API_BASE_URL = 'http://localhost:3000';

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.auth ? buildBasicAuthHeader(options.auth) : {}),
      ...(options.headers ?? {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
}

function buildBasicAuthHeader(auth) {
  return {
    Authorization: `Basic ${window.btoa(`${auth.username}:${auth.password}`)}`
  };
}

async function readJson(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
