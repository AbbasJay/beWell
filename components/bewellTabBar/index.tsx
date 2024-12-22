"use client";

import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as CSS from "./styles";
import { ErrorMessage } from "@/app/ui/error-message";

export const BeWellTabBar = () => {
  const { unreadNotificationsCount } = useNotificationsContext();
  const [activeRoute, setActiveRoute] = useState("");
  const currentRoute = usePathname();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setActiveRoute(currentRoute);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Navigation error"));
    }
  }, [currentRoute]);

  if (error) return <ErrorMessage error={error} />;

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
              size={20}
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
            <MaterialIcons name="home" size={20} color={"black"} />
            <CSS.TabText>Home</CSS.TabText>
          </CSS.IconContainer>
        </CSS.Tab>
        <CSS.Tab
          onPress={() => {
            router.push("/components");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons name="settings" size={20} color={"black"} />
            <CSS.TabText>Settings</CSS.TabText>
          </CSS.IconContainer>
        </CSS.Tab>
      </CSS.TabBar>
    </CSS.Content>
  );
};
