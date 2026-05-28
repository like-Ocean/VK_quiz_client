import { api } from "@/api/client";
import type { UserResponse } from "@/types/user";

export async function fetchMe() {
  const response = await api.get<UserResponse>("/users/me");
  return response.data;
}
