import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { BusinessProvider } from "./contexts/BusinessContext";
import { SafeAreaView, View } from "react-native";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <BusinessProvider>
          <BeWellBackground>
            <Stack screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: Colors.light.secondary, paddingHorizontal: 10 },
            }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="logIn" />
              <Stack.Screen name="signUp" />
              <Stack.Screen name="home" />
              <Stack.Screen name="components" />
              <Stack.Screen name="business/[id]/classes" />
            </Stack>
          </BeWellBackground>
        </BusinessProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
