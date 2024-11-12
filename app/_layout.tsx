import { ThemeProvider } from "@/hooks/themeContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="logInPage" options={{ headerShown: false }} />
          <Stack.Screen name="signUpPage" options={{ headerShown: false }} />
          <Stack.Screen name="homePage" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </ThemeProvider>
  );
}
