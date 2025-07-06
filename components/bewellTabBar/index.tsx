import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";
import * as CSS from "./styles";
import { ErrorMessage } from "@/app/ui/error-message";

interface BeWellTabBarProps {
  visible?: boolean;
}

export const BeWellTabBar = ({ visible = true }: BeWellTabBarProps) => {
  const { unreadNotificationsCount } = useNotificationsContext();
  const [activeRoute, setActiveRoute] = useState("");
  const currentRoute = usePathname();
  const [error, setError] = useState<Error | null>(null);
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 100)).current;

  useEffect(() => {
    try {
      setActiveRoute(currentRoute);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Navigation error"));
    }
  }, [currentRoute]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, fadeAnim, slideAnim]);

  if (error) return <ErrorMessage error={error} />;

  const isHomeActive = activeRoute === "/home";
  const isExploreActive = activeRoute === "/explore";
  const isNotificationsActive = activeRoute === "/notifications";
  const isProfileActive = activeRoute === "/profile";

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        zIndex: visible ? 1000 : -1,
      }}
    >
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
    </Animated.View>
  );
};
