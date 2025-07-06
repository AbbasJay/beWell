import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { AuthProvider } from "./auth/AuthContext";
import { BusinessProvider } from "./BusinessContext";
import { NotificationsProvider } from "./NotificationsContext";
import { ToastProvider } from "./ToastContext";
import { MapViewProvider } from "./MapViewContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BusinessProvider>
          <NotificationsProvider>
            <ToastProvider>
              <MapViewProvider>{children}</MapViewProvider>
            </ToastProvider>
          </NotificationsProvider>
        </BusinessProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
