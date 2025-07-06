import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { useAuth } from "./contexts/auth/AuthContext";
import { useMapView } from "./contexts/MapViewContext";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { LoadingSpinner } from "./ui/loading-spinner";
import { View, StatusBar, Platform } from "react-native";
import { ErrorMessage } from "@/app/ui/error-message";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { tokens, isLoading, isGuestMode } = useAuth();
  const currentRoute = usePathname();
  const { isMapView } = useMapView();

  // Routes that don't require authentication
  const publicRoutes = ["/", "/logIn", "/signUp"];

  // Routes where we don't show the navigation bar
  const hideNavigationBarRoutes = ["/", "/home", "/logIn", "/signUp"];

  const shouldHideNavigationBar = () => {
    return hideNavigationBarRoutes.some((route) => {
      const routePattern = route.replace("[id]", "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentRoute);
    });
  };

  const shouldShowTabBar = () => {
    // Show on main sections
    const mainSections = [
      "/home",
      "/notifications",
      "/settings",
      "/explore",
      "/profile",
    ];

    // Show on business listing pages (but not detail pages)
    const isBusinessListing = currentRoute.match(/^\/business\/\d+\/classes$/);
    const isBusinessDetail = currentRoute.match(
      /^\/business\/\d+\/classes\/\d+$/
    );

    const shouldShow = !!(
      (mainSections.some((route) => route === currentRoute) ||
        (isBusinessListing && !isBusinessDetail)) &&
      !isMapView
    );

    console.log("TabBar Debug:", {
      currentRoute,
      isMapView,
      shouldShow,
    });

    return shouldShow;
  };

  useEffect(() => {
    // Don't do anything while loading or on public routes
    if (isLoading || publicRoutes.includes(currentRoute)) {
      return;
    }

    // Only redirect to login if trying to access protected route without auth
    if (!tokens?.accessToken && !isGuestMode) {
      router.replace("/logIn");
    }
  }, [currentRoute, tokens?.accessToken, isGuestMode, isLoading]);

  // Only show loading spinner for protected routes
  if (isLoading && !publicRoutes.includes(currentRoute)) {
    return <LoadingSpinner />;
  }

  // Status bar height for iOS/Android
  const STATUSBAR_HEIGHT =
    Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* Black status bar background */}
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ height: STATUSBAR_HEIGHT, backgroundColor: "black" }} />

      {/* Use new design for home screen */}
      {currentRoute === "/home" ? (
        <NavigationBar
          profileImageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCzyPAl8xpYctDPivROWxqGWa8z7pUbes25ziDhK6YarNZBddlBziHo0_8Sx-IXxfty6-gmkL_JRPR8oXcJ-QRbFchFXG2AQWVJnm0sqgLpHrO7tg5vFI9EiJhcnShcHCsQgNNHT9-v_rPfOYpStCfD21QfwZiKwe6eoVHHJcZ4TsSXvDsw6qEKd1Wtan4o_3ufxvnf_M7Mjifw_FmaG-Rd3Cg5Cd_EXHM23tA_mBg0QEsEHmay9MhFYD9EhST2QH-sQDoeZ8FQEaqz"
          showSettings
          right={{
            icon: <MaterialIcons name="menu" size={24} color="#121714" />,
            onPress: () => router.push("/settings"),
          }}
        />
      ) : currentRoute === "/notifications" ? (
        <NavigationBar
          title="Notifications"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="#121714" />,
            onPress: () => router.back(),
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
