import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, usePathname } from "expo-router";
import { useBusinessContext, Business } from "@/app/contexts/BusinessContext";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
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

// Mock data for reviews
const mockReviews = [
  {
    id: 1,
    author: "Sophia Clark",
    authorImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKh-5ins07UK0OIshGMe_Stl3XImoAWiPBbbzxTco03NJmG18qBU9nxBqkrk9Sh2ut73VkgFlY4py0VIP_zj407WEl1iLFv7PI9HMk_3SY2mHajNpKBKNrh2jg1gM-3up8gZMGmPpk6mLApiBT9GLgGDdl7wr0t6gU4gAFIuozFfhW6SpHfOfZ2-t_02VFPqrN5lwOx5DgnqLg2DC8dA5nHZlY26f7IWJYtpJHRiH8K8WSlEflf-eVqcjp3UCaEJA_vvF5iLP6ZS2t",
    rating: 5,
    date: "2 weeks ago",
    text: "This class was amazing! The instructor was very knowledgeable and made the class accessible for all levels. I left feeling refreshed and energized.",
    likes: 15,
    dislikes: 2,
  },
  {
    id: 2,
    author: "Ethan Bennett",
    authorImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEElp7WF4K4mFEQ4nGJLIOb3oBlGWAfQ8cXsgx1tagE-UK0JyXaW1wVYQ29g4hA3dcIkDXiHtgH1TEkb5K2uUnT2m7pIXPJd27HMEeL9BNqGgT41IL6J9Iy4QvY-TQgBuRe0cT49cnlGxvPEik3lvNaBZ3NQFWkwcdkd9sYRAFZMH34BH8FAuWqLoiE2hfiP5O8LCqgJ6Mk9rVDPK2ERLkLaXNBLI0-n6YwNr7zQrNixl0KFHGIGlQ5OF4GcjxTMHQsPYAcyjHjGzR",
    rating: 4,
    date: "1 month ago",
    text: "Great class, but the studio was a bit crowded. The instructor was excellent and the flow was challenging but rewarding.",
    likes: 8,
    dislikes: 1,
  },
];

// Mock schedule data
const mockSchedule = [
  { day: "Monday", time: "10:00 AM - 11:00 AM" },
  { day: "Wednesday", time: "6:00 PM - 7:00 PM" },
  { day: "Saturday", time: "9:00 AM - 10:00 AM" },
];

// Mock rating data
const mockRatingData = {
  average: 4.8,
  totalReviews: 125,
  distribution: [
    { rating: 5, percentage: 70 },
    { rating: 4, percentage: 20 },
    { rating: 3, percentage: 5 },
    { rating: 2, percentage: 3 },
    { rating: 1, percentage: 2 },
  ],
};

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
  const { refreshNotifications } = useNotificationsContext();
  const { sendNotification } = useNotifications();
  const { user, setRedirectPath } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

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

  const handleBookClass = async () => {
    if (!user) {
      setRedirectPath(pathname);
      router.push("/logIn");
      return;
    }

    setIsBooking(true);
    try {
      await sendNotification(classItem);
      await refreshNotifications();
      showToast(`Successfully booked ${classItem.name}!`, "success");
      router.back();
    } catch (err) {
      console.error("Error booking class:", err);
      setError(err instanceof Error ? err : new Error("Failed to book class"));
      showToast("Failed to book class", "error");
    } finally {
      setIsBooking(false);
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuZpxL2qDLHyzg3_bnb8lbGigeRVyjUkI9RfW9nRMB6xHTgGSh_YL3dh4eR8kO4hKO8I4qVWH4rrvqW9-ZcHOZO8cDEBBz8u2dkXBcTSDlW5DujQ0QKvTlXewoJc-pb67doFv5vd2U-O9bQGTOzIo6PJfZIGyEBZwlV08ews8w7K_Nd-OwqAJbZxsfirXguCd1U3c_DdyDId-dkqnl7uRgREezubfA2pq48nHHfwOlT3I3rrIIIRGxgRAerbEiNHbvj9vfzmaKe0mr",
            }}
            style={styles.heroImage}
            resizeMode="cover"
            fadeDuration={0}
          />
        </View>

        {/* Class Info */}
        <View style={styles.content}>
          <Text style={styles.classTitle}>{classItem.name}</Text>
          <Text style={styles.classDescription}>{classItem.description}</Text>

          {/* Class Details */}
          <View style={styles.classDetails}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="person" size={20} color="#111714" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Instructor</Text>
                <Text style={styles.detailValue}>{classItem.instructor}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.detailItem}
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
              <View style={styles.detailIcon}>
                <MaterialIcons name="location-on" size={20} color="#111714" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>
                  {business.address}, {classItem.location}
                </Text>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={16}
                color="#648772"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="schedule" size={20} color="#111714" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>
                  {formatDuration(classItem.duration)}
                </Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="event" size={20} color="#111714" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Next Class</Text>
                <Text style={styles.detailValue}>
                  {formattedStartDate(classItem.startDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewsContainer}>
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingNumber}>{mockRatingData.average}</Text>
              <View style={styles.starsContainer}>
                {renderStars(Math.floor(mockRatingData.average))}
              </View>
              <Text style={styles.reviewCount}>
                {mockRatingData.totalReviews} reviews
              </Text>
            </View>

            <View style={styles.ratingDistribution}>
              {mockRatingData.distribution.map((item) => (
                <View key={item.rating} style={styles.ratingRow}>
                  <Text style={styles.ratingLabel}>{item.rating}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${item.percentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.percentage}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Individual Reviews */}
          <View style={styles.reviewsList}>
            {mockReviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: review.authorImage }}
                    style={styles.authorImage}
                  />
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{review.author}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.reviewStars}>
                  {renderStars(review.rating, 20)}
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
                <View style={styles.reviewActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="thumb-up" size={20} color="#648772" />
                    <Text style={styles.actionText}>{review.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons
                      name="thumb-down"
                      size={20}
                      color="#648772"
                    />
                    <Text style={styles.actionText}>{review.dislikes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Schedule Section */}
          <Text style={styles.sectionTitle}>Schedule</Text>
          {mockSchedule.map((schedule, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.scheduleIcon}>
                <MaterialIcons name="event" size={24} color="#111714" />
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleDay}>{schedule.day}</Text>
                <Text style={styles.scheduleTime}>{schedule.time}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* Bottom spacing for book button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookButtonContainer}>
        <TouchableOpacity
          style={[styles.bookButton, isBooking && styles.bookButtonDisabled]}
          onPress={handleBookClass}
          disabled={isBooking}
        >
          <Text style={styles.bookButtonText}>
            {isBooking ? "Booking..." : "Book Class"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  heroImage: {
    width: "100%",
    height: 218,
    borderRadius: 0,
  },
  content: {
    paddingHorizontal: 16,
  },
  classTitle: {
    color: "#111714",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: -0.3,
    paddingBottom: 12,
    paddingTop: 20,
  },
  classDescription: {
    color: "#111714",
    fontSize: 16,
    lineHeight: 24,
    paddingBottom: 12,
    paddingTop: 4,
  },
  sectionTitle: {
    color: "#111714",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: -0.3,
    paddingBottom: 8,
    paddingTop: 16,
  },
  reviewsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 32,
    paddingVertical: 16,
  },
  ratingSummary: {
    alignItems: "center",
  },
  ratingNumber: {
    color: "#111714",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
    marginVertical: 8,
  },
  reviewCount: {
    color: "#111714",
    fontSize: 16,
  },
  ratingDistribution: {
    flex: 1,
    minWidth: 200,
    maxWidth: 400,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  ratingLabel: {
    color: "#111714",
    fontSize: 14,
    width: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#dce5df",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#111714",
    borderRadius: 4,
  },
  percentage: {
    color: "#648772",
    fontSize: 14,
    width: 40,
    textAlign: "right",
  },
  reviewsList: {
    gap: 32,
    paddingVertical: 16,
  },
  reviewItem: {
    gap: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    color: "#111714",
    fontSize: 16,
    fontWeight: "500",
  },
  reviewDate: {
    color: "#648772",
    fontSize: 14,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    color: "#111714",
    fontSize: 16,
    lineHeight: 24,
  },
  reviewActions: {
    flexDirection: "row",
    gap: 36,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    color: "#648772",
    fontSize: 16,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    minHeight: 72,
    paddingVertical: 8,
  },
  scheduleIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#f0f4f2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleDay: {
    color: "#111714",
    fontSize: 16,
    fontWeight: "500",
  },
  scheduleTime: {
    color: "#648772",
    fontSize: 14,
  },
  bookButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f4f2",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bookButton: {
    backgroundColor: "#38e07b",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 84,
    maxWidth: 480,
    flex: 1,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: "#111714",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  classDetails: {
    gap: 16,
    paddingVertical: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#f0f4f2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    color: "#111714",
    fontSize: 16,
    fontWeight: "500",
  },
  detailValue: {
    color: "#648772",
    fontSize: 14,
  },
});
