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

export type Class = {
  id: number;
  businessId: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  instructor: string;
  location: string;
  startDate: string;
  time: string;
  capacity: number;
  slotsLeft: number;
  createdAt: Date;
};

type ClassesContextType = {
  classes: Class[];
};

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export const ClassesProvider = ({
  children,
  businessId,
}: {
  children: ReactNode;
  businessId: number;
}) => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
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

        const response = await fetch(`${API_URL}/api/classes/${businessId}`, {
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
        setClasses(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClasses();
  }, [businessId]);

  return (
    <ClassesContext.Provider value={{ classes }}>
      {children}
    </ClassesContext.Provider>
  );
};

export const useClassesContext = () => {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error("useClassesContext must be used within a ClassesProvider");
  }
  return context;
};
