import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { BusinessProvider } from "./contexts/BusinessContext";
import { SafeAreaView, View } from "react-native";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";

export default function RootLayout() {
  const headerShown = true;
  return (
    // <SafeAreaView>
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <BeWellBackground>
            <Stack>
              <Stack.Screen
                name="index"
                options={{ headerShown: headerShown }}
              />
              <Stack.Screen
                name="logIn"
                options={{ headerShown: headerShown }}
              />
              <Stack.Screen
                name="signUp"
                options={{ headerShown: headerShown }}
              />
              <Stack.Screen
                name="home"
                options={{ headerShown: headerShown }}
              />
              <Stack.Screen
                name="business/[id]/classes"
                options={{ headerShown: headerShown }}
              />
            </Stack>
          </BeWellBackground>
        </BusinessProvider>
      </PaperProvider>
    </ThemeProvider>
    // </SafeAreaView>
  );
}
