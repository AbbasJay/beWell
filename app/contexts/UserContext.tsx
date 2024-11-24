import { Platform } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/env";

export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const getToken = async () => {
  return Platform.OS === "web"
    ? localStorage.getItem("userToken")
    : await SecureStore.getItemAsync("userToken");
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          console.warn("No authentication token found");
          return;
        }

        const response = await fetch(`${API_URL}/api/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const contextValue = React.useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
