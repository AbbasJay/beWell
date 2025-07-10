import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, usePathname } from "expo-router";
import { useBusinessContext, Business } from "@/app/contexts/BusinessContext";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { useBookingsContext } from "@/app/contexts/BookingsContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import {
  useClassesContext,
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

const mockSchedule = [
  { day: "Monday", time: "10:00 AM - 11:00 AM" },
  { day: "Wednesday", time: "6:00 PM - 7:00 PM" },
  { day: "Saturday", time: "9:00 AM - 10:00 AM" },
];

const TABS = [
  { key: "details", label: "Details" },
  { key: "reviews", label: "Reviews" },
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
  const [activeTab, setActiveTab] = useState("details");
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
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

  const foundBusiness = useMemo(() => {
    return businesses.find((b) => b.id === Number(businessId));
  }, [businesses, businessId]);

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
  const hasBooked =
    classItem.isBooked === true && classItem.bookingStatus === "active";

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
      await refreshClasses();
      router.back();
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("You have already booked this class")
      ) {
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
      await refreshClasses();
      router.back();
    } catch (err) {
      try {
        await refreshClasses();
      } catch (refreshError) {}
      setError(
        err instanceof Error ? err : new Error("Failed to cancel class")
      );
      showToast("Failed to cancel class", "error");
    } finally {
      setIsCancelling(false);
      setCurrentAction(null);
    }
  };

  const renderTabBar = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        borderRadius: 16,
        marginHorizontal: 24,
        marginTop: 24,
        marginBottom: 8,
        overflow: "hidden",
      }}
    >
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => setActiveTab(tab.key)}
          style={{
            flex: 1,
            paddingVertical: 10,
            backgroundColor: activeTab === tab.key ? "#111714" : "#f7f7f7",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: activeTab === tab.key ? "#fff" : "#111714",
              fontWeight: "bold",
              fontSize: 16,
              letterSpacing: 0.5,
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <CSS.Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ position: "relative" }}>
          <CSS.ImageContainer>
            <CSS.HeroImage
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuZpxL2qDLHyzg3_bnb8lbGigeRVyjUkI9RfW9nRMB6xHTgGSh_YL3dh4eR8kO4hKO8I4qVWH4rrvqW9-ZcHOZO8cDEBBz8u2dkXBcTSDlW5DujQ0QKvTlXewoJc-pb67doFv5vd2U-O9bQGTOzIo6PJfZIGyEBZwlV08ews8w7K_Nd-OwqAJbZxsfirXguCd1U3c_DdyDId-dkqnl7uRgREezubfA2pq48nHHfwOlT3I3rrIIIRGxgRAerbEiNHbvj9vfzmaKe0mr",
              }}
              resizeMode="cover"
              fadeDuration={0}
              style={{ width: "100%", height: 260 }}
            />
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                paddingHorizontal: 28,
                paddingBottom: 28,
                paddingTop: 24,
                backgroundColor: "rgba(17, 23, 20, 0.45)",
                // No border radius for a modern, edge-to-edge look
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight: "bold",
                  marginBottom: 8,
                  letterSpacing: 0.5,
                  textShadowColor: "rgba(0,0,0,0.25)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 6,
                }}
                numberOfLines={2}
              >
                {classItem.name}
              </Text>
              <Text
                style={{
                  color: "#e0e0e0",
                  fontSize: 16,
                  fontWeight: "400",
                  marginBottom: 0,
                  letterSpacing: 0.2,
                  textShadowColor: "rgba(0,0,0,0.18)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 4,
                }}
                numberOfLines={3}
              >
                {classItem.description}
              </Text>
            </View>
          </CSS.ImageContainer>
        </View>
        {renderTabBar()}
        {activeTab === "details" && (
          <CSS.Content style={{ paddingTop: 8 }}>
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
            <CSS.SectionTitle style={{ marginTop: 24 }}>
              Schedule
            </CSS.SectionTitle>
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
        )}
        {activeTab === "reviews" && (
          <CSS.Content style={{ paddingTop: 8 }}>
            <ReviewsSummary />
            <View style={{ marginBottom: 16 }}>
              <CSS.BookButton
                onPress={
                  hasBooked
                    ? handleCancelClass
                    : classItem.bookingStatus === "completed" ||
                      classItem.bookingStatus === "no-show"
                    ? undefined
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
            </View>
            <ReviewsList />
          </CSS.Content>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      {activeTab === "details" && (
        <CSS.BookButtonContainer>
          <CSS.BookButton
            onPress={
              hasBooked
                ? handleCancelClass
                : classItem.bookingStatus === "completed" ||
                  classItem.bookingStatus === "no-show"
                ? undefined
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
      )}
      {activeTab === "reviews" && !reviewModalVisible && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            paddingBottom: 24,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#111714",
              borderRadius: 24,
              paddingVertical: 16,
              paddingHorizontal: 48,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => setReviewModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              Leave a Review
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={reviewModalVisible}
        transparent
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          />
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "#fff",
              width: "100%",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderRadius: 0,
              padding: 0,
              justifyContent: "flex-start",
            }}
            edges={["bottom"]}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}
              onPress={() => setReviewModalVisible(false)}
            >
              <MaterialIcons name="close" size={28} color="#888" />
            </TouchableOpacity>
            <View style={{ marginTop: 56, paddingHorizontal: 24 }}>
              <ReviewForm />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </CSS.Container>
  );
}
