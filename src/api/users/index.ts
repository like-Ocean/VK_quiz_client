import { api } from "@/api/client";
import type { UserResponse } from "@/types/api";

export async function fetchMe() {
  const response = await api.get<UserResponse>("/users/me");
  return response.data;
}
