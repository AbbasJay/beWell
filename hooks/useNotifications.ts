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
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
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

  const bookClass = async (classData: Class) => {
    if (!user?.id) {
      console.log("No user ID available - bookClass");
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

      // Simple log to show what ID is being sent
      console.log("Sending class ID to booking API:", classData.id);

      // Use the booking API which will automatically create the notification with the correct classId
      const response = await fetch(
        `${API_URL}/api/mobile/classes/${classData.id}/book`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          // No body needed - the booking API gets the classId from the URL params
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Booking API error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("Booking successful");
      return responseData; // Return the response data with updated class info
    } catch (error) {
      console.error("Error booking class:", error);
      throw error;
    }
  };

  // Cancel a booked class
  const cancelClass = async (classId: number) => {
    if (!user?.id) {
      console.log("No user ID available - cancelClass");
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

      console.log("Getting booking ID for class:", classId);

      // First, get the booking ID for this class
      const getBookingResponse = await fetch(
        `${API_URL}/api/mobile/classes/${classId}/book`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!getBookingResponse.ok) {
        const errorText = await getBookingResponse.text();
        console.error("Get booking API error:", errorText);
        throw new Error(
          `HTTP error! status: ${getBookingResponse.status}, message: ${errorText}`
        );
      }

      const bookingData = await getBookingResponse.json();
      const bookingId = bookingData.bookingId;

      console.log("Cancelling booking ID:", bookingId);

      // Now cancel the booking using the booking ID
      const cancelResponse = await fetch(
        `${API_URL}/api/mobile/classes/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!cancelResponse.ok) {
        const errorText = await cancelResponse.text();
        console.error("Cancel API error:", errorText);
        throw new Error(
          `HTTP error! status: ${cancelResponse.status}, message: ${errorText}`
        );
      }

      const responseData = await cancelResponse.json();
      console.log("Class cancelled successfully");
      return responseData; // Return the response data with updated class info
    } catch (error) {
      console.error("Error cancelling class:", error);
      throw error;
    }
  };

  const markNotificationsAsRead = useCallback(
    async (ids: number[]) => {
      if (!user?.id) {
        console.log("No user ID available - markNotificationsAsRead");
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
        const response = await fetch(`${API_URL}/api/mobile/notifications`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notificationIds: ids }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        return await response.json();
      } catch (error) {
        console.error("Error marking notifications as read:", error);
        throw error;
      }
    },
    [user?.id]
  );

  const deleteNotifications = useCallback(
    async (ids: number[]) => {
      if (!user?.id) {
        console.log("No user ID available - deleteNotifications");
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
        const response = await fetch(`${API_URL}/api/mobile/notifications`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notificationIds: ids }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        return await response.json();
      } catch (error) {
        console.error("Error deleting notifications:", error);
        throw error;
      }
    },
    [user?.id]
  );

  return {
    notifications,
    fetchNotifications,
    bookClass,
    cancelClass,
    resetNotifications,
    markNotificationsAsRead,
    deleteNotifications,
  };
};
