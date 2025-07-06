import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { AuthProvider } from "./auth/AuthContext";
import { BusinessProvider } from "./BusinessContext";
import { NotificationsProvider } from "./NotificationsContext";
import { BookingsProvider } from "./BookingsContext";
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
            <BookingsProvider>
              <ToastProvider>
                <MapViewProvider>{children}</MapViewProvider>
              </ToastProvider>
            </BookingsProvider>
          </NotificationsProvider>
        </BusinessProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
