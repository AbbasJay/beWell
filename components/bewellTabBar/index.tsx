"use client";

import { Colors } from "@/constants/Colors";
import { useNotifications } from "@/hooks/useNotifications";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export const BeWellTabBar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const getNotifications = async () => {
      const data = await useNotifications(undefined, 0, "GET");
      setNotifications(data);
      console.log("notifications", notifications);

      const unreadCount = data.filter(
        (notification: any) => !notification.read
      ).length;
      setUnreadNotificationsCount(unreadCount);
    };
    getNotifications();
  }, [activeTab]);

  return (
    <View>
      <View style={styles.tabBar}>
        <Pressable
          style={styles.tab}
          onPress={() => {
            setActiveTab("Notifications");
            router.push("/notifications");
          }}
        >
          <View>
            {unreadNotificationsCount > 0 && (
              <Text>{unreadNotificationsCount}</Text>
            )}
            <Text
              style={
                activeTab === "Notifications"
                  ? styles.activeTabText
                  : styles.tabText
              }
            >
              Notifications
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => {
            setActiveTab("Home");
            router.push("/home");
          }}
        >
          <Text
            style={activeTab === "Home" ? styles.activeTabText : styles.tabText}
          >
            Home
          </Text>
        </Pressable>
        <Pressable
          style={styles.tab}
          onPress={() => {
            setActiveTab("Settings");
            router.push("/components");
          }}
        >
          <Text
            style={
              activeTab === "Settings" ? styles.activeTabText : styles.tabText
            }
          >
            Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#eee",
    paddingVertical: 10,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    color: "#000",
  },
  activeTabText: {
    color: "orange",
    fontWeight: "bold",
  },
});
