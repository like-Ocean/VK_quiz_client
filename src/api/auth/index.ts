import { api, authApi } from "@/api/client";
import type { LoginRequest, RefreshTokenRequest, RegisterRequest, TokenResponse } from "@/types/auth";

export async function login(payload: LoginRequest) {
  const response = await authApi.post<TokenResponse>("/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterRequest) {
  const response = await authApi.post<TokenResponse>("/auth/register", payload);
  return response.data;
}

export async function refresh(payload: RefreshTokenRequest) {
  const response = await authApi.post<TokenResponse>("/auth/refresh", payload);
  return response.data;
}

export async function logout() {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
}
