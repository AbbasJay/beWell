import React, { useState, useCallback } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useNotificationsContext, Notification } from "@/app/contexts/NotificationsContext";
import NotificationListItem from "./ui/notification-list-item/notification-list-item";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { useBusinessContext } from "./contexts/BusinessContext";
import { ErrorMessage } from "@/app/ui/error-message";

const NotificationsDisplay: React.FC = () => {
  const { notifications, refreshNotifications, markAsRead } = useNotificationsContext();
  const { businesses } = useBusinessContext();
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
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

  const handleNotificationPress = useCallback((notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  }, [markAsRead]);



  return (
    <BeWellBackground contentContainerStyle={styles.container}>
      {error ? (
        <ErrorMessage error={error} />
      ) : (
        <FlatList
          data={notifications}
          refreshing={isRefreshing}
          onRefresh={onRefresh}

          renderItem={({ item }) => (
            <NotificationListItem
              notification={item}
              messageAlert="Booking confirmed!"
              business={businesses.find(
                (business) => business.id === item.businessId
              )}
              onPress={() => handleNotificationPress(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
