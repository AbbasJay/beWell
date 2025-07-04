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

  const isHomeActive = activeRoute === "/home";
  const isExploreActive = activeRoute === "/explore";
  const isNotificationsActive = activeRoute === "/notifications";
  const isProfileActive = activeRoute === "/profile";

  return (
    <CSS.Content>
      <CSS.TabBar>
        <CSS.Tab
          onPress={() => {
            router.push("/home");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons
              name="home"
              size={24}
              color={isHomeActive ? "#121714" : "#688273"}
            />
            {isHomeActive ? (
              <CSS.TabText>Home</CSS.TabText>
            ) : (
              <CSS.TabTextInactive>Home</CSS.TabTextInactive>
            )}
          </CSS.IconContainer>
        </CSS.Tab>
        <CSS.Tab
          onPress={() => {
            // TODO: Navigate to explore/search screen
            console.log("Navigate to explore");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons
              name="search"
              size={24}
              color={isExploreActive ? "#121714" : "#688273"}
            />
            {isExploreActive ? (
              <CSS.TabText>Explore</CSS.TabText>
            ) : (
              <CSS.TabTextInactive>Explore</CSS.TabTextInactive>
            )}
          </CSS.IconContainer>
        </CSS.Tab>
        <CSS.Tab
          onPress={() => {
            router.push("/notifications");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons
              name="notifications"
              size={24}
              color={isNotificationsActive ? "#121714" : "#688273"}
            />
            {isNotificationsActive ? (
              <CSS.TabText>Notifications</CSS.TabText>
            ) : (
              <CSS.TabTextInactive>Notifications</CSS.TabTextInactive>
            )}
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
            // TODO: Navigate to profile screen
            console.log("Navigate to profile");
          }}
        >
          <CSS.IconContainer>
            <MaterialIcons
              name="person"
              size={24}
              color={isProfileActive ? "#121714" : "#688273"}
            />
            {isProfileActive ? (
              <CSS.TabText>Profile</CSS.TabText>
            ) : (
              <CSS.TabTextInactive>Profile</CSS.TabTextInactive>
            )}
          </CSS.IconContainer>
        </CSS.Tab>
      </CSS.TabBar>
    </CSS.Content>
  );
};
