import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  useNotificationsContext,
  Notification,
} from "@/app/contexts/NotificationsContext";
import { useBusinessContext } from "./contexts/BusinessContext";
import { ErrorMessage } from "@/app/ui/error-message";
import { useAuth } from "./contexts/auth/AuthContext";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import Button from "./ui/button/button";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/app/contexts/ToastContext";

// Helper functions for date operations
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

const isLastWeek = (date: Date): boolean => {
  const now = new Date();
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 7);
  lastWeekStart.setHours(0, 0, 0, 0);

  const lastWeekEnd = new Date(now);
  lastWeekEnd.setDate(now.getDate() - 2); // Exclude yesterday
  lastWeekEnd.setHours(23, 59, 59, 999);

  return date >= lastWeekStart && date <= lastWeekEnd;
};

const isLastMonth = (date: Date): boolean => {
  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  return date >= lastMonthStart && date <= lastMonthEnd;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const groupNotifications = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};

  notifications.forEach((n) => {
    const date = new Date(n.createdAt);
    let group = "Older";

    if (isToday(date)) {
      group = "Today";
    } else if (isYesterday(date)) {
      group = "Yesterday";
    } else if (isLastWeek(date)) {
      group = "Last Week";
    } else if (isLastMonth(date)) {
      group = "Last Month";
    } else {
      group = "Older";
    }

    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  });

  // Sort groups in the specified order: Today, Yesterday, Last Week, Last Month, Older
  const groupOrder = ["Today", "Yesterday", "Last Week", "Last Month", "Older"];
  const sortedKeys = groupOrder.filter(
    (key) => groups[key] && groups[key].length > 0
  );

  return sortedKeys.map((key) => ({ title: key, data: groups[key] }));
};

const NotificationsDisplay: React.FC = () => {
  const { notifications, refreshNotifications, markAsRead } =
    useNotificationsContext();
  const { businesses } = useBusinessContext();
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { markNotificationsAsRead, deleteNotifications } = useNotifications();
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications]);

  const grouped = useMemo(
    () => groupNotifications(sortedNotifications),
    [sortedNotifications]
  );

  const unreadIds = useMemo(
    () => notifications.filter((n) => !n.read).map((n) => n.id),
    [notifications]
  );

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
    async (notification: Notification) => {
      const business = businesses.find((b) => b.id === notification.businessId);
      if (!business) {
        showToast("This business is no longer available.", "error");
        return;
      }
      // Navigate immediately
      router.push({
        pathname: "/business/[id]/classes",
        params: {
          id: String(notification.businessId),
          classId: String(notification.classId),
        },
      });
      // Mark as read in the background
      if (!notification.read) {
        try {
          await markNotificationsAsRead([notification.id]);
          markAsRead(notification.id); // optimistic UI
          await refreshNotifications();
        } catch (error) {
          // Optionally show error to user
        }
      }
    },
    [
      businesses,
      markAsRead,
      refreshNotifications,
      markNotificationsAsRead,
      showToast,
    ]
  );

  const handleMarkAllAsRead = useCallback(
    async (ids: number[]) => {
      try {
        await markNotificationsAsRead(ids);
        ids.forEach(markAsRead); // optimistic UI
        await refreshNotifications();
      } catch (error) {
        // Optionally show error to user
      }
    },
    [markNotificationsAsRead, markAsRead, refreshNotifications]
  );

  const handleDeleteNotification = useCallback(
    async (id: number) => {
      setDeleting(true);
      try {
        await deleteNotifications([id]);
        await refreshNotifications();
      } catch (error) {
        // Optionally show error to user
      } finally {
        setDeleting(false);
      }
    },
    [deleteNotifications, refreshNotifications]
  );

  const handleDeleteAll = useCallback(
    async (ids: number[]) => {
      setDeleting(true);
      try {
        await deleteNotifications(ids);
        await refreshNotifications();
      } catch (error) {
        // Optionally show error to user
      } finally {
        setDeleting(false);
      }
    },
    [deleteNotifications, refreshNotifications]
  );

  const handleLoginPress = () => {
    router.push("/logIn");
  };

  const handleDismiss = (id: number) => {
    // TODO: Implement dismiss logic (e.g., remove notification)
    // For now, just log
    console.log("Dismiss notification", id);
  };

  if (!user) {
    return (
      <BeWellBackground contentContainerStyle={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginTitle}>Sign in to View Notifications</Text>
          <Text style={styles.loginDescription}>
            Please sign in to view and manage your notifications
          </Text>
          <Button onPress={handleLoginPress} title="Sign In" />
        </View>
      </BeWellBackground>
    );
  }

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderItem = ({ item }: { item: Notification }) => {
    const business = businesses.find((b) => b.id === item.businessId);
    const activityName = business?.name || "Activity";
    const activityImage = business?.photo
      ? { uri: business.photo }
      : require("@/assets/images/home-gym.webp");
    const time = formatTime(new Date(item.createdAt));
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        style={[
          styles.notificationRow,
          !item.read && styles.notificationRowUnread,
        ]}
        activeOpacity={0.7}
      >
        {!item.read ? (
          <View style={styles.unreadIndicator} />
        ) : (
          <View style={styles.readIndicatorSpacer} />
        )}
        <Image source={activityImage} style={styles.activityImage} />
        <View style={styles.notificationTextContainer}>
          <Text
            style={[
              styles.activityName,
              !item.read && styles.activityNameUnread,
            ]}
          >
            {activityName}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteNotification(item.id)}
          style={styles.deleteButton}
          disabled={deleting}
        >
          <MaterialIcons name="close" size={28} color="#d9534f" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <BeWellBackground contentContainerStyle={styles.container}>
      {(notifications.length > 0 || unreadIds.length > 0) && (
        <View style={styles.actionRow}>
          {unreadIds.length > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={() => handleMarkAllAsRead(unreadIds)}
              disabled={loading || deleting}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#688273" />
              ) : (
                <Text style={styles.markAllText}>Mark all as read</Text>
              )}
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.deleteAllButton}
              onPress={() => handleDeleteAll(notifications.map((n) => n.id))}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#d9534f" />
              ) : (
                <Text style={styles.deleteAllText}>Delete all</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
      {error ? (
        <ErrorMessage error={error} />
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({ item }) => (
            <View key={item.title}>
              {renderSectionHeader({ section: { title: item.title } })}
              {item.data.map((notif) => renderItem({ item: notif }))}
            </View>
          )}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      )}
    </BeWellBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 16,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    position: "relative",
  },
  notificationRowUnread: {
    // No background, just indicator
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4caf50",
    marginRight: 12,
    alignSelf: "center",
  },
  readIndicatorSpacer: {
    width: 8,
    marginRight: 12,
  },
  activityImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#f3f6f4",
  },
  notificationTextContainer: {
    flex: 1,
  },
  activityName: {
    fontSize: 18,
    fontWeight: "400",
    color: "#222",
    marginBottom: 2,
  },
  activityNameUnread: {
    fontWeight: "bold",
    color: "#121714",
  },
  time: {
    fontSize: 15,
    color: "#7a9683",
    fontWeight: "400",
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
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
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: "#eaf3ee",
    borderRadius: 20,
    marginRight: 0,
  },
  markAllText: {
    color: "#688273",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: "#fbe9e7",
    borderRadius: 20,
    marginLeft: 0,
  },
  deleteAllText: {
    color: "#d9534f",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
    marginRight: 8,
  },
});

export default NotificationsDisplay;
