import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, fetchMyHistory, fetchMyQuizzes, updateMe } from "@/api/users";
import { hasRefreshToken } from "@/store/tokenStore";
import type { ChangePasswordRequest, UserUpdateRequest } from "@/types/user";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserUpdateRequest) => updateMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
  });
}

export function useMyQuizzes() {
  return useQuery({
    queryKey: ["me", "quizzes"],
    queryFn: fetchMyQuizzes,
    enabled: hasRefreshToken(),
  });
}

export function useMyHistory() {
  return useQuery({
    queryKey: ["me", "history"],
    queryFn: fetchMyHistory,
    enabled: hasRefreshToken(),
  });
}
