import { Class } from "@/app/contexts/ClassesContext";
import { API_URL } from "@/env";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const useNotifications = async (
  classes?: Class,
  userId?: number,
  method?: string
) => {
  let result;

  if (method === "GET") {
    result = await getNotifications();
  } else if (method === "POST") {
    result = await sendNotification();
  } else if (method === "PUT") {
    result = await updateNotification();
  } else if (method === "DELETE") {
    result = await deleteNotification();
  }

  return result;

  async function getNotifications() {
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

      const response = await fetch(`${API_URL}/api/notifications`, {
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
      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  async function sendNotification() {
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

      const notification = {
        classId: classes?.id,
        businessId: classes?.businessId,
        message: "new test",
        userId: userId,
        read: false,
      };

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  async function updateNotification() {
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

      const notification = {
        classId: classes?.id,
        businessId: classes?.businessId,
        message: "new test",
        userId: userId,
        read: true,
      };

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  async function deleteNotification() {
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

      const response = await fetch(
        `${API_URL}/api/notifications/${classes?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }
};
