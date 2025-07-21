import React from "react";
import { ThemeProvider } from "@/hooks/themeContext";
import { AuthProvider } from "./auth/AuthContext";
import { BusinessProvider } from "./BusinessContext";
import { NotificationsProvider } from "./NotificationsContext";
import { BookingsProvider } from "./BookingsContext";
import { ToastProvider } from "./ToastContext";
import { MapViewProvider } from "./MapViewContext";
import { ReviewsProvider } from "./ReviewsContext";
import { ProfileImageProvider } from "./ProfileImageContext";

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
                <ReviewsProvider>
                  <ProfileImageProvider>
                    <MapViewProvider>{children}</MapViewProvider>
                  </ProfileImageProvider>
                </ReviewsProvider>
              </ToastProvider>
            </BookingsProvider>
          </NotificationsProvider>
        </BusinessProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
