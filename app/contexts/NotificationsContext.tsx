import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "./auth/AuthContext";

export interface Notification {
  id: number;
  businessId: number;
  classId: number;
  message: string;
  userId: number;
  read: boolean;
  createdAt: string;
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadNotificationsCount: number;
  refreshNotifications: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: number) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

// Action types
type NotificationAction =
  | { type: 'FETCH_NOTIFICATIONS_START' }
  | { type: 'FETCH_NOTIFICATIONS_SUCCESS'; payload: Notification[] }
  | { type: 'FETCH_NOTIFICATIONS_ERROR'; payload: Error }
  | { type: 'MARK_AS_READ'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'SET_READ_STATUS'; payload: { id: number; read: boolean } };

// Reducer
function notificationReducer(state: NotificationsContextType, action: NotificationAction): NotificationsContextType {
  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_START':
      return { ...state, isLoading: true, error: null };
      
    case 'FETCH_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notifications: action.payload,
        isLoading: false,
        error: null,
      };
      
    case 'FETCH_NOTIFICATIONS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
      
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
      
    case 'SET_READ_STATUS':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, read: action.payload.read }
            : notification
        ),
      };
      
    default:
      return state;
  }
}

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, tokens, isGuestMode } = useAuth();
  const { notifications: apiNotifications, fetchNotifications } = useNotifications();
  
  // Initial state
  const initialState: NotificationsContextType = {
    notifications: [],
    unreadNotificationsCount: 0,
    isLoading: false,
    error: null,
    refreshNotifications: () => Promise.resolve(),
    markAsRead: () => {},
  };

  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Update state when apiNotifications changes
  useEffect(() => {
    dispatch({ 
      type: 'FETCH_NOTIFICATIONS_SUCCESS', 
      payload: apiNotifications 
    });
  }, [apiNotifications]);

  // Fetch notifications when auth state changes
  useEffect(() => {
    const loadNotifications = async () => {
      if (user && tokens?.accessToken && !isGuestMode) {
        dispatch({ type: 'FETCH_NOTIFICATIONS_START' });
        try {
          await fetchNotifications();
        } catch (error) {
          dispatch({ 
            type: 'FETCH_NOTIFICATIONS_ERROR', 
            payload: error instanceof Error ? error : new Error('Failed to fetch notifications') 
          });
        }
      } else {
        dispatch({ 
          type: 'FETCH_NOTIFICATIONS_SUCCESS', 
          payload: [] 
        });
      }
    };

    loadNotifications();
  }, [user, tokens?.accessToken, isGuestMode]);

  const markAsRead = useCallback((notificationId: number) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  }, []);

  const value = useMemo(() => ({
    ...state,
    notifications: apiNotifications,
    unreadNotificationsCount: apiNotifications.filter((n: Notification) => !n.read).length,
    refreshNotifications: () => fetchNotifications(),
    markAsRead,
  }), [state, apiNotifications, fetchNotifications, markAsRead]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotificationsContext must be used within a NotificationsProvider"
    );
  }
  return context;
};
