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
import { useAuth } from "./auth/AuthContext";

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
  forceRefresh: () => Promise<void>;
  addBusiness: (business: Business) => void;
  updateBusiness: (business: Business) => void;
  deleteBusiness: (businessId: number) => void;
};

type FilterBusinessContextType = {
  updateFilters: (
    newDistance: Number,
    newLocation: LocationType,
    newMinRating: Number,
    newServiceTypes: String[],
    skipFetch?: boolean
  ) => void;
  getCurrentFilters: () => {
    distance: Number;
    location: LocationType;
    minRating: Number;
    serviceTypes: String[];
  };
  endInitialization: () => void;
  setHomeInitialized: (initialized: boolean) => void;
  getHomeInitialized: () => boolean;
  resetHomeInitialization: () => void;
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
  const [distance, setDistance] = useState<Number>(50000);
  const [location, setLocation] = useState<LocationType>({
    lat: 51.4086295,
    lng: -0.7214513,
  }); //actually get that from expo-location
  const [minRating, setMinRating] = useState<Number>(1);
  const [serviceTypes, setServiceTypes] = useState<String[]>([
    "gym",
    "classes",
  ]);
  const { user, isGuestMode } = useAuth();

  // Cache for tracking last fetch parameters
  const [lastFetchParams, setLastFetchParams] = useState<string>("");
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isHomeInitialized, setIsHomeInitialized] = useState(false);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const fetchBusinesses = async () => {
    dispatch({ type: "FETCH_BUSINESSES_START" });

    // Make API call for both guest and authenticated users
    try {
      let token = null;
      if (user) {
        // Get token for authenticated users
        if (Platform.OS === "web") {
          token = localStorage.getItem("accessToken");
        } else {
          token = await SecureStore.getItemAsync("accessToken");
        }
      }

      const headers: any = {
        "Content-Type": "application/json",
      };

      // Add authorization header only if user is authenticated
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const requestBody = {
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        maxDistance: distance,
        minRating: minRating,
        types: serviceTypes,
      };

      const response = await fetch(`${API_URL}/api/mobile/businesses/filter`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const json = await response.json();
      const validBusinesses = json.filter(
        (business: Business) => business.id !== undefined
      );

      dispatch({
        type: "FETCH_BUSINESSES_SUCCESS",
        payload: validBusinesses,
      });

      // Record the fetch time
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch({
        type: "FETCH_BUSINESSES_ERROR",
        payload: error as Error,
      });
    }
  };

  const forceRefresh = async () => {
    // Force a fresh fetch regardless of cache
    setLastFetchParams(""); // Reset cache
    await fetchBusinesses();
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
    newServiceTypes: String[],
    skipFetch?: boolean
  ) => {
    setDistance(newDistance);
    setLocation(newLocation);
    setMinRating(newMinRating);
    setServiceTypes(newServiceTypes);

    if (skipFetch) {
      setIsInitializing(true);
    }
  };

  const getCurrentFilters = () => {
    return {
      distance,
      location,
      minRating,
      serviceTypes,
    };
  };

  const endInitialization = () => {
    setIsInitializing(false);
  };

  const setHomeInitialized = (initialized: boolean) => {
    setIsHomeInitialized(initialized);
  };

  const getHomeInitialized = () => {
    return isHomeInitialized;
  };

  const resetHomeInitialization = () => {
    setIsHomeInitialized(false);
  };

  // Smart fetch logic - only fetch if parameters actually changed
  useEffect(() => {
    if (isInitializing) return; // Don't fetch during initialization

    const currentParams = JSON.stringify({
      distance,
      location,
      minRating,
      serviceTypes,
      user: user?.id || "guest",
      isGuestMode,
    });

    const isCacheExpired = Date.now() - lastFetchTime > CACHE_DURATION;
    const paramsChanged = currentParams !== lastFetchParams;
    const needsInitialFetch = !hasInitialFetch;

    // Fetch if parameters changed, cache expired, or first time
    if (paramsChanged || isCacheExpired || needsInitialFetch) {
      setLastFetchParams(currentParams);
      setHasInitialFetch(true);
      fetchBusinesses();
    }
  }, [
    distance,
    location,
    minRating,
    serviceTypes,
    user,
    isGuestMode,
    isInitializing,
  ]);

  return (
    <BusinessContext.Provider
      value={{
        ...state,
        refreshBusinesses: fetchBusinesses,
        forceRefresh,
        addBusiness,
        updateBusiness,
        deleteBusiness,
      }}
    >
      <FilterBusinessContext.Provider
        value={{
          updateFilters,
          getCurrentFilters,
          endInitialization,
          setHomeInitialized,
          getHomeInitialized,
          resetHomeInitialization,
        }}
      >
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
