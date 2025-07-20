import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { API_URL } from "@/env";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { useAuth } from "./auth/AuthContext";

export interface Booking {
  id: number;
  userId: number;
  classId: number;
  status: "active" | "cancelled" | "completed" | "no-show";
  createdAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  className?: string;
  classStartDate?: string;
  classTime?: string;
  classInstructor?: string;
  classLocation?: string;
  businessId?: number;
  businessName?: string;
}

// State interface
interface BookingsState {
  bookings: Booking[];
  isLoading: boolean;
  error: Error | null;
}

// Extended interface for context that includes methods
interface BookingsContextType extends BookingsState {
  refreshBookings: () => Promise<void>;
  isClassBooked: (classId: number) => boolean;
  checkClassBookingStatus: (classId: number) => Promise<boolean>;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: number) => void;
}

// Action types
type BookingsAction =
  | { type: "FETCH_BOOKINGS_START" }
  | { type: "FETCH_BOOKINGS_SUCCESS"; payload: Booking[] }
  | { type: "FETCH_BOOKINGS_ERROR"; payload: Error }
  | { type: "ADD_BOOKING"; payload: Booking }
  | { type: "UPDATE_BOOKING"; payload: Booking }
  | { type: "CANCEL_BOOKING"; payload: { bookingId: number } };

// Initial state
const initialState: BookingsState = {
  bookings: [],
  isLoading: false,
  error: null,
};

// Reducer function
function bookingsReducer(
  state: BookingsState,
  action: BookingsAction
): BookingsState {
  switch (action.type) {
    case "FETCH_BOOKINGS_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "FETCH_BOOKINGS_SUCCESS":
      return {
        ...state,
        bookings: action.payload,
        isLoading: false,
        error: null,
      };

    case "FETCH_BOOKINGS_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "ADD_BOOKING":
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };

    case "UPDATE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.id ? action.payload : booking
        ),
      };

    case "CANCEL_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.bookingId
            ? { ...booking, status: "cancelled" as const }
            : booking
        ),
      };

    default:
      return state;
  }
}

// Create context
const BookingsContext = createContext<BookingsContextType | undefined>(
  undefined
);

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(bookingsReducer, initialState);
  const { user, isGuestMode } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!user || isGuestMode) {
      dispatch({ type: "FETCH_BOOKINGS_SUCCESS", payload: [] });
      return;
    }

    dispatch({ type: "FETCH_BOOKINGS_START" });

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

      const response = await fetch(`${API_URL}/api/mobile/classes/bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const transformedBookings = data.map((item: any) => {
        if (item.booking && item.class) {
          return {
            id: item.booking.id,
            userId: user.id,
            classId: item.class.id,
            status: item.booking.status,
            createdAt: item.booking.createdAt,
            cancelledAt: item.booking.cancelledAt,
            cancellationReason: item.booking.cancellationReason,
            className: item.class.name,
            classStartDate: item.class.startDate,
            classTime: item.class.time,
            classInstructor: item.class.instructor,
            classLocation: item.class.location,
            businessId: undefined,
            businessName: undefined,
          };
        } else {
          // New flat structure
          return {
            id: item.id,
            userId: user.id,
            classId: item.classId,
            status: item.status,
            createdAt: item.createdAt,
            cancelledAt: item.cancelledAt,
            cancellationReason: item.cancellationReason,
            className: item.className,
            classStartDate: item.classStartDate,
            classTime: item.classTime,
            classInstructor: item.classInstructor,
            classLocation: item.classLocation,
            businessId: item.businessId,
            businessName: item.businessName,
          };
        }
      });

      dispatch({
        type: "FETCH_BOOKINGS_SUCCESS",
        payload: transformedBookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      dispatch({
        type: "FETCH_BOOKINGS_ERROR",
        payload: error as Error,
      });
    }
  }, [user, isGuestMode]);

  // Check if a specific class is booked by the current user
  const isClassBooked = useCallback(
    (classId: number): boolean => {
      if (!user?.id) return false;

      // Check if we have booking data from the backend
      return state.bookings.some(
        (booking) =>
          booking.classId === classId &&
          booking.userId === user.id &&
          booking.status === "active"
      );
    },
    [state.bookings, user?.id]
  );

  // Add a new booking to the context
  const addBooking = useCallback((booking: Booking) => {
    dispatch({ type: "ADD_BOOKING", payload: booking });
  }, []);

  // Update a booking in the context
  const updateBooking = useCallback((booking: Booking) => {
    dispatch({ type: "UPDATE_BOOKING", payload: booking });
  }, []);

  // Check booking status directly with the backend for a specific class
  const checkClassBookingStatus = useCallback(
    async (classId: number): Promise<boolean> => {
      if (!user?.id) return false;

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

        // Use the existing GET endpoint to check if user has booked this class
        const response = await fetch(
          `${API_URL}/api/mobile/classes/${classId}/book`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // If we get a 200 response, it means the user has booked this class
          const bookingData = await response.json();

          return true;
        } else if (response.status === 404) {
          // If we get a 404, it means the user hasn't booked this class
          return false;
        } else {
          // For other errors, throw an exception
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
      } catch (error) {
        console.error(
          "Error checking booking status for class",
          classId,
          ":",
          error
        );
        // Fall back to notification-based approach on error
        return isClassBooked(classId);
      }
    },
    [user?.id, isClassBooked]
  );

  // Cancel a booking in the context
  const cancelBooking = useCallback((bookingId: number) => {
    dispatch({ type: "CANCEL_BOOKING", payload: { bookingId } });
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <BookingsContext.Provider
      value={{
        ...state,
        refreshBookings: fetchBookings,
        isClassBooked,
        checkClassBookingStatus,
        addBooking,
        updateBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error(
      "useBookingsContext must be used within a BookingsProvider"
    );
  }
  return context;
};
