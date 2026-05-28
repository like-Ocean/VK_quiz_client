import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/api/users";
import { hasRefreshToken } from "@/store/tokenStore";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: hasRefreshToken(),
  });
}
