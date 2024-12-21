import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  isGuestMode: boolean;
}

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  isGuestMode: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isLoading: false,
    error: null,
    isGuestMode: false
  });

  const storeToken = async (token: string) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("userToken", token);
      } else {
        await SecureStore.setItemAsync("userToken", token);
      }
    } catch (error) {
      console.error("Error storing token:", error);
      throw error;
    }
  };

  const removeToken = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("userToken");
      } else {
        await SecureStore.deleteItemAsync("userToken");
      }
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  };

  const signIn = async (newToken: string) => {
    setAuthState({
      ...authState,
      isLoading: true
    });
    try {
      await storeToken(newToken);
      setAuthState({
        ...authState,
        token: newToken,
        error: null
      });
    } catch (error) {
      setAuthState({
        ...authState,
        error: error as Error
      });
      throw error;
    } finally {
      setAuthState({
        ...authState,
        isLoading: false
      });
    }
  };

  const signOut = async () => {
    setAuthState({
      ...authState,
      isLoading: true
    });
    try {
      await removeToken();
      setAuthState({
        ...authState,
        token: null,
        error: null
      });
    } catch (error) {
      setAuthState({
        ...authState,
        error: error as Error
      });
      throw error;
    } finally {
      setAuthState({
        ...authState,
        isLoading: false
      });
    }
  };

  const continueAsGuest = () => {
    setAuthState({
      ...authState,
      isGuestMode: true,
      error: null
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setAuthState({
        ...authState,
        isLoading: true
      });
      try {
        const storedToken = Platform.OS === "web" 
          ? localStorage.getItem("userToken")
          : await SecureStore.getItemAsync("userToken");
        
        if (storedToken) {
          setAuthState({
            ...authState,
            token: storedToken,
            error: null
          });
        }
      } catch (error) {
        setAuthState({
          ...authState,
          error: error as Error
        });
      } finally {
        setAuthState({
          ...authState,
          isLoading: false
        });
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState,
        signIn,
        signOut,
        continueAsGuest
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