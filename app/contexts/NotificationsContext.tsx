import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useNotifications } from "@/hooks/useNotifications";

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
  refreshNotifications: () => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notifications, fetchNotifications } = useNotifications();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    fetchNotifications(); // Initial fetch
  }, [fetchNotifications]);

  const unreadCount = useMemo(() => 
    notifications.filter((notification: Notification) => !notification.read).length,
    [notifications]
  );

  useEffect(() => {
    setUnreadNotificationsCount(unreadCount);
  }, [unreadCount]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadNotificationsCount,
        refreshNotifications: fetchNotifications,
      }}
    >
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
