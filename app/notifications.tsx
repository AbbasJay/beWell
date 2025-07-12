import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
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
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/app/contexts/ToastContext";
import {
  SectionHeader,
  NotificationRow,
  UnreadIndicator,
  ReadIndicatorSpacer,
  ActivityImage,
  NotificationTextContainer,
  ActivityName,
  ActivityNameUnread,
  Time,
  DeleteButton,
  MarkAllButton,
  MarkAllText,
  DeleteAllButton,
  DeleteAllText,
  ActionRow,
  NotificationTypeSubtitle,
} from "./styles/notifications";
import { NavigationBar } from "@/app/ui/navigation-bar/navigation-bar";
import { Modal, Pressable } from "react-native";

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

export const NotificationsMenuTrigger: React.FC<{
  unreadIds: number[];
  notifications: Notification[];
  loading: boolean;
  deleting: boolean;
  handleMarkAllAsRead: (ids: number[]) => void;
  handleDeleteAll: (ids: number[]) => void;
}> = ({
  unreadIds,
  notifications,
  loading,
  deleting,
  handleMarkAllAsRead,
  handleDeleteAll,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setMenuVisible(true)}
        hitSlop={10}
        accessibilityLabel="Open menu"
      >
        <MaterialIcons name="more-vert" size={28} color="#222" />
      </Pressable>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setMenuVisible(false)}>
          <View
            style={{
              position: "absolute",
              top: 56,
              right: 16,
              backgroundColor: "#fff",
              borderRadius: 12,
              elevation: 6,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              minWidth: 180,
              paddingVertical: 4,
            }}
          >
            <Pressable
              style={({ pressed }) => ({
                paddingVertical: 12,
                paddingHorizontal: 20,
                backgroundColor: pressed ? "#f3f6f4" : "transparent",
              })}
              onPress={() => {
                setMenuVisible(false);
                if (unreadIds.length > 0) handleMarkAllAsRead(unreadIds);
              }}
              disabled={loading || deleting || unreadIds.length === 0}
              accessibilityLabel="Mark all as read"
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#222",
                  opacity: unreadIds.length === 0 ? 0.4 : 1,
                }}
              >
                Mark all as read
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => ({
                paddingVertical: 12,
                paddingHorizontal: 20,
                backgroundColor: pressed ? "#f3f6f4" : "transparent",
              })}
              onPress={() => {
                setMenuVisible(false);
                if (notifications.length > 0)
                  handleDeleteAll(notifications.map((n) => n.id));
              }}
              disabled={deleting || notifications.length === 0}
              accessibilityLabel="Delete all"
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#222",
                  opacity: notifications.length === 0 ? 0.4 : 1,
                }}
              >
                Delete all
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const NotificationsDisplay: React.FC = () => {
  const { notifications, refreshNotifications, markAsRead } =
    useNotificationsContext();
  const { businesses } = useBusinessContext();
  const { user, setRedirectPath, setOriginalPath } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { markNotificationsAsRead, deleteNotifications } = useNotifications();
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();
  const [menuVisible, setMenuVisible] = useState(false);

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
      // Navigate to class detail page
      router.push({
        pathname: "/business/[id]/classes/[classId]",
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

  const handleDismiss = (id: number) => {
    // TODO: Implement dismiss logic (e.g., remove notification)
    // For now, just log
  };

  useEffect(() => {
    if (!user) {
      setRedirectPath("/notifications");
      setOriginalPath("/notifications");
    }
  }, [user, setRedirectPath]);

  // If user is not authenticated, don't render anything
  if (!user) {
    return null;
  }

  const renderSectionHeader = ({ section: { title } }: any) => (
    <SectionHeader>{title}</SectionHeader>
  );

  const renderItem = ({ item }: { item: Notification }) => {
    const business = businesses.find((b) => b.id === item.businessId);
    const className = item.className || business?.name || "Class";
    const activityImage = business?.photo
      ? { uri: business.photo }
      : require("@/assets/images/home-gym.webp");
    const time = formatTime(new Date(item.createdAt));
    // Map notification type to subtitle
    const typeSubtitles: Record<string, string> = {
      booking_confirmation: "Class Booked",
      class_cancelled: "Class Cancelled",
      class_updated: "Class Updated",
      booking_reminder: "Class Reminder",
      system: "System Notification",
    };
    const subtitle = typeSubtitles[item.type] || item.type;
    return (
      <NotificationRow
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        {!item.read ? <UnreadIndicator /> : <ReadIndicatorSpacer />}
        <ActivityImage source={activityImage} />
        <NotificationTextContainer>
          {!item.read ? (
            <ActivityNameUnread>{`${className} - ${subtitle}`}</ActivityNameUnread>
          ) : (
            <ActivityName>{`${className} - ${subtitle}`}</ActivityName>
          )}
          <Time>{time}</Time>
        </NotificationTextContainer>
        <DeleteButton
          onPress={() => handleDeleteNotification(item.id)}
          disabled={deleting}
        >
          <MaterialIcons name="close" size={28} color="#d9534f" />
        </DeleteButton>
      </NotificationRow>
    );
  };

  return (
    <BeWellBackground paddingHorizontal={0}>
      {error ? (
        <ErrorMessage error={error} />
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({ item }) => (
            <View key={item.title}>
              {renderSectionHeader({ section: { title: item.title } })}
              {item.data.map((notif) => (
                <View key={notif.id}>{renderItem({ item: notif })}</View>
              ))}
            </View>
          )}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      )}
    </BeWellBackground>
  );
};

export default NotificationsDisplay;
