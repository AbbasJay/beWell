import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
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
import {
  Container,
  ScrollView as StyledScrollView,
  ImageContainer,
  HeroImage,
  Content,
  ClassTitle,
  ClassDescription,
  SectionTitle,
  ClassDetails,
  DetailItem,
  DetailIcon,
  DetailInfo,
  DetailLabel,
  DetailValue,
  ReviewsContainer,
  RatingSummary,
  RatingNumber,
  StarsContainer,
  ReviewCount,
  RatingDistribution,
  RatingRow,
  RatingLabel,
  ProgressBar,
  ProgressFill,
  Percentage,
  ReviewsList,
  ReviewItem,
  ReviewHeader,
  AuthorImage,
  AuthorInfo,
  AuthorName,
  ReviewDate,
  ReviewStars,
  ReviewText,
  ReviewActions,
  ActionButton,
  ActionText,
  ScheduleItem,
  ScheduleIcon,
  ScheduleInfo,
  ScheduleDay,
  ScheduleTime,
  BookButtonContainer,
  BookButton,
  BookButtonText,
} from "./styles";

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
    <Container>
      <StyledScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <ImageContainer>
          <HeroImage
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuZpxL2qDLHyzg3_bnb8lbGigeRVyjUkI9RfW9nRMB6xHTgGSh_YL3dh4eR8kO4hKO8I4qVWH4rrvqW9-ZcHOZO8cDEBBz8u2dkXBcTSDlW5DujQ0QKvTlXewoJc-pb67doFv5vd2U-O9bQGTOzIo6PJfZIGyEBZwlV08ews8w7K_Nd-OwqAJbZxsfirXguCd1U3c_DdyDId-dkqnl7uRgREezubfA2pq48nHHfwOlT3I3rrIIIRGxgRAerbEiNHbvj9vfzmaKe0mr",
            }}
            resizeMode="cover"
            fadeDuration={0}
          />
        </ImageContainer>

        {/* Class Info */}
        <Content>
          <ClassTitle>{classItem.name}</ClassTitle>
          <ClassDescription>{classItem.description}</ClassDescription>

          {/* Class Details */}
          <ClassDetails>
            <DetailItem>
              <DetailIcon>
                <MaterialIcons name="person" size={20} color="#111714" />
              </DetailIcon>
              <DetailInfo>
                <DetailLabel>Instructor</DetailLabel>
                <DetailValue>{classItem.instructor}</DetailValue>
              </DetailInfo>
            </DetailItem>
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
              <DetailIcon>
                <MaterialIcons name="location-on" size={20} color="#111714" />
              </DetailIcon>
              <DetailInfo>
                <DetailLabel>Location</DetailLabel>
                <DetailValue>
                  {business.address}, {classItem.location}
                </DetailValue>
              </DetailInfo>
              <MaterialIcons
                name="open-in-new"
                size={16}
                color="#648772"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            <DetailItem>
              <DetailIcon>
                <MaterialIcons name="schedule" size={20} color="#111714" />
              </DetailIcon>
              <DetailInfo>
                <DetailLabel>Duration</DetailLabel>
                <DetailValue>{formatDuration(classItem.duration)}</DetailValue>
              </DetailInfo>
            </DetailItem>
            <DetailItem>
              <DetailIcon>
                <MaterialIcons name="event" size={20} color="#111714" />
              </DetailIcon>
              <DetailInfo>
                <DetailLabel>Next Class</DetailLabel>
                <DetailValue>
                  {formattedStartDate(classItem.startDate)}
                </DetailValue>
              </DetailInfo>
            </DetailItem>
          </ClassDetails>

          {/* Reviews Section */}
          <SectionTitle>Reviews</SectionTitle>
          <ReviewsContainer>
            <RatingSummary>
              <RatingNumber>{mockRatingData.average}</RatingNumber>
              <StarsContainer>
                {renderStars(Math.floor(mockRatingData.average))}
              </StarsContainer>
              <ReviewCount>{mockRatingData.totalReviews} reviews</ReviewCount>
            </RatingSummary>

            <RatingDistribution>
              {mockRatingData.distribution.map((item) => (
                <RatingRow key={item.rating}>
                  <RatingLabel>{item.rating}</RatingLabel>
                  <ProgressBar>
                    <ProgressFill percentage={item.percentage} />
                  </ProgressBar>
                  <Percentage>{item.percentage}%</Percentage>
                </RatingRow>
              ))}
            </RatingDistribution>
          </ReviewsContainer>

          {/* Individual Reviews */}
          <ReviewsList>
            {mockReviews.map((review) => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <AuthorImage source={{ uri: review.authorImage }} />
                  <AuthorInfo>
                    <AuthorName>{review.author}</AuthorName>
                    <ReviewDate>{review.date}</ReviewDate>
                  </AuthorInfo>
                </ReviewHeader>
                <ReviewStars>{renderStars(review.rating, 20)}</ReviewStars>
                <ReviewText>{review.text}</ReviewText>
                <ReviewActions>
                  <ActionButton>
                    <MaterialIcons name="thumb-up" size={20} color="#648772" />
                    <ActionText>{review.likes}</ActionText>
                  </ActionButton>
                  <ActionButton>
                    <MaterialIcons
                      name="thumb-down"
                      size={20}
                      color="#648772"
                    />
                    <ActionText>{review.dislikes}</ActionText>
                  </ActionButton>
                </ReviewActions>
              </ReviewItem>
            ))}
          </ReviewsList>

          {/* Schedule Section */}
          <SectionTitle>Schedule</SectionTitle>
          {mockSchedule.map((schedule, index) => (
            <ScheduleItem key={index}>
              <ScheduleIcon>
                <MaterialIcons name="event" size={24} color="#111714" />
              </ScheduleIcon>
              <ScheduleInfo>
                <ScheduleDay>{schedule.day}</ScheduleDay>
                <ScheduleTime>{schedule.time}</ScheduleTime>
              </ScheduleInfo>
            </ScheduleItem>
          ))}
        </Content>
        {/* Bottom spacing for book button */}
        <View style={{ height: 100 }} />
      </StyledScrollView>

      {/* Book Button */}
      <BookButtonContainer>
        <BookButton onPress={handleBookClass} disabled={isBooking}>
          <BookButtonText>
            {isBooking ? "Booking..." : "Book Class"}
          </BookButtonText>
        </BookButton>
      </BookButtonContainer>
    </Container>
  );
}
