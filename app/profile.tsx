import React from "react";
import { ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "./contexts/auth/AuthContext";
import { useBookingsContext } from "./contexts/BookingsContext";
import { useBusinessContext } from "./contexts/BusinessContext";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { LoadingSpinner } from "./ui/loading-spinner";
import * as CSS from "./styles/profile";

export default function Profile() {
  const { user } = useAuth();
  const { bookings, isLoading: bookingsLoading } = useBookingsContext();
  const { businesses } = useBusinessContext();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      }
    }
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Filter bookings by date
  const now = new Date();
  const upcomingClasses = bookings.filter((booking) => {
    const classDateTime = new Date(
      `${booking.classStartDate} ${booking.classTime}`
    );
    return classDateTime > now;
  });

  const historyClasses = bookings.filter((booking) => {
    const classDateTime = new Date(
      `${booking.classStartDate} ${booking.classTime}`
    );
    return classDateTime <= now;
  });

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const renderClassItem = (booking: any, isUpcoming: boolean = false) => {
    // Get businessId directly from the booking (now available from API)
    const businessId = booking.businessId;

    // Find the business in context
    const business = businesses.find((b) => b.id === businessId);

    return (
      <CSS.ClassItem
        key={booking.id}
        onPress={
          isUpcoming
            ? () => {
                if (!business || !business.id) {
                  // Instead of showing an alert, try to navigate directly using the businessId from the booking
                  const classId = booking.classId;
                  if (!classId) {
                    alert("Class ID not found for this class.");
                    return;
                  }

                  router.push({
                    pathname:
                      `/business/${businessId}/classes/${classId}` as any,
                  });
                  return;
                }
                const classId = booking.classId;
                if (!classId) {
                  alert("Class ID not found for this class.");
                  return;
                }
                router.push({
                  pathname:
                    `/business/${business.id}/classes/${classId}` as any,
                });
              }
            : undefined
        }
        style={isUpcoming ? { opacity: 1 } : { opacity: 0.7 }}
      >
        <CSS.ClassImage
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4T5hcW65T0DjjSlg6zwB9dYMMS6JwiXh7RuE_grj3cxV04unetmsJoR6K6EnXDLssRPrgH_uyJj6pE__ZrE50qk4kQJTKn9QR7dTHcfDnwORnMwZd-bQn6mnlDABOLETlGqUuTCM_WyxwJa3110u1E-zsdeNlUSylovJehYy4HxopYN7JlghbT521AmVfqs_mSl3RtKOfSjh2SZb6pupbapr9i_iGv_fpKUVSDBLT0R2NAFmWr4ax6JFOtHCxpWBFnneR54lrHwNu",
          }}
        />
        <CSS.ClassInfo>
          <CSS.ClassTime>
            {formatDate(booking.classStartDate)},{" "}
            {formatTime(booking.classTime)}
          </CSS.ClassTime>
          <CSS.ClassName>{booking.className}</CSS.ClassName>
        </CSS.ClassInfo>
      </CSS.ClassItem>
    );
  };

  return (
    <BeWellBackground>
      <CSS.Container>
        <CSS.Header>
          <CSS.HeaderTitle>Profile</CSS.HeaderTitle>
          <CSS.SettingsButton onPress={handleSettingsPress}>
            <MaterialIcons name="settings" size={24} color="#111714" />
          </CSS.SettingsButton>
        </CSS.Header>

        <ScrollView showsVerticalScrollIndicator={false}>
          <CSS.ProfileSection>
            <CSS.ProfileImage
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKIMrWsV0o163zBTc4iEeXjfXdld9rEuztVhc841PW3S-CuQr0Y6QyH0W0KBJ8A4Ln_ZlvhCKf2_ua-h9yP_dSCXTcgO__NGHoYVLCwBHLv8juQzgPflvUge4THk50Rd2fEVqde7mJgHF-c5igiMxuCS_oUvxhbNQKzCfxd1ah0Ov-WXQVBtBAmp0wLqJvj0cOkKYgi_EpGZnw6853DIfJiZ3wXuNzmB0jaKRlEeNG01NDYkLzJNVp1UmqbR9bW1Rl6qUKrDHFSLZk",
              }}
            />
            <CSS.ProfileInfo>
              <CSS.ProfileName>{user?.name || "Sophia Carter"}</CSS.ProfileName>
            </CSS.ProfileInfo>
          </CSS.ProfileSection>

          <CSS.SectionTitle>Upcoming</CSS.SectionTitle>
          {bookingsLoading ? (
            <LoadingSpinner />
          ) : upcomingClasses.length === 0 ? (
            <CSS.EmptyText>No upcoming classes</CSS.EmptyText>
          ) : (
            upcomingClasses.map((booking) => renderClassItem(booking, true))
          )}

          <CSS.SectionTitle>History</CSS.SectionTitle>
          {bookingsLoading ? (
            <LoadingSpinner />
          ) : historyClasses.length === 0 ? (
            <CSS.EmptyText>No class history</CSS.EmptyText>
          ) : (
            historyClasses.map((booking) => renderClassItem(booking, false))
          )}

          <CSS.BottomSpacing />
        </ScrollView>
      </CSS.Container>
    </BeWellBackground>
  );
}
