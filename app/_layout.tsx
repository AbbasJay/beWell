import React, { useEffect, useState } from "react";
import { router, Stack, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { ThemeProvider } from "@/hooks/themeContext";
import { Colors } from "@/constants/Colors";
import { BeWellTabBar } from "@/components/bewellTabBar";

import { BusinessProvider } from "./contexts/BusinessContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import { UserProvider } from "./contexts/UserContext";

import { MaterialIcons } from "@expo/vector-icons";
import { getToken } from "@/app/utils/helper-functions/get-token";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const currentRoute = usePathname();
  const hideTabBarRoutes = ["/", "/logIn", "/signUp"];
  const hideNavigationBarRoutes = ["/", "/home", "/logIn", "/signUp"];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();

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
        <UserProvider>
          <BusinessProvider>
            <NotificationsProvider>
              {!hideNavigationBarRoutes.includes(currentRoute) && (
                <NavigationBar
                  title="beWell"
                  left={{
                    icon: (
                      <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color="black"
                      />
                    ),
                  }}
                />
              )}
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: Colors.light.secondary },
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
        </UserProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
