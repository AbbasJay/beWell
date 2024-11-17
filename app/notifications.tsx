import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";

const NotificationsDisplay: React.FC = () => {
  const { notifications, unreadNotificationsCount } = useNotificationsContext();

  return (
    <View style={styles.container}>
      {unreadNotificationsCount > 0 && (
        <Text style={styles.unreadCount}>
          Unread Notifications: {unreadNotificationsCount}
        </Text>
      )}
      {notifications.map((notification) => (
        <View key={notification.id} style={styles.notification}>
          <Text>{`Congratulations, your booking is now confirmed. ${notification.createdAt}`}</Text>

          <Text>{"5 mins ago"}</Text>
        </View>
      ))}
    </View>
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
