import { User, SignInData, SignUpData } from "@/types/user";

export const auth = {
  async signIn(data: SignInData): Promise<User> {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${baseURL}/api/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Signin failed");
    }

    const result = await response.json();
    const { token, user } = result;

    // Store token and user in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  async signUp(data: SignUpData): Promise<User> {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${baseURL}/api/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Signup failed");
    }

    const result = await response.json();
    return result.user;
  },

  async signOut(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },
};
