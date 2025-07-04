import { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { Class } from "@/app/contexts/ClassesContext";
import { Platform } from "react-native";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import { Notification } from "@/app/contexts/NotificationsContext";
import { API_URL } from "@/env";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const resetNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available - fetchNotifications");
      resetNotifications();
      return;
    }

    try {
      let token;
      if (Platform.OS === "web") {
        token = localStorage.getItem("accessToken");
      } else {
        token = await SecureStore.getItemAsync("accessToken");
      }

      if (!token) {
        console.log("No token found in useNotifications");
        resetNotifications();
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/mobile/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data);

      return data;
    } catch (error) {
      console.error("Error in useNotifications:", error);
      throw error;
    }
  }, [user?.id, resetNotifications]);

  const sendNotification = async (classData: Class) => {
    if (!user?.id) {
      console.log("No user ID available - sendNotification");
      return;
    }

    try {
      let token;
      if (Platform.OS === "web") {
        token = localStorage.getItem("accessToken");
      } else {
        token = await SecureStore.getItemAsync("accessToken");
      }

      if (!token) {
        throw new Error("No authentication token found");
      }

      const notification = {
        classId: classData.id,
        businessId: classData.businessId,
        message: classData.description,
        userId: user.id,
        title: classData.name,
        read: false,
      };

      const response = await fetch(
        `${API_URL}/api/mobile/classes/${classData.id}/book`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notification),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const responseData = await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  };

  return {
    notifications,
    fetchNotifications,
    sendNotification,
    resetNotifications,
  };
};
