import React, { useEffect, useState } from "react";
import { router, Stack, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { ThemeProvider } from "@/hooks/themeContext";
import { Colors } from "@/constants/Colors";
import { BeWellTabBar } from "@/components/bewellTabBar";

import { BusinessProvider } from "./contexts/BusinessContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";

import { MaterialIcons } from "@expo/vector-icons";

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const currentRoute = usePathname();
  const hideTabBarRoutes = ["/", "/logIn", "/signUp"];
  const hideNavigationBarRoutes = ["/", "/home", "/logIn", "/signUp"];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token;
        if (Platform.OS === "web") {
          token = localStorage.getItem("userToken");
        } else {
          token = await SecureStore.getItemAsync("userToken");
        }

        if (!token && !hideTabBarRoutes.includes(currentRoute)) {
          router.replace("/logIn");
        }
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [currentRoute]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <NotificationsProvider>
            {!hideNavigationBarRoutes.includes(currentRoute) && (
              <NavigationBar
                title="beWell"
                left={{
                  icon: (
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                  ),
                }}
              />
            )}
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.light.secondary },
                // statusBarStyle: "dark",
                // statusBarColor: "black",
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="logIn" />
              <Stack.Screen name="signUp" />
              <Stack.Screen name="home" />
              <Stack.Screen name="components" />
              <Stack.Screen name="business/[id]/classes" />
            </Stack>
            {!hideTabBarRoutes.includes(currentRoute) && <BeWellTabBar />}
          </NotificationsProvider>
        </BusinessProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
