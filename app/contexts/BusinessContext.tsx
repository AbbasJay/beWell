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
import * as Location from "expo-location";

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

type FilterBusinessContextType = {
  updateFilters: (
    newDistance: Number,
    newLocation: LocationType,
    newMinRating: Number,
    newServiceTypes: String[]
  ) => void;
};

type LocationType = {
  lat: Number;
  lng: Number;
};

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

const FilterBusinessContext = createContext<
  FilterBusinessContextType | undefined
>(undefined);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const [distance, setDistance] = useState<Number>(5000);
  const [location, setLocation] = useState<LocationType>({
    lat: 51.4086295,
    lng: -0.7214513,
  }); //actually get that from expo-location
  const [minRating, setMinRating] = useState<Number>(4); // 4 out of 5
  const [serviceTypes, setServiceTypes] = useState<String[]>(["classes"]);

  const updateFilters = (
    newDistance: Number,
    newLocation: LocationType,
    newMinRating: Number,
    newServiceTypes: String[]
  ) => {
    setDistance(newDistance);
    setLocation(newLocation);
    setMinRating(newMinRating);
    setServiceTypes(newServiceTypes);
  };

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

        const response = await fetch(`${API_URL}/api/businesses/filter`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: {
              lat: location.lat,
              lng: location.lng,
            },
            maxDistance: distance,
            minRating: minRating,
            types: serviceTypes,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(
            `HTTP error while fetching businesses! status: ${response.status}`
          );
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
  }, [distance, location, minRating, serviceTypes]);

  // useEffect(() => {
  //   const fetchBusinesses = async () => {
  //     try {
  //       let token;
  //       if (Platform.OS === "web") {
  //         token = localStorage.getItem("userToken");
  //       } else {
  //         token = await SecureStore.getItemAsync("userToken");
  //       }

  //       if (!token) {
  //         throw new Error("No authentication token found");
  //       }

  //       const response = await fetch(`${API_URL}/api/businesses?all=true`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         console.error("Error response:", errorText);
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const json = await response.json();
  //       const validBusinesses = json.filter(
  //         (business: Business) => business.id !== undefined
  //       );
  //       setBusinesses(validBusinesses);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchBusinesses();
  // }, []);

  return (
    <BusinessContext.Provider value={{ businesses }}>
      <FilterBusinessContext.Provider value={{ updateFilters }}>
        {children}
      </FilterBusinessContext.Provider>
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

export const useFilterBusinessContext = () => {
  const context = useContext(FilterBusinessContext);
  if (!context) {
    throw new Error(
      "useFilterBusinessContext must be used within a FilterBusinessProvider"
    );
  }
  return context;
};
