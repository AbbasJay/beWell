import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { API_URL } from "@/env";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type Business = {
  id?: number;
  userId: number;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  phoneNumber: string;
  email: string;
  type: string;
  description?: string | null;
  hours?: string | null;
  createdAt?: string;
  latitude?: number | null;
  longitude?: number | null;
};

type BusinessContextType = {
  businesses: Business[];
};

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        let token;
        if (Platform.OS === "web") {
          token = localStorage.getItem("userToken");
        } else {
          token = await SecureStore.getItemAsync("userToken");
        }

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_URL}/api/businesses?all=true`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const validBusinesses = json.filter(
          (business: Business) => business.id !== undefined
        );
        setBusinesses(validBusinesses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBusinesses();
  }, []);

  return (
    <BusinessContext.Provider value={{ businesses }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error(
      "useBusinessContext must be used within a BusinessProvider"
    );
  }
  return context;
};
