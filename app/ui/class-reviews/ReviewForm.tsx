import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import { useLocalSearchParams, useRouter, usePathname } from "expo-router";
import { useToast } from "@/app/contexts/ToastContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useClassReviews } from "@/app/contexts/ReviewsContext";

export const ReviewForm = () => {
  const { user, setRedirectPath } = useAuth();
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { submitReview, isLoading } = useClassReviews(Number(classId));
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewText.trim()) {
      showToast("Please provide a rating and review text.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(reviewRating, reviewText.trim());
      setReviewText("");
      setReviewRating(0);
      showToast("Review submitted!", "success");
    } catch (err) {
      showToast("Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Leave a Review
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
            <MaterialIcons
              name={reviewRating >= star ? "star" : "star-border"}
              size={28}
              color={reviewRating >= star ? "#111714" : "#bccdc3"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
        }}
      >
        <TextInput
          style={{ minHeight: 60, textAlignVertical: "top" }}
          multiline
          numberOfLines={3}
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="Write your review..."
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmitReview}
        disabled={
          submitting || isLoading || !reviewRating || !reviewText.trim()
        }
        style={{
          backgroundColor: submitting ? "#ccc" : "#648772",
          padding: 10,
          borderRadius: 6,
        }}
      >
        <Text
          style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
