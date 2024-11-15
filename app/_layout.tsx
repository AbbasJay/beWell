import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { BusinessProvider } from "./contexts/BusinessContext";
import { SafeAreaView, View } from "react-native";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";

export default function RootLayout() {
  return (
    // <SafeAreaView>
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <BeWellBackground>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="logIn" options={{ headerShown: false }} />
              <Stack.Screen name="signUp" options={{ headerShown: false }} />
              <Stack.Screen name="home" options={{ headerShown: false }} />
              <Stack.Screen
                name="business/[id]/classes"
                options={{ headerShown: false }}
              />
            </Stack>
          </BeWellBackground>
        </BusinessProvider>
      </PaperProvider>
    </ThemeProvider>
    // </SafeAreaView>
  );
}
