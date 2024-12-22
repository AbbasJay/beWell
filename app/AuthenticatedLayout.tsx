import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { useAuth } from "./contexts/auth/AuthContext";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { LoadingSpinner } from "./ui/loading-spinner";
import { View } from "react-native";
import { ErrorMessage } from "@/app/ui/error-message";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {

  const { tokens, isLoading, isGuestMode } = useAuth();
  const currentRoute = usePathname();

  const tabBarRoutes = ["/", "/logIn", "/signUp", 'home'];

  // Routes that don't require authentication
  const publicRoutes = ["/", "/logIn", "/signUp"];
  
  // Routes where we don't show the navigation bar
  const hideNavigationBarRoutes = ["/", "/home", "/logIn", "/signUp"];

  const shouldHideNavigationBar = () => {
    return hideNavigationBarRoutes.some(route => {
      const routePattern = route.replace('[id]', '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentRoute);
    });
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

  return (
    <View style={{ flex: 1 }}>
      {!shouldHideNavigationBar() && (
        <NavigationBar
          title="beWell"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="black" />,
            onPress: () => router.back(),
          }}
        />
      )}
      
      {children}

      {!tabBarRoutes.includes(currentRoute) && <BeWellTabBar />}
    </View>
  );
} 