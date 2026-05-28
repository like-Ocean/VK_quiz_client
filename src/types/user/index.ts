export interface AuthUser {
  name: string;
  email: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  created_at: string;
}
