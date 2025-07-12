import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
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
  originalPath: string | null;
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
  | { type: "CLEAR_REDIRECT_PATH" }
  | { type: "SET_ORIGINAL_PATH"; payload: string | null }
  | { type: "CLEAR_ORIGINAL_PATH" };

// Context type
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  continueAsGuest: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  setRedirectPath: (path: string | null) => void;
  clearRedirectPath: () => void;
  setOriginalPath: (path: string | null) => void;
  clearOriginalPath: () => void;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  error: null,
  isGuestMode: false,
  redirectPath: null,
  originalPath: null,
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

    case "SET_ORIGINAL_PATH":
      return {
        ...state,
        originalPath: action.payload,
      };

    case "CLEAR_ORIGINAL_PATH":
      return {
        ...state,
        originalPath: null,
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
  const isInitialized = useRef(false);

  // Token storage helpers
  const storeTokens = useCallback(async (tokens: AuthTokens) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      } else {
        await SecureStore.setItemAsync("accessToken", tokens.accessToken);
        await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const removeTokens = useCallback(async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        try {
          await SecureStore.deleteItemAsync("accessToken");
        } catch (error) {
          // Access token not found or already removed
        }
        try {
          await SecureStore.deleteItemAsync("refreshToken");
        } catch (error) {
          // Refresh token not found or already removed
        }
      }
    } catch (error) {}
  }, []);

  // Session refresh
  const refreshSession = useCallback(async () => {
    try {
      const refreshToken =
        Platform.OS === "web"
          ? localStorage.getItem("refreshToken")
          : await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        dispatch({ type: "SIGN_OUT" });
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
        // Use the same token if it's still valid
        const tokens: AuthTokens = {
          accessToken: refreshToken,
          refreshToken: refreshToken,
        };

        await storeTokens(tokens);
        dispatch({ type: "AUTH_SUCCESS", payload: { user, tokens } });
        return;
      } catch (e) {
        // Could not parse existing token, trying refresh
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
      dispatch({ type: "SIGN_OUT" });
    }
  }, [dispatch, storeTokens]);

  // Auto refresh session
  useEffect(() => {
    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
    if (state.tokens?.accessToken && !state.isLoading) {
      const intervalId = setInterval(refreshSession, REFRESH_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [state.tokens?.accessToken, state.isLoading, refreshSession]);

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string) => {
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
        const tokens: AuthTokens = {
          accessToken: data.token,
          refreshToken: data.token,
        };

        await storeTokens(tokens);
        dispatch({ type: "AUTH_SUCCESS", payload: { user, tokens } });
      } catch (error) {
        throw error;
      }
    },
    [dispatch, storeTokens]
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await removeTokens();
      dispatch({ type: "SIGN_OUT" });
    } catch (error) {
      console.error("Error during sign out:", error);
      dispatch({ type: "SIGN_OUT" });
    }
  }, [dispatch, removeTokens]);

  // Guest mode
  const continueAsGuest = useCallback(() => {
    dispatch({ type: "SET_GUEST_MODE" });
  }, [dispatch]);

  // Role-based access control
  const hasPermission = useCallback(
    (requiredRole: UserRole): boolean => {
      if (state.isGuestMode) return false;
      if (!state.user) return false;

      const roleHierarchy: Record<UserRole, number> = {
        user: 1,
        business_owner: 2,
        admin: 3,
      };

      return roleHierarchy[state.user.role] >= roleHierarchy[requiredRole];
    },
    [state.isGuestMode, state.user]
  );

  // Redirect path management
  const setRedirectPath = useCallback(
    (path: string | null) => {
      dispatch({ type: "SET_REDIRECT_PATH", payload: path });
    },
    [dispatch]
  );

  const clearRedirectPath = useCallback(() => {
    dispatch({ type: "CLEAR_REDIRECT_PATH" });
  }, [dispatch]);

  // Original path management
  const setOriginalPath = useCallback(
    (path: string | null) => {
      dispatch({ type: "SET_ORIGINAL_PATH", payload: path });
    },
    [dispatch]
  );

  const clearOriginalPath = useCallback(() => {
    dispatch({ type: "CLEAR_ORIGINAL_PATH" });
  }, [dispatch]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      dispatch({ type: "AUTH_START" });
      try {
        const accessToken =
          Platform.OS === "web"
            ? localStorage.getItem("accessToken")
            : await SecureStore.getItemAsync("accessToken");

        if (accessToken) {
          try {
            const refreshToken =
              Platform.OS === "web"
                ? localStorage.getItem("refreshToken")
                : await SecureStore.getItemAsync("refreshToken");

            if (!refreshToken) {
              dispatch({ type: "SIGN_OUT" });
              return;
            }

            try {
              const payload = JSON.parse(atob(refreshToken.split(".")[1]));
              const user: AuthUser = {
                id: payload.id,
                email: payload.email,
                role: payload.role || "user",
              };
              const tokens: AuthTokens = {
                accessToken: refreshToken,
                refreshToken: refreshToken,
              };

              await storeTokens(tokens);
              dispatch({ type: "AUTH_SUCCESS", payload: { user, tokens } });
              return;
            } catch (e) {
              dispatch({ type: "SIGN_OUT" });
            }
          } catch (error) {
            dispatch({ type: "SIGN_OUT" });
          }
        } else {
          dispatch({ type: "SIGN_OUT" });
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        dispatch({ type: "SIGN_OUT" });
      }
    };

    initializeAuth();
  }, [storeTokens]);

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
        setOriginalPath,
        clearOriginalPath,
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
