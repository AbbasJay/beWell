import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  useNotificationsContext,
  Notification,
} from "@/app/contexts/NotificationsContext";
import NotificationListItem from "./ui/notification-list-item/notification-list-item";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { useBusinessContext } from "./contexts/BusinessContext";
import { ErrorMessage } from "@/app/ui/error-message";
import { useAuth } from "./contexts/auth/AuthContext";
import { BeWellText } from "./ui/be-well-text/be-well-text";
import Button from "./ui/button/button";
import { router } from "expo-router";

const NotificationsDisplay: React.FC = () => {
  const { notifications, refreshNotifications, markAsRead } =
    useNotificationsContext();
  const { businesses } = useBusinessContext();
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await refreshNotifications();
    } catch (error) {
      setError(
        error instanceof Error
          ? error
          : new Error("Failed to refresh notifications")
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshNotifications]);

  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    },
    [markAsRead]
  );

  const handleLoginPress = () => {
    router.push("/logIn");
  };

  if (!user) {
    return (
      <BeWellBackground contentContainerStyle={styles.container}>
        <View style={styles.loginPrompt}>
          <BeWellText style={styles.loginTitle}>
            Sign in to View Notifications
          </BeWellText>
          <BeWellText style={styles.loginDescription}>
            Please sign in to view and manage your notifications
          </BeWellText>
          <Button onPress={handleLoginPress} title="Sign In" />
        </View>
      </BeWellBackground>
    );
  }

  return (
    <BeWellBackground contentContainerStyle={styles.container}>
      {error ? (
        <ErrorMessage error={error} />
      ) : (
        <FlatList
          data={sortedNotifications}
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
  loginPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginTitle: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  loginDescription: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.8,
    fontSize: 16,
  },
});

export default NotificationsDisplay;
