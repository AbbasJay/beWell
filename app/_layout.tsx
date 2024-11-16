import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { Stack, useRouter, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { BusinessProvider } from "./contexts/BusinessContext";
import { Colors } from "@/constants/Colors";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NotificationsProvider } from "./contexts/NotificationsContext";

export default function RootLayout() {
  const currentRoute = usePathname();
  const hideTabBarRoutes = ["/", "/logIn", "/signUp"];

  return (
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <NotificationsProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.light.secondary },
                statusBarStyle: "dark",
                statusBarColor: Colors.light.primary,
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
