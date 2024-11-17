import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsContextType } from "@/app/utils/notification-types";

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

  useEffect(() => {
    const unreadCount = notifications.filter(
      (notification: any) => !notification.read
    ).length;
    setUnreadNotificationsCount(unreadCount);
  }, [notifications]);

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
