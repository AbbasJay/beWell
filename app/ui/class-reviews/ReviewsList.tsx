import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
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
        reviews
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((review) => (
            <CSS.ReviewItem key={review.id}>
              <CSS.ReviewHeader>
                <CSS.AvatarWrapper>
                  {review.userAvatarUrl ? (
                    <CSS.AuthorImage source={{ uri: review.userAvatarUrl }} />
                  ) : (
                    <CSS.AuthorImage source={PLACEHOLDER_AVATAR} />
                  )}
                </CSS.AvatarWrapper>
                <CSS.AuthorInfoRow>
                  <CSS.AuthorName>
                    {review.userName || `User ${review.userId}`}
                  </CSS.AuthorName>
                  <CSS.ReviewDate>
                    {formatGetTimeAgo(review.createdAt)}
                  </CSS.ReviewDate>
                </CSS.AuthorInfoRow>
              </CSS.ReviewHeader>
              <CSS.HeaderDivider />
              <CSS.ReviewStars>
                {renderStars(review.rating, 24)}
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
          ))
      )}
    </CSS.ReviewsList>
  );
};
