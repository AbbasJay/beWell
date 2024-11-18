import React from "react";
import { Stack, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";

import { ThemeProvider } from "@/hooks/themeContext";
import { Colors } from "@/constants/Colors";
import { BeWellTabBar } from "@/components/bewellTabBar";

import { BusinessProvider } from "./contexts/BusinessContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";

import { MaterialIcons } from "@expo/vector-icons";

export default function RootLayout() {
  const currentRoute = usePathname();
  const hideTabBarRoutes = ["/", "/logIn", "/signUp"];

  return (
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <NotificationsProvider>
            {!hideTabBarRoutes.includes(currentRoute) && (
              <NavigationBar
                title="Be Well"
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
                statusBarColor: "black",
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
