import React from 'react';
import { ThemeProvider } from '@/hooks/themeContext';
import { AuthProvider } from './auth/AuthContext';
import { BusinessProvider } from './BusinessContext';
import { NotificationsProvider } from './NotificationsContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}; 