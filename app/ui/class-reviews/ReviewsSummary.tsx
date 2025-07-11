import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useClassReviews } from "@/app/contexts/ReviewsContext";
import { MaterialIcons } from "@expo/vector-icons";
import * as CSS from "../../business/[id]/classes/styles";

function renderStars(rating: number, size: number = 18) {
  return Array.from({ length: 5 }, (_, i) => (
    <MaterialIcons
      key={i}
      name={i < rating ? "star" : "star-border"}
      size={size}
      color={i < rating ? "#111714" : "#bccdc3"}
    />
  ));
}

export const ReviewsSummary = () => {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { reviews } = useClassReviews(Number(classId));
  const ratingStats = React.useMemo(() => {
    if (!reviews.length)
      return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / total;
    // Calculate distribution in descending order (5 to 1 stars)
    const distribution = [5, 4, 3, 2, 1].map((star) =>
      Math.round(
        (reviews.filter((r) => r.rating === star).length / total) * 100
      )
    );
    return { average, total, distribution };
  }, [reviews]);

  return (
    <CSS.ReviewsContainer>
      <CSS.RatingSummary>
        <CSS.RatingNumber>{ratingStats.average.toFixed(1)}</CSS.RatingNumber>
        <CSS.StarsContainer>
          {renderStars(Math.round(ratingStats.average))}
        </CSS.StarsContainer>
        <CSS.ReviewCount>
          {ratingStats.total} review{ratingStats.total === 1 ? "" : "s"}
        </CSS.ReviewCount>
      </CSS.RatingSummary>
      <CSS.RatingDistribution>
        {[5, 4, 3, 2, 1].map((star, idx) => (
          <CSS.RatingRow key={star}>
            <CSS.RatingLabel>{star}</CSS.RatingLabel>
            <CSS.ProgressBar>
              <CSS.ProgressFill percentage={ratingStats.distribution[idx]} />
            </CSS.ProgressBar>
            <CSS.Percentage>{ratingStats.distribution[idx]}%</CSS.Percentage>
          </CSS.RatingRow>
        ))}
      </CSS.RatingDistribution>
    </CSS.ReviewsContainer>
  );
};
