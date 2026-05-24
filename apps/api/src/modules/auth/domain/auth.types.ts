export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  permissions: string[];
}

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}
