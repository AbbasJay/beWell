"use client";

import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import BeWellIcons from "@/assets/icons/icons";

export const BeWellTabBar = () => {
  const { unreadNotificationsCount } = useNotificationsContext();
  const [activeTab, setActiveTab] = useState("Home");

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
          <View style={styles.iconContainer}>
            {unreadNotificationsCount > 0 ? (
              <BeWellIcons
                name="notificationsBellActive"
                width={24}
                height={24}
              />
            ) : (
              <BeWellIcons
                name="notificationsBellInactive"
                width={24}
                height={24}
              />
            )}
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
  iconContainer: {
    alignItems: "center",
  },
});
