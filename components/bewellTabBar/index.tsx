"use client";

import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { router, usePathname } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as CSS from "./styles";

export const BeWellTabBar = () => {
  const { unreadNotificationsCount } = useNotificationsContext();
  const currentRoute = usePathname();

  return (
    <CSS.Content>
      <CSS.TabBar>
        <CSS.Tab
          onPress={() => {
            router.push("/notifications");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons
              name="notifications"
              size={30}
              color={unreadNotificationsCount > 0 ? "red" : "black"}
            />
            <CSS.TabText>Notifications</CSS.TabText>
            {unreadNotificationsCount > 0 && (
              <CSS.BadgeContainer>
                <CSS.NotificationBadge>
                  {unreadNotificationsCount}
                </CSS.NotificationBadge>
              </CSS.BadgeContainer>
            )}
          </CSS.IconContainer>
        </CSS.Tab>
        <CSS.Tab
          onPress={() => {
            router.push("/home");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons
              name="home"
              size={30}
              color={currentRoute === "/home" ? "blue" : "black"}
            />
            <CSS.TabText>Home</CSS.TabText>
          </CSS.IconContainer>
        </CSS.Tab>
        <CSS.Tab
          onPress={() => {
            router.push("/components");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons
              name="settings"
              size={30}
              color={currentRoute === "/components" ? "blue" : "black"}
            />
            <CSS.TabText>Settings</CSS.TabText>
          </CSS.IconContainer>
        </CSS.Tab>
      </CSS.TabBar>
    </CSS.Content>
  );
};
