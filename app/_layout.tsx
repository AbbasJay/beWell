import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { BusinessProvider } from "./contexts/BusinessContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="logIn" options={{ headerShown: false }} />
            <Stack.Screen name="signUp" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen
              name="business/:id/classes"
              options={{ headerShown: false }}
            />
          </Stack>
        </BusinessProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
