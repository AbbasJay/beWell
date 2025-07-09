import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter, usePathname } from "expo-router";
import { useBusinessContext, Business } from "@/app/contexts/BusinessContext";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { useBookingsContext } from "@/app/contexts/BookingsContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import {
  useClassesContext,
  Class,
  ClassesProvider,
} from "@/app/contexts/ClassesContext";
import { LoadingSpinner } from "@/app/ui/loading-spinner";
import { ErrorMessage } from "@/app/ui/error-message";
import { useToast } from "@/app/contexts/ToastContext";
import { MaterialIcons } from "@expo/vector-icons";
import {
  formattedStartDate,
  formatDuration,
} from "@/app/utils/helper-functions/format-time-and-dates";
import {
  ReviewsSummary,
  ReviewsList,
  ReviewForm,
} from "../../../ui/class-reviews";
import { useReviewsContext } from "@/app/contexts/ReviewsContext";

import * as CSS from "./styles";

// Mock schedule data
const mockSchedule = [
  { day: "Monday", time: "10:00 AM - 11:00 AM" },
  { day: "Wednesday", time: "6:00 PM - 7:00 PM" },
  { day: "Saturday", time: "9:00 AM - 10:00 AM" },
];

export default function ClassDetailsScreen() {
  const { id: businessId, classId } = useLocalSearchParams<{
    id: string;
    classId: string;
  }>();

  if (!businessId || !classId) {
    return (
      <ErrorMessage error={new Error("Missing business ID or class ID")} />
    );
  }

  return (
    <ClassesProvider businessId={Number(businessId)}>
      <ClassDetailsContent />
    </ClassesProvider>
  );
}

function ClassDetailsContent() {
  const { businesses } = useBusinessContext();
  const { classes, isLoading } = useClassesContext();
  const { id: businessId, classId } = useLocalSearchParams<{
    id: string;
    classId: string;
  }>();
  const [error, setError] = useState<Error | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "booking" | "cancelling" | null
  >(null);
  const { refreshNotifications } = useNotificationsContext();
  const { refreshBookings } = useBookingsContext();
  const { bookClass, cancelClass } = useNotifications();
  const { updateClassBookingStatus, refreshClasses } = useClassesContext();
  const { user, setRedirectPath } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { fetchReviews } = useReviewsContext();

  useEffect(() => {
    if (classId) {
      fetchReviews(Number(classId));
    }
  }, [classId]);

  // Memoize the business lookup to prevent unnecessary re-renders
  const foundBusiness = useMemo(() => {
    return businesses.find((b) => b.id === Number(businessId));
  }, [businesses, businessId]);

  // Get the real class data from the classes context
  const classItem = useMemo(() => {
    return classes.find((c) => c.id === Number(classId));
  }, [classes, classId]);

  useEffect(() => {
    if (!businessId || !classId) {
      setError(new Error("Missing business ID or class ID"));
      return;
    }

    if (!foundBusiness) {
      setError(new Error("Business not found"));
      return;
    }

    setBusiness(foundBusiness);
    setError(null);
  }, [businessId, classId, foundBusiness]);

  if (error) return <ErrorMessage error={error} />;
  if (!business || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner />
      </View>
    );
  }

  if (!classItem) {
    return <ErrorMessage error={new Error("Class not found")} />;
  }

  // Check if user has an active booking for this class (only active bookings can be cancelled)
  const hasBooked =
    classItem.isBooked === true && classItem.bookingStatus === "active";

  // Debug logging
  console.log("=== CLASS DETAILS DEBUG ===");
  console.log("Class ID:", classItem.id);
  console.log("User ID:", user?.id);
  console.log("Class isBooked field:", classItem.isBooked);
  console.log("Has booked this class:", hasBooked);
  console.log("Full class item:", JSON.stringify(classItem, null, 2));
  console.log("=== END CLASS DETAILS DEBUG ===");

  const handleBookClass = async () => {
    if (!user) {
      setRedirectPath(pathname);
      router.push("/logIn");
      return;
    }

    setIsBooking(true);
    setCurrentAction("booking");
    try {
      await bookClass(classItem);
      updateClassBookingStatus(classItem.id, true);
      await refreshNotifications();
      await refreshBookings();
      showToast(`Successfully booked ${classItem.name}!`, "success");
      // Refresh classes to get updated data from backend
      await refreshClasses();
      router.back();
    } catch (err) {
      console.error("Error booking class:", err);

      // If the error is "You have already booked this class", refresh the classes data
      // to get the correct booking status
      if (
        err instanceof Error &&
        err.message.includes("You have already booked this class")
      ) {
        console.log("User has already booked this class, refreshing data...");
        try {
          await refreshClasses();
          showToast("You have already booked this class", "info");
        } catch (refreshError) {
          showToast("Failed to refresh class data", "error");
        }
      } else {
        setError(
          err instanceof Error ? err : new Error("Failed to book class")
        );
        showToast("Failed to book class", "error");
      }
    } finally {
      setIsBooking(false);
      setCurrentAction(null);
    }
  };

  const handleCancelClass = async () => {
    if (!user) {
      setRedirectPath(pathname);
      router.push("/logIn");
      return;
    }

    setIsCancelling(true);
    setCurrentAction("cancelling");
    try {
      await cancelClass(classItem.id);
      updateClassBookingStatus(classItem.id, false);
      await refreshNotifications();
      await refreshBookings();
      showToast(`Successfully cancelled ${classItem.name}!`, "success");
      // Refresh classes to get updated data from backend
      await refreshClasses();
      router.back();
    } catch (err) {
      console.error("Error cancelling class:", err);

      // If there's an error cancelling, refresh the classes data to get the correct status
      try {
        await refreshClasses();
      } catch (refreshError) {
        console.error("Error refreshing classes:", refreshError);
      }

      setError(
        err instanceof Error ? err : new Error("Failed to cancel class")
      );
      showToast("Failed to cancel class", "error");
    } finally {
      setIsCancelling(false);
      setCurrentAction(null);
    }
  };

  const handleManualRefresh = async () => {
    console.log("Manual refresh triggered");
    try {
      await refreshClasses();
      showToast("Classes data refreshed", "success");
    } catch (error) {
      console.error("Error during manual refresh:", error);
      showToast("Failed to refresh data", "error");
    }
  };

  const renderStars = (rating: number, size: number = 18) => {
    return Array.from({ length: 5 }, (_, i) => (
      <MaterialIcons
        key={i}
        name={i < rating ? "star" : "star-border"}
        size={size}
        color={i < rating ? "#111714" : "#bccdc3"}
      />
    ));
  };

  console.log("Class Item:", classItem);

  return (
    <CSS.Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <CSS.ImageContainer>
          <CSS.HeroImage
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuZpxL2qDLHyzg3_bnb8lbGigeRVyjUkI9RfW9nRMB6xHTgGSh_YL3dh4eR8kO4hKO8I4qVWH4rrvqW9-ZcHOZO8cDEBBz8u2dkXBcTSDlW5DujQ0QKvTlXewoJc-pb67doFv5vd2U-O9bQGTOzIo6PJfZIGyEBZwlV08ews8w7K_Nd-OwqAJbZxsfirXguCd1U3c_DdyDId-dkqnl7uRgREezubfA2pq48nHHfwOlT3I3rrIIIRGxgRAerbEiNHbvj9vfzmaKe0mr",
            }}
            resizeMode="cover"
            fadeDuration={0}
          />
        </CSS.ImageContainer>

        {/* Class Info */}
        <CSS.Content>
          <CSS.ClassTitle>{classItem.name}</CSS.ClassTitle>
          <CSS.ClassDescription>{classItem.description}</CSS.ClassDescription>

          {/* Class Details */}
          <CSS.ClassDetails>
            <CSS.DetailItem>
              <CSS.DetailIcon>
                <MaterialIcons name="person" size={20} color="#111714" />
              </CSS.DetailIcon>
              <CSS.DetailInfo>
                <CSS.DetailLabel>Instructor</CSS.DetailLabel>
                <CSS.DetailValue>{classItem.instructor}</CSS.DetailValue>
              </CSS.DetailInfo>
            </CSS.DetailItem>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              onPress={() => {
                // Navigate to home page with map view focused on this business
                if (business.id) {
                  router.push({
                    pathname: "/home",
                    params: {
                      mapView: "true",
                      focusBusinessId: business.id.toString(),
                    },
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <CSS.DetailIcon>
                <MaterialIcons name="location-on" size={20} color="#111714" />
              </CSS.DetailIcon>
              <CSS.DetailInfo>
                <CSS.DetailLabel>Location</CSS.DetailLabel>
                <CSS.DetailValue>
                  {business.address}, {classItem.location}
                </CSS.DetailValue>
              </CSS.DetailInfo>
              <MaterialIcons
                name="open-in-new"
                size={16}
                color="#648772"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            <CSS.DetailItem>
              <CSS.DetailIcon>
                <MaterialIcons name="schedule" size={20} color="#111714" />
              </CSS.DetailIcon>
              <CSS.DetailInfo>
                <CSS.DetailLabel>Duration</CSS.DetailLabel>
                <CSS.DetailValue>
                  {formatDuration(classItem.duration)}
                </CSS.DetailValue>
              </CSS.DetailInfo>
            </CSS.DetailItem>
            <CSS.DetailItem>
              <CSS.DetailIcon>
                <MaterialIcons name="event" size={20} color="#111714" />
              </CSS.DetailIcon>
              <CSS.DetailInfo>
                <CSS.DetailLabel>Next Class</CSS.DetailLabel>
                <CSS.DetailValue>
                  {formattedStartDate(classItem.startDate)}
                </CSS.DetailValue>
              </CSS.DetailInfo>
            </CSS.DetailItem>
          </CSS.ClassDetails>

          {/* Reviews Section */}
          <CSS.SectionTitle>Reviews</CSS.SectionTitle>
          <ReviewsSummary />

          <ReviewsList />

          <ReviewForm />

          {/* Schedule Section */}
          <CSS.SectionTitle>Schedule</CSS.SectionTitle>
          {mockSchedule.map((schedule, index) => (
            <CSS.ScheduleItem key={index}>
              <CSS.ScheduleIcon>
                <MaterialIcons name="event" size={24} color="#111714" />
              </CSS.ScheduleIcon>
              <CSS.ScheduleInfo>
                <CSS.ScheduleDay>{schedule.day}</CSS.ScheduleDay>
                <CSS.ScheduleTime>{schedule.time}</CSS.ScheduleTime>
              </CSS.ScheduleInfo>
            </CSS.ScheduleItem>
          ))}
        </CSS.Content>
        {/* Bottom spacing for book button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Debug Button (temporary) */}
      <View
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          onPress={handleManualRefresh}
          style={{
            backgroundColor: "#007AFF",
            padding: 8,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Book Button */}
      <CSS.BookButtonContainer>
        <CSS.BookButton
          onPress={
            hasBooked
              ? handleCancelClass
              : classItem.bookingStatus === "completed" ||
                classItem.bookingStatus === "no-show"
              ? undefined // No action for completed/no-show
              : handleBookClass
          }
          disabled={
            isBooking ||
            isCancelling ||
            classItem.bookingStatus === "completed" ||
            classItem.bookingStatus === "no-show"
          }
          style={
            hasBooked
              ? { backgroundColor: "#d9534f" }
              : classItem.bookingStatus === "completed"
              ? { backgroundColor: "#28a745" }
              : classItem.bookingStatus === "no-show"
              ? { backgroundColor: "#ffc107" }
              : undefined
          }
        >
          <CSS.BookButtonText>
            {currentAction === "booking"
              ? "Booking..."
              : currentAction === "cancelling"
              ? "Cancelling..."
              : hasBooked
              ? "Cancel"
              : classItem.bookingStatus === "completed"
              ? "Completed"
              : classItem.bookingStatus === "no-show"
              ? "No Show"
              : "Book Class"}
          </CSS.BookButtonText>
        </CSS.BookButton>
      </CSS.BookButtonContainer>
    </CSS.Container>
  );
}
