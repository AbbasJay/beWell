import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import { useBookingsContext } from "@/app/contexts/BookingsContext";
import { Business, useBusinessContext } from "@/app/contexts/BusinessContext";
import { useProfileImage } from "@/app/contexts/ProfileImageContext";
import { BeWellBackground } from "@/app/ui/be-well-background/be-well-background";
import { ProfileImage } from "@/app/ui/profile-image";
import { LoadingSpinner } from "@/app/ui/loading-spinner";
import { OptimizedImage } from "@/app/ui/optimized-image";
import * as CSS from "./styles/profile";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const { bookings, isLoading: bookingsLoading } = useBookingsContext();
  const { businesses } = useBusinessContext();
  const { profileImageUri, uploadProfileImage, isLoading } = useProfileImage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const now = new Date();

  const upcomingClasses = bookings.filter((booking: any) => {
    const classDateTime = new Date(
      `${booking.classStartDate} ${booking.classTime}`
    );
    return classDateTime > now;
  });

  const historyClasses = bookings.filter((booking: any) => {
    const classDateTime = new Date(
      `${booking.classStartDate} ${booking.classTime}`
    );
    return classDateTime <= now;
  });

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  const handleImageChange = (uri: string | null) => {
    if (uri) {
      uploadProfileImage(uri);
    }
  };

  const renderClassItem = (booking: any, isUpcoming: boolean = false) => {
    const businessId = booking.businessId;

    const business = businesses.find((b: Business) => b.id === businessId);

    return (
      <CSS.ClassItem
        key={booking.id}
        onPress={
          isUpcoming
            ? () => {
                if (!business || !business.id) {
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
        <OptimizedImage
          source={null} // Class history doesn't have individual class photos
          width={48}
          height={48}
          borderRadius={8}
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <CSS.ProfileSection>
            <ProfileImage
              userName={user?.name || "User"}
              imageUri={profileImageUri || undefined}
              onImageChange={handleImageChange}
              size={128}
              isLoading={isLoading}
            />
            <CSS.ProfileInfo>
              <CSS.ProfileName>{user?.name || "User"}</CSS.ProfileName>
            </CSS.ProfileInfo>
          </CSS.ProfileSection>

          <CSS.SectionTitle>Upcoming</CSS.SectionTitle>
          {bookingsLoading ? (
            <LoadingSpinner />
          ) : upcomingClasses.length === 0 ? (
            <CSS.EmptyText>No upcoming classes</CSS.EmptyText>
          ) : (
            upcomingClasses.map((booking: any) =>
              renderClassItem(booking, true)
            )
          )}

          <CSS.SectionTitle>History</CSS.SectionTitle>
          {bookingsLoading ? (
            <LoadingSpinner />
          ) : historyClasses.length === 0 ? (
            <CSS.EmptyText>No class history</CSS.EmptyText>
          ) : (
            historyClasses.map((booking: any) =>
              renderClassItem(booking, false)
            )
          )}

          <CSS.BottomSpacing />
        </ScrollView>
      </CSS.Container>
    </BeWellBackground>
  );
}
