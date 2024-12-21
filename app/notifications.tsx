import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import NotificationListItem from "./ui/notification-list-item/notification-list-item";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { useBusinessContext } from "./contexts/BusinessContext";
import { LoadingSpinner } from "@/app/ui/loading-spinner";
import { ErrorMessage } from "@/app/ui/error-message";
const NotificationsDisplay: React.FC = () => {
  const { notifications, unreadNotificationsCount, refreshNotifications } = useNotificationsContext();
  const { businesses, isLoading: businessesLoading } = useBusinessContext();
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await refreshNotifications();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to refresh notifications'));
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshNotifications]);

  if (businessesLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <BeWellBackground 
      scrollable 
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={onRefresh} 
        />
      }
    >
      {unreadNotificationsCount > 0 && (
        <Text style={styles.unreadCount}>
          Unread Notifications: {unreadNotificationsCount}
        </Text>
      )}
      {notifications
        .slice()
        .reverse()
        .map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            messageAlert="Booking confirmed!"
            business={businesses.find(
              (business) => business.id === notification.businessId
            )}
          />
        ))}
    </BeWellBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  unreadCount: {
    fontSize: 18,
    marginVertical: 10,
  },
  notification: {
    gap: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default NotificationsDisplay;
