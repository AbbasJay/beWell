import { Class } from "@/app/contexts/ClassesContext";
import { API_URL } from "@/env";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const useNotifications = (classes: Class) => {
  const sendNotification = async () => {
    try {
      let token;
      if (Platform.OS === "web") {
        token = localStorage.getItem("userToken");
      } else {
        token = await SecureStore.getItemAsync("userToken");
      }

      if (!token) {
        throw new Error("No authentication token found");
      }

      const notificationData = {
        classId: classes.id,
        message: "New booking for your class",
        userId: 12,
        read: false,
      };

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        console.error("Error response:", response);
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  sendNotification();
};
