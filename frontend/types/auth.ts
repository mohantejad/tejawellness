export type User = {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
} | null;

export type AuthState = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};