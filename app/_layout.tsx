import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { BusinessProvider } from "./contexts/BusinessContext";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  return (
    // <SafeAreaView>
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: true }} />
            <Stack.Screen name="logIn" options={{ headerShown: true }} />
            <Stack.Screen name="signUp" options={{ headerShown: true }} />
            <Stack.Screen name="home" options={{ headerShown: true }} />
            <Stack.Screen
              name="business/[id]/classes"
              options={{ headerShown: true }}
            />
          </Stack>
        </BusinessProvider>
      </PaperProvider>
    </ThemeProvider>
    // </SafeAreaView>
  );
}
