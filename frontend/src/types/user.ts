export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'farmer' | 'admin' | 'expert';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role: 'farmer' | 'admin' | 'expert';
}
