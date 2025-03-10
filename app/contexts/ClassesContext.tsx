import React, {
  createContext,
  useContext,
  useReducer,
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

// State interface
interface ClassesState {
  classes: Class[];
  isLoading: boolean;
  error: Error | null;
}

// Extended interface for context that includes methods
interface ClassesContextType extends ClassesState {
  refreshClasses: () => Promise<void>;
  updateSlotsLeft: (classId: number, slotsLeft: number) => void;
}

// Action types
type ClassesAction =
  | { type: "FETCH_CLASSES_START" }
  | { type: "FETCH_CLASSES_SUCCESS"; payload: Class[] }
  | { type: "FETCH_CLASSES_ERROR"; payload: Error }
  | { type: "ADD_CLASS"; payload: Class }
  | { type: "UPDATE_CLASS"; payload: Class }
  | {
      type: "UPDATE_SLOTS_LEFT";
      payload: { classId: number; slotsLeft: number };
    };

// Initial state
const initialState: ClassesState = {
  classes: [],
  isLoading: false,
  error: null,
};

// Reducer function
function classesReducer(
  state: ClassesState,
  action: ClassesAction
): ClassesState {
  switch (action.type) {
    case "FETCH_CLASSES_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "FETCH_CLASSES_SUCCESS":
      return {
        ...state,
        classes: action.payload,
        isLoading: false,
        error: null,
      };

    case "FETCH_CLASSES_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "ADD_CLASS":
      return {
        ...state,
        classes: [...state.classes, action.payload],
      };

    case "UPDATE_CLASS":
      return {
        ...state,
        classes: state.classes.map((classItem) =>
          classItem.id === action.payload.id ? action.payload : classItem
        ),
      };

    case "UPDATE_SLOTS_LEFT":
      return {
        ...state,
        classes: state.classes.map((classItem) =>
          classItem.id === action.payload.classId
            ? { ...classItem, slotsLeft: action.payload.slotsLeft }
            : classItem
        ),
      };

    default:
      return state;
  }
}

// Update context creation to use ClassesContextType
const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export const ClassesProvider = ({
  children,
  businessId,
}: {
  children: ReactNode;
  businessId: number;
}) => {
  const [state, dispatch] = useReducer(classesReducer, initialState);

  const fetchClasses = async () => {
    dispatch({ type: "FETCH_CLASSES_START" });
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

      const response = await fetch(
        `${API_URL}/api/mobile/classes?businessId=${businessId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      dispatch({ type: "FETCH_CLASSES_SUCCESS", payload: json });
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch({
        type: "FETCH_CLASSES_ERROR",
        payload: error as Error,
      });
    }
  };

  const updateSlotsLeft = (classId: number, slotsLeft: number) => {
    dispatch({
      type: "UPDATE_SLOTS_LEFT",
      payload: { classId, slotsLeft },
    });
  };

  useEffect(() => {
    fetchClasses();
  }, [businessId]);

  return (
    <ClassesContext.Provider
      value={{
        ...state,
        refreshClasses: fetchClasses,
        updateSlotsLeft,
      }}
    >
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
