import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { useAuth } from "./contexts/auth/AuthContext";
import { useMapView } from "./contexts/MapViewContext";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import { MaterialIcons } from "@expo/vector-icons";

import { LoadingSpinner } from "./ui/loading-spinner";
import { View, StatusBar, Platform } from "react-native";
import { NotificationsMenuTrigger } from "./notifications";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useProfileImage } from "@/app/contexts/ProfileImageContext";
import { isPublicRoute } from "@/utils/routeUtils";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { tokens, isLoading, isGuestMode, user } = useAuth();
  const currentRoute = usePathname();
  const { isMapView } = useMapView();

  // Add notifications context and handlers for menu
  const notificationsCtx = useNotificationsContext();
  const { markNotificationsAsRead, deleteNotifications } = useNotifications();
  const { profileImageUri } = useProfileImage();

  // Add menu handlers for notifications
  const handleMarkAllAsRead = async (ids: number[]) => {
    try {
      await markNotificationsAsRead(ids);
      ids.forEach(notificationsCtx.markAsRead); // optimistic UI
      await notificationsCtx.refreshNotifications();
    } catch (error) {
      // Optionally show error to user
    }
  };
  const handleDeleteAll = async (ids: number[]) => {
    try {
      await deleteNotifications(ids);
      await notificationsCtx.refreshNotifications();
    } catch (error) {
      // Optionally show error to user
    }
  };

  const hideNavigationBarRoutes = ["/", "/home", "/logIn", "/signUp"];

  const shouldHideNavigationBar = () => {
    return hideNavigationBarRoutes.some((route) => {
      const routePattern = route.replace("[id]", "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentRoute);
    });
  };

  const shouldShowTabBar = () => {
    const mainSections = [
      "/",
      "/notifications",
      "/settings",
      "/explore",
      "/profile",
    ];

    const isBusinessListing = currentRoute.match(/^\/business\/\d+\/classes$/);
    const isBusinessDetail = currentRoute.match(
      /^\/business\/\d+\/classes\/\d+$/
    );

    const shouldShow = !!(
      (mainSections.some((route) => route === currentRoute) ||
        (isBusinessListing && !isBusinessDetail)) &&
      !isMapView
    );

    return shouldShow;
  };

  useEffect(() => {
    if (isLoading || isPublicRoute(currentRoute)) {
      return;
    }

    const isAuthenticated = tokens?.accessToken && user && !isGuestMode;

    if (!isAuthenticated) {
      if (currentRoute !== "/logIn") {
        router.replace("/logIn");
      }
    }
  }, [currentRoute, tokens?.accessToken, user, isGuestMode, isLoading]);

  if (isLoading && !isPublicRoute(currentRoute)) {
    return <LoadingSpinner />;
  }

  // Status bar height for iOS/Android
  const STATUSBAR_HEIGHT =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

  return (
    <View style={{ flex: 1, backgroundColor: "black", position: "relative" }}>
      {/* Black status bar background */}
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ height: STATUSBAR_HEIGHT, backgroundColor: "black" }} />

      {currentRoute === "/home" ? (
        <NavigationBar
          profileImageUri={profileImageUri || undefined}
          showSettings
          right={{
            icon: <MaterialIcons name="menu" size={24} color="#121714" />,
            onPress: () => router.push("/settings"),
          }}
        />
      ) : currentRoute === "/explore" ? (
        <NavigationBar
          title="Find a class or instructor"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="#121714" />,
            onPress: () => router.back(),
          }}
        />
      ) : currentRoute === "/notifications" ? (
        <NavigationBar
          title="Notifications"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="#121714" />,
            onPress: () => router.back(),
          }}
          right={{
            icon: (
              <NotificationsMenuTrigger
                unreadIds={notificationsCtx.notifications
                  .filter((n) => !n.read)
                  .map((n) => n.id)}
                notifications={notificationsCtx.notifications}
                loading={false}
                deleting={false}
                handleMarkAllAsRead={handleMarkAllAsRead}
                handleDeleteAll={handleDeleteAll}
              />
            ),
          }}
        />
      ) : currentRoute === "/profile" ? (
        <NavigationBar
          title="Profile"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="#121714" />,
            onPress: () => router.back(),
          }}
          right={{
            icon: <MaterialIcons name="settings" size={24} color="#121714" />,
            onPress: () => router.push("/settings"),
          }}
        />
      ) : currentRoute.match(/^\/business\/\d+\/classes$/) ? (
        <NavigationBar
          title="Classes"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="#111714" />,
            onPress: () => router.back(),
          }}
        />
      ) : currentRoute.match(/^\/business\/\d+\/classes\/\d+$/) ? (
        <NavigationBar
          title="Class Details"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="#111714" />,
            onPress: () => router.back(),
          }}
        />
      ) : (
        !shouldHideNavigationBar() && (
          <NavigationBar
            left={{
              icon: <MaterialIcons name="arrow-back" size={24} color="black" />,
              onPress: () => router.back(),
            }}
          />
        )
      )}

      {children}

      <BeWellTabBar visible={shouldShowTabBar()} />
    </View>
  );
}
