import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
import { LoadingSpinner, OverlaySpinner } from "@/app/ui/loading-spinner";
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
import { OptimizedImage } from "@/app/ui/optimized-image";

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
  const {
    updateClassBookingStatus,
    updateClassAfterCancellation,
    updateClassAfterBooking,
    refreshClasses,
  } = useClassesContext();
  const { user, setRedirectPath, setOriginalPath } = useAuth();
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
  if (!business) {
    return <ErrorMessage error={new Error("Business not found")} />;
  }

  if (isLoading || !classItem) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <OverlaySpinner visible={true} />
      </View>
    );
  }

  const hasBooked =
    classItem.isBooked === true && classItem.bookingStatus !== "cancelled";

  const handleBookClass = async () => {
    if (!user) {
      setRedirectPath(pathname);
      setOriginalPath(pathname);
      router.push("/logIn");
      return;
    }

    setIsBooking(true);
    setCurrentAction("booking");
    try {
      const responseData = await bookClass(classItem);

      if (responseData && responseData.class) {
        updateClassAfterBooking(
          classItem.id,
          responseData.class.slotsLeft,
          true,
          "active"
        );
      } else {
        updateClassBookingStatus(classItem.id, true);
      }

      await refreshNotifications();
      await refreshBookings();
      showToast(`Successfully booked ${classItem.name}!`, "success");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("You have already booked this class")
      ) {
        try {
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
      setOriginalPath(pathname);
      router.push("/logIn");
      return;
    }

    setIsCancelling(true);
    setCurrentAction("cancelling");
    try {
      const responseData = await cancelClass(classItem.id);

      if (responseData && responseData.class) {
        updateClassAfterCancellation(
          classItem.id,
          responseData.class.slotsLeft,
          false,
          "cancelled"
        );
      } else {
        updateClassBookingStatus(classItem.id, false);
      }

      await refreshNotifications();
      await refreshBookings();
      showToast(`Successfully cancelled ${classItem.name}!`, "success");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("No active booking found")
      ) {
        await refreshClasses();
        showToast(
          "Class data refreshed - you may not have an active booking",
          "info"
        );
      } else {
        setError(
          err instanceof Error ? err : new Error("Failed to cancel class")
        );
        showToast("Failed to cancel class", "error");
      }
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
            <OptimizedImage
              source={classItem.photo || null}
              width={400}
              height={260}
              borderRadius={0}
              style={{ width: "100%", height: 260 }}
            />
          </CSS.ImageContainer>
        </View>
        {renderTabBar()}
        {activeTab === "details" && (
          <CSS.Content style={{ paddingTop: 8 }}>
            {classItem.bookingStatus === "cancelled" && (
              <View
                style={{
                  backgroundColor: "#f8d7da",
                  borderColor: "#f5c6cb",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color="#721c24"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "#721c24",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    This class was cancelled
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#721c24",
                    fontSize: 12,
                    marginLeft: 28,
                  }}
                >
                  Recently cancelled • You can re-book if slots are available
                </Text>
              </View>
            )}

            <CSS.ClassTitle numberOfLines={2}>{classItem.name}</CSS.ClassTitle>
            <CSS.ClassDescription numberOfLines={3}>
              {classItem.description}
            </CSS.ClassDescription>
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
              {classItem.classTypeLabel && (
                <CSS.DetailItem>
                  <CSS.DetailIcon>
                    <MaterialIcons name="fitness-center" size={20} color="#111714" />
                  </CSS.DetailIcon>
                  <CSS.DetailInfo>
                    <CSS.DetailLabel>Class Type</CSS.DetailLabel>
                    <CSS.DetailValue>{classItem.classTypeLabel}</CSS.DetailValue>
                  </CSS.DetailInfo>
                </CSS.DetailItem>
              )}
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                onPress={() => {
                  if (business.id) {
                    router.push({
                      pathname: "/",
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
              <CSS.DetailItem>
                <CSS.DetailIcon>
                  <MaterialIcons
                    name="group"
                    size={20}
                    color={classItem.slotsLeft === 0 ? "#d9534f" : "#111714"}
                  />
                </CSS.DetailIcon>
                <CSS.DetailInfo>
                  <CSS.DetailLabel>Available Spots</CSS.DetailLabel>
                  <CSS.DetailValue
                    style={{
                      color: classItem.slotsLeft === 0 ? "#d9534f" : "#111714",
                      fontWeight: classItem.slotsLeft === 0 ? "bold" : "normal",
                    }}
                  >
                    {classItem.slotsLeft === 0
                      ? "Fully Booked"
                      : `${classItem.slotsLeft} ${
                          classItem.slotsLeft === 1 ? "spot" : "spots"
                        } left`}
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
            <ReviewForm />
            <ReviewsSummary />
            <ReviewsList />
          </CSS.Content>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      <CSS.BookButtonContainer>
        <CSS.BookButton
          onPress={
            hasBooked
              ? handleCancelClass
              : classItem.bookingStatus === "completed" ||
                  classItem.bookingStatus === "no-show" ||
                  classItem.slotsLeft === 0
                ? undefined
                : handleBookClass
          }
          disabled={
            isBooking ||
            isCancelling ||
            classItem.bookingStatus === "completed" ||
            classItem.bookingStatus === "no-show" ||
            (!hasBooked && classItem.slotsLeft === 0)
          }
          style={
            currentAction === "booking" || currentAction === "cancelling"
              ? { backgroundColor: "#6c757d" }
              : hasBooked
                ? { backgroundColor: "#d9534f" }
                : classItem.bookingStatus === "completed"
                  ? { backgroundColor: "#28a745" }
                  : classItem.bookingStatus === "no-show"
                    ? { backgroundColor: "#ffc107" }
                    : !hasBooked && classItem.slotsLeft === 0
                      ? { backgroundColor: "#6c757d" }
                      : undefined
          }
        >
          <CSS.BookButtonText>
            {currentAction === "booking" || currentAction === "cancelling" ? (
              <ActivityIndicator size="small" color="white" />
            ) : hasBooked ? (
              "Cancel"
            ) : classItem.bookingStatus === "completed" ? (
              "Completed"
            ) : classItem.bookingStatus === "no-show" ? (
              "No Show"
            ) : classItem.bookingStatus === "cancelled" ? (
              "Re-book Class"
            ) : !hasBooked && classItem.slotsLeft === 0 ? (
              "Fully Booked"
            ) : (
              "Book Class"
            )}
          </CSS.BookButtonText>
        </CSS.BookButton>
      </CSS.BookButtonContainer>
    </CSS.Container>
  );
}
