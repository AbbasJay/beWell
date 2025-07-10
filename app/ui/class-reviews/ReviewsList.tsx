import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useClassReviews } from "@/app/contexts/ReviewsContext";
import { LoadingSpinner } from "@/app/ui/loading-spinner";
import { ErrorMessage } from "@/app/ui/error-message";
import * as CSS from "../../business/[id]/classes/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { formatGetTimeAgo } from "@/app/utils/helper-functions/format-time-and-dates";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PLACEHOLDER_AVATAR = require("@/assets/images/home-gym.webp");

function renderStars(rating: number, size: number = 20) {
  return Array.from({ length: 5 }, (_, i) => (
    <MaterialIcons
      key={i}
      name={i < rating ? "star" : "star-border"}
      size={size}
      color={i < rating ? "#111714" : "#bccdc3"}
    />
  ));
}

type ReviewsListProps = {
  showAll?: boolean;
};

export const ReviewsList = ({ showAll }: ReviewsListProps) => {
  const { classId, id: businessId } = useLocalSearchParams<{
    classId: string;
    id: string;
  }>();
  const {
    reviews,
    isLoading,
    error,
    likeReview,
    dislikeReview,
    cancelLikeDislike,
  } = useClassReviews(Number(classId));

  const [showAllState, setShowAllState] = useState(false);
  const router = useRouter();
  const MAX_REVIEWS = 4;

  const handleLike = (review: any) => {
    if (review.userLikeStatus === "like") {
      cancelLikeDislike(review.id);
    } else {
      likeReview(review.id);
    }
  };
  const handleDislike = (review: any) => {
    if (review.userLikeStatus === "dislike") {
      cancelLikeDislike(review.id);
    } else {
      dislikeReview(review.id);
    }
  };

  const sortedReviews = reviews
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const visibleReviews =
    showAll ?? showAllState
      ? sortedReviews
      : sortedReviews.slice(0, MAX_REVIEWS);

  return (
    <CSS.ReviewsList>
      {isLoading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <LoadingSpinner />
        </View>
      ) : error ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <ErrorMessage error={error} />
        </View>
      ) : reviews.length === 0 ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <MaterialCommunityIcons
            name="emoticon-sad-outline"
            size={48}
            color="#bccdc3"
            style={{ marginBottom: 12 }}
          />
          <Text style={{ color: "#888", textAlign: "center", fontSize: 18 }}>
            No reviews yet.
          </Text>
        </View>
      ) : (
        <>
          {visibleReviews.map((review) => (
            <CSS.ReviewItem key={review.id}>
              <CSS.ReviewHeader>
                {review.userAvatarUrl ? (
                  <CSS.AuthorImage source={{ uri: review.userAvatarUrl }} />
                ) : (
                  <CSS.AuthorImage source={PLACEHOLDER_AVATAR} />
                )}
                <CSS.AuthorInfoRow>
                  <CSS.AuthorName>
                    {review.userName || `User ${review.userId}`}
                  </CSS.AuthorName>
                  <CSS.ReviewDate>
                    {formatGetTimeAgo(review.createdAt)}
                  </CSS.ReviewDate>
                </CSS.AuthorInfoRow>
              </CSS.ReviewHeader>
              <CSS.ReviewStars>
                {renderStars(review.rating, 20)}
              </CSS.ReviewStars>
              <CSS.ReviewText>{review.text}</CSS.ReviewText>
              <CSS.ReviewActions>
                <CSS.ActionPill
                  onPress={() => handleLike(review)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="thumb-up"
                    size={20}
                    color={
                      review.userLikeStatus === "like" ? "#38e07b" : "#648772"
                    }
                  />
                  <CSS.ActionText>{review.likeCount}</CSS.ActionText>
                </CSS.ActionPill>
                <CSS.ActionPill
                  onPress={() => handleDislike(review)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="thumb-down"
                    size={20}
                    color={
                      review.userLikeStatus === "dislike"
                        ? "#d9534f"
                        : "#648772"
                    }
                  />
                  <CSS.ActionText>{review.dislikeCount}</CSS.ActionText>
                </CSS.ActionPill>
              </CSS.ReviewActions>
            </CSS.ReviewItem>
          ))}
          {sortedReviews.length > MAX_REVIEWS && !showAll && !showAllState && (
            <TouchableOpacity
              style={{
                marginTop: 12,
                alignSelf: "center",
                paddingVertical: 8,
                paddingHorizontal: 24,
                borderRadius: 20,
                backgroundColor: "#f7f7f7",
              }}
              onPress={() => {
                if (businessId && classId) {
                  router.push(
                    `/business/${businessId}/classes/all-reviews?classId=${classId}`
                  );
                }
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{ color: "#648772", fontWeight: "bold", fontSize: 16 }}
              >
                View More
              </Text>
            </TouchableOpacity>
          )}
          {/* Hide View Less button if showAll is true (on all reviews screen) */}
        </>
      )}
    </CSS.ReviewsList>
  );
};
