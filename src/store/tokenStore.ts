const REFRESH_TOKEN_KEY = "quizmaster_refresh_token";

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: { access_token: string; refresh_token: string }) {
  setAccessToken(tokens.access_token);
  setRefreshToken(tokens.refresh_token);
}

export function clearTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}

export function hasRefreshToken() {
  return Boolean(getRefreshToken());
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}


export function setGuestToken(token: string) {
  localStorage.setItem("guest_token", token);
}

export function getGuestToken(): string | null {
  return localStorage.getItem("guest_token");
}

export function clearGuestToken() {
  localStorage.removeItem("guest_token");
}