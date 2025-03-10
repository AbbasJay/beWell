import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useState,
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
  photo?: string | null;
};

interface BusinessState {
  businesses: Business[];
  isLoading: boolean;
  error: Error | null;
}

// Action types
type BusinessAction =
  | { type: "FETCH_BUSINESSES_START" }
  | { type: "FETCH_BUSINESSES_SUCCESS"; payload: Business[] }
  | { type: "FETCH_BUSINESSES_ERROR"; payload: Error }
  | { type: "ADD_BUSINESS"; payload: Business }
  | { type: "UPDATE_BUSINESS"; payload: Business }
  | { type: "DELETE_BUSINESS"; payload: number };

// Initial state
const initialState: BusinessState = {
  businesses: [],
  isLoading: false,
  error: null,
};

// Reducer function
function businessReducer(
  state: BusinessState,
  action: BusinessAction
): BusinessState {
  switch (action.type) {
    case "FETCH_BUSINESSES_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "FETCH_BUSINESSES_SUCCESS":
      return {
        ...state,
        businesses: action.payload,
        isLoading: false,
        error: null,
      };

    case "FETCH_BUSINESSES_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "ADD_BUSINESS":
      return {
        ...state,
        businesses: [...state.businesses, action.payload],
      };

    case "UPDATE_BUSINESS":
      return {
        ...state,
        businesses: state.businesses.map((business) =>
          business.id === action.payload.id ? action.payload : business
        ),
      };

    case "DELETE_BUSINESS":
      return {
        ...state,
        businesses: state.businesses.filter(
          (business) => business.id !== action.payload
        ),
      };

    default:
      return state;
  }
}

// Context type with actions
type BusinessContextType = BusinessState & {
  refreshBusinesses: () => Promise<void>;
  addBusiness: (business: Business) => void;
  updateBusiness: (business: Business) => void;
  deleteBusiness: (businessId: number) => void;
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
  const [state, dispatch] = useReducer(businessReducer, initialState);
  const [distance, setDistance] = useState<Number>(5000);
  const [location, setLocation] = useState<LocationType>({
    lat: 51.4086295,
    lng: -0.7214513,
  }); //actually get that from expo-location
  const [minRating, setMinRating] = useState<Number>(4); // 4 out of 5
  const [serviceTypes, setServiceTypes] = useState<String[]>(["classes"]);

  const fetchBusinesses = async () => {
    dispatch({ type: "FETCH_BUSINESSES_START" });
    try {
      let token;
      if (Platform.OS === "web") {
        token = localStorage.getItem("accessToken");
      } else {
        token = await SecureStore.getItemAsync("accessToken");
      }

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/mobile/businesses/filter`, {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const validBusinesses = json.filter(
        (business: Business) => business.id !== undefined
      );

      dispatch({
        type: "FETCH_BUSINESSES_SUCCESS",
        payload: validBusinesses,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch({
        type: "FETCH_BUSINESSES_ERROR",
        payload: error as Error,
      });
    }
  };

  const addBusiness = (business: Business) => {
    dispatch({ type: "ADD_BUSINESS", payload: business });
  };

  const updateBusiness = (business: Business) => {
    dispatch({ type: "UPDATE_BUSINESS", payload: business });
  };

  const deleteBusiness = (businessId: number) => {
    dispatch({ type: "DELETE_BUSINESS", payload: businessId });
  };

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
    fetchBusinesses();
  }, [distance, location, minRating, serviceTypes]);

  return (
    <BusinessContext.Provider
      value={{
        ...state,
        refreshBusinesses: fetchBusinesses,
        addBusiness,
        updateBusiness,
        deleteBusiness,
      }}
    >
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
