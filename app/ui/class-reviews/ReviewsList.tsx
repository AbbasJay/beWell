import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useClassReviews } from "@/app/contexts/ReviewsContext";
import { LoadingSpinner } from "@/app/ui/loading-spinner";
import { ErrorMessage } from "@/app/ui/error-message";
import * as CSS from "../../business/[id]/classes/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { formatGetTimeAgo } from "@/app/utils/helper-functions/format-time-and-dates";

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

export const ReviewsList = () => {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const {
    reviews,
    isLoading,
    error,
    likeReview,
    dislikeReview,
    cancelLikeDislike,
  } = useClassReviews(Number(classId));

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

  return (
    <CSS.ReviewsList>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : reviews.length === 0 ? (
        <Text
          style={{ color: "#888", textAlign: "center", marginVertical: 16 }}
        >
          No reviews yet.
        </Text>
      ) : (
        reviews
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((review) => (
            <CSS.ReviewItem key={review.id}>
              <CSS.ReviewHeader>
                {review.userAvatarUrl ? (
                  <CSS.AuthorImage source={{ uri: review.userAvatarUrl }} />
                ) : (
                  <CSS.AuthorImage source={PLACEHOLDER_AVATAR} />
                )}
                <CSS.AuthorInfo>
                  <CSS.AuthorName>
                    {review.userName || `User ${review.userId}`}
                  </CSS.AuthorName>
                  <CSS.ReviewDate>
                    {formatGetTimeAgo(review.createdAt)}
                  </CSS.ReviewDate>
                </CSS.AuthorInfo>
              </CSS.ReviewHeader>
              <CSS.ReviewStars>
                {renderStars(review.rating, 20)}
              </CSS.ReviewStars>
              <CSS.ReviewText>{review.text}</CSS.ReviewText>
              <CSS.ReviewActions>
                <TouchableOpacity
                  onPress={() => handleLike(review)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
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
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDislike(review)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
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
                </TouchableOpacity>
              </CSS.ReviewActions>
            </CSS.ReviewItem>
          ))
      )}
    </CSS.ReviewsList>
  );
};
