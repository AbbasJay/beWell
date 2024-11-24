import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import NotificationListItem from "./ui/notification-list-item/notification-list-item";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { useBusinessContext } from "./contexts/BusinessContext";
const NotificationsDisplay: React.FC = () => {
  const { notifications, unreadNotificationsCount } = useNotificationsContext();
  const { businesses } = useBusinessContext();
  return (
    <BeWellBackground scrollable>
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
