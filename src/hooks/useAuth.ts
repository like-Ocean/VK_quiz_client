import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, refresh, register } from "@/api/auth";
import { clearTokens, getRefreshToken, setTokens } from "@/lib/tokenStore";
import type { LoginRequest, RegisterRequest } from "@/types/api";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (tokens) => {
      setTokens(tokens);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (tokens) => {
      setTokens(tokens);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRefresh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("Missing refresh token");
      }
      return refresh({ refresh_token: refreshToken });
    },
    retry: 1,
    onSuccess: (tokens) => {
      setTokens(tokens);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      clearTokens();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      clearTokens();
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
}
