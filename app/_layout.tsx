import { ThemeProvider } from "@/hooks/themeContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </PaperProvider>
    </ThemeProvider>
  );
}
