import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/env";

// Types
type UserRole = "user" | "admin" | "business_owner";

interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: Error | null;
  isGuestMode: boolean;
  redirectPath: string | null;
}

// Action types
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: AuthUser; tokens: AuthTokens } }
  | { type: "AUTH_ERROR"; payload: Error }
  | { type: "REFRESH_TOKEN_SUCCESS"; payload: AuthTokens }
  | { type: "SET_GUEST_MODE" }
  | { type: "SIGN_OUT" }
  | { type: "SET_REDIRECT_PATH"; payload: string | null }
  | { type: "CLEAR_REDIRECT_PATH" };

// Context type
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  continueAsGuest: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  setRedirectPath: (path: string | null) => void;
  clearRedirectPath: () => void;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  error: null,
  isGuestMode: false,
  redirectPath: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
        error: null,
        isGuestMode: false,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "REFRESH_TOKEN_SUCCESS":
      return {
        ...state,
        tokens: action.payload,
        error: null,
        isLoading: false,
      };

    case "SET_GUEST_MODE":
      return {
        ...initialState,
        isGuestMode: true,
        isLoading: false,
      };

    case "SIGN_OUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "SET_REDIRECT_PATH":
      return {
        ...state,
        redirectPath: action.payload,
      };

    case "CLEAR_REDIRECT_PATH":
      return {
        ...state,
        redirectPath: null,
      };

    default:
      return state;
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Token storage helpers
  const storeTokens = async (tokens: AuthTokens) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      } else {
        await SecureStore.setItemAsync("accessToken", tokens.accessToken);
        await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
      }
      console.log("Tokens stored successfully");
    } catch (error) {
      console.error("Error storing tokens:", error);
      throw error;
    }
  };

  const removeTokens = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    } catch (error) {
      console.error("Error removing tokens:", error);
      throw error;
    }
  };

  // Session refresh
  const refreshSession = async () => {
    try {
      const refreshToken =
        Platform.OS === "web"
          ? localStorage.getItem("refreshToken")
          : await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        console.log("No refresh token found, signing out");
        await signOut();
        return;
      }

      // Try to get user info from the existing token first
      try {
        const payload = JSON.parse(atob(refreshToken.split(".")[1]));
        const user: AuthUser = {
          id: payload.id,
          email: payload.email,
          role: payload.role || "user",
        };
        console.log("user", user);
        // Use the same token if it's still valid
        const tokens: AuthTokens = {
          accessToken: refreshToken,
          refreshToken: refreshToken,
        };

        await storeTokens(tokens);
        dispatch({ type: "AUTH_SUCCESS", payload: { user, tokens } });
        return;
      } catch (e) {
        console.log("Could not parse existing token, trying refresh");
      }

      // If we can't use the existing token, try to refresh
      const response = await fetch(`${API_URL}/api/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh session");
      }

      const data = await response.json();
      const tokens: AuthTokens = {
        accessToken: data.token,
        refreshToken: data.token,
      };

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const user: AuthUser = {
        id: payload.id,
        email: payload.email,
        role: payload.role || "user",
      };

      await storeTokens(tokens);
      dispatch({ type: "AUTH_SUCCESS", payload: { user, tokens } });
    } catch (error) {
      console.error("Session refresh failed:", error);
      await signOut(); // Sign out on refresh failure
    }
  };

  // Auto refresh session
  useEffect(() => {
    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
    if (state.tokens?.accessToken) {
      const intervalId = setInterval(refreshSession, REFRESH_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [state.tokens?.accessToken]);

  // Sign in
  const signIn = async (email: string, password: string) => {
    dispatch({ type: "AUTH_START" });
    try {
      const url = `${API_URL}/api/mobile/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid response format from server");
      }

      if (!data.token) {
        throw new Error("Invalid response format: missing token");
      }

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const user: AuthUser = {
        id: payload.id,
        email: email,
        role: "user",
      };
      console.log("user", user);
      const tokens: AuthTokens = {
        accessToken: data.token,
        refreshToken: data.token,
      };

      await storeTokens(tokens);
      dispatch({ type: "AUTH_SUCCESS", payload: { user, tokens } });
    } catch (error) {
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await removeTokens();
      dispatch({ type: "SIGN_OUT" });
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error as Error });
      throw error;
    }
  };

  // Guest mode
  const continueAsGuest = () => {
    dispatch({ type: "SET_GUEST_MODE" });
  };

  // Role-based access control
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (state.isGuestMode) return false;
    if (!state.user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      business_owner: 2,
      admin: 3,
    };

    return roleHierarchy[state.user.role] >= roleHierarchy[requiredRole];
  };

  // Redirect path management
  const setRedirectPath = (path: string | null) => {
    dispatch({ type: "SET_REDIRECT_PATH", payload: path });
  };

  const clearRedirectPath = () => {
    dispatch({ type: "CLEAR_REDIRECT_PATH" });
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "AUTH_START" });
      try {
        const accessToken =
          Platform.OS === "web"
            ? localStorage.getItem("accessToken")
            : await SecureStore.getItemAsync("accessToken");

        if (accessToken) {
          await refreshSession();
        } else {
          dispatch({ type: "SIGN_OUT" });
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        dispatch({ type: "SIGN_OUT" });
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        refreshSession,
        continueAsGuest,
        hasPermission,
        setRedirectPath,
        clearRedirectPath,
      }}
    >
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
