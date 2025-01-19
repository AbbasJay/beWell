import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AppProviders } from "./contexts/AppProviders";
import { AuthenticatedLayout } from "./AuthenticatedLayout";

export default function RootLayout() {
  return (
    <AppProviders>
      <PaperProvider>
        <AuthenticatedLayout>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="logIn" />
            <Stack.Screen name="signUp" />
            <Stack.Screen name="home" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="business/[id]/classes" />
          </Stack>
        </AuthenticatedLayout>
      </PaperProvider>
    </AppProviders>
  );
}
