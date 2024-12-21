import React, { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { useAuth } from "./contexts/auth/AuthContext";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { LoadingSpinner } from "./ui/loading-spinner";
import { View } from "react-native";
import { ErrorMessage } from "@/app/ui/error-message";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { token, isLoading, isGuestMode, error: authError } = useAuth();
  const currentRoute = usePathname();
  const [error, setError] = useState<Error | null>(null);

  // Routes where we don't want to show the tab bar or require auth
  const publicRoutes = ["/", "/logIn", "/signUp"];
  // Routes where we don't want to show the navigation bar
  const hideNavigationBarRoutes = ["/", "/home", "/logIn", "/signUp"];

  useEffect(() => {
    try {
      if (!token && !isGuestMode && !publicRoutes.includes(currentRoute)) {
        router.replace("/logIn");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication error'));
    }
  }, [token, isGuestMode, currentRoute]);

  if (isLoading) return <LoadingSpinner />;
  if (error || authError) return <ErrorMessage error={error || authError} />;

  return (
    <View style={{ flex: 1 }}>
      {!hideNavigationBarRoutes.includes(currentRoute) && (
        <NavigationBar
          title="beWell"
          left={{
            icon: <MaterialIcons name="arrow-back" size={24} color="black" />,
            onPress: () => router.back(),
          }}
        />
      )}
      
      {children}

      {!publicRoutes.includes(currentRoute) && <BeWellTabBar />}
    </View>
  );
} 