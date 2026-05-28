import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/api/users";
import { hasRefreshToken } from "@/lib/tokenStore";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: hasRefreshToken(),
  });
}
