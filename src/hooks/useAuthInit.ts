import { useEffect } from "react";
import { getAccessToken, hasRefreshToken } from "@/store/tokenStore";
import { useRefresh } from "@/hooks/useAuth";

export function useAuthInit() {
  const refreshMutation = useRefresh();

  useEffect(() => {
    if (!getAccessToken() && hasRefreshToken()) {
      refreshMutation.mutate();
    }
  }, [refreshMutation]);

  return {
    isRefreshing: refreshMutation.isPending,
  };
}
