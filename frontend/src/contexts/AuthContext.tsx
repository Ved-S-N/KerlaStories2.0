import React, { createContext, useContext, useReducer, useEffect } from "react";
import { User } from "@/types/user";
import { auth } from "@/lib/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_USER"; user: User | null }
  | { type: "SIGN_OUT" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        isAuthenticated: !!action.user,
        isLoading: false,
      };
    case "SIGN_OUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing user on mount
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: "SET_LOADING", isLoading: true });
      try {
        const user = auth.getCurrentUser();
        if (user) {
          dispatch({ type: "SET_USER", user });
        } else {
          dispatch({ type: "SET_LOADING", isLoading: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
