import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_URL } from "@/env";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { useAuth } from "./auth/AuthContext";

export type Review = {
  id: number;
  classId: number;
  userId: number;
  rating: number;
  text: string;
  createdAt: string;
  userName?: string;
  userAvatarUrl?: string;
  likeCount: number;
  dislikeCount: number;
  userLikeStatus: "like" | "dislike" | null;
};

interface ReviewsContextType {
  reviewsByClass: { [classId: number]: Review[] };
  isLoadingByClass: { [classId: number]: boolean };
  errorByClass: { [classId: number]: Error | null };
  fetchReviews: (classId: number) => Promise<void>;
  submitReview: (
    classId: number,
    rating: number,
    text: string
  ) => Promise<void>;
  likeReview: (classId: number, reviewId: number) => Promise<void>;
  dislikeReview: (classId: number, reviewId: number) => Promise<void>;
  cancelLikeDislike: (classId: number, reviewId: number) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviewsByClass, setReviewsByClass] = useState<{
    [classId: number]: Review[];
  }>({});
  const [isLoadingByClass, setIsLoadingByClass] = useState<{
    [classId: number]: boolean;
  }>({});
  const [errorByClass, setErrorByClass] = useState<{
    [classId: number]: Error | null;
  }>({});
  const { user } = useAuth();

  const fetchReviews = async (classId: number) => {
    setIsLoadingByClass((prev) => ({ ...prev, [classId]: true }));
    setErrorByClass((prev) => ({ ...prev, [classId]: null }));
    try {
      const response = await fetch(
        `${API_URL}/api/mobile/classes/${classId}/reviews`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      const data = await response.json();
      setReviewsByClass((prev) => ({ ...prev, [classId]: data }));
    } catch (err: any) {
      setErrorByClass((prev) => ({
        ...prev,
        [classId]:
          err instanceof Error ? err : new Error("Failed to fetch reviews"),
      }));
    } finally {
      setIsLoadingByClass((prev) => ({ ...prev, [classId]: false }));
    }
  };

  const submitReview = async (
    classId: number,
    rating: number,
    text: string
  ) => {
    setIsLoadingByClass((prev) => ({ ...prev, [classId]: true }));
    setErrorByClass((prev) => ({ ...prev, [classId]: null }));
    try {
      let token = null;
      if (user) {
        if (Platform.OS === "web") {
          token = localStorage.getItem("accessToken");
        } else {
          token = await SecureStore.getItemAsync("accessToken");
        }
      }
      const headers: any = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(
        `${API_URL}/api/mobile/classes/${classId}/reviews`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ rating, text }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to submit review: ${response.status}, ${errorText}`
        );
      }
      // Refetch reviews for this class
      await fetchReviews(classId);
    } catch (err: any) {
      setErrorByClass((prev) => ({
        ...prev,
        [classId]:
          err instanceof Error ? err : new Error("Failed to submit review"),
      }));
    } finally {
      setIsLoadingByClass((prev) => ({ ...prev, [classId]: false }));
    }
  };

  const likeDislikeAction = async (
    classId: number,
    reviewId: number,
    action: "like" | "dislike" | "cancel"
  ) => {
    setErrorByClass((prev) => ({ ...prev, [classId]: null }));
    // Optimistically update local state
    setReviewsByClass((prev) => {
      const reviews = prev[classId] || [];
      return {
        ...prev,
        [classId]: reviews.map((r) => {
          if (r.id !== reviewId) return r;
          let likeCount = r.likeCount;
          let dislikeCount = r.dislikeCount;
          let userLikeStatus = r.userLikeStatus;
          if (action === "like") {
            if (userLikeStatus === "like") {
              // Should not happen, but fallback to cancel
              likeCount = Math.max(0, likeCount - 1);
              userLikeStatus = null;
            } else {
              likeCount = likeCount + 1;
              if (userLikeStatus === "dislike") {
                dislikeCount = Math.max(0, dislikeCount - 1);
              }
              userLikeStatus = "like";
            }
          } else if (action === "dislike") {
            if (userLikeStatus === "dislike") {
              // Should not happen, but fallback to cancel
              dislikeCount = Math.max(0, dislikeCount - 1);
              userLikeStatus = null;
            } else {
              dislikeCount = dislikeCount + 1;
              if (userLikeStatus === "like") {
                likeCount = Math.max(0, likeCount - 1);
              }
              userLikeStatus = "dislike";
            }
          } else if (action === "cancel") {
            if (userLikeStatus === "like") {
              likeCount = Math.max(0, likeCount - 1);
            } else if (userLikeStatus === "dislike") {
              dislikeCount = Math.max(0, dislikeCount - 1);
            }
            userLikeStatus = null;
          }
          return { ...r, likeCount, dislikeCount, userLikeStatus };
        }),
      };
    });
    try {
      let token = null;
      if (user) {
        if (Platform.OS === "web") {
          token = localStorage.getItem("accessToken");
        } else {
          token = await SecureStore.getItemAsync("accessToken");
        }
      }
      const headers: any = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(
        `${API_URL}/api/mobile/classes/${classId}/reviews/${reviewId}/like`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ action }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update like/dislike: ${response.status}, ${errorText}`
        );
      }
      // Refetch reviews for this class to ensure consistency
      await fetchReviews(classId);
    } catch (err: any) {
      setErrorByClass((prev) => ({
        ...prev,
        [classId]:
          err instanceof Error
            ? err
            : new Error("Failed to update like/dislike"),
      }));
      // Optionally: revert optimistic update on error
      await fetchReviews(classId);
    }
  };

  const likeReview = (classId: number, reviewId: number) =>
    likeDislikeAction(classId, reviewId, "like");
  const dislikeReview = (classId: number, reviewId: number) =>
    likeDislikeAction(classId, reviewId, "dislike");
  const cancelLikeDislike = (classId: number, reviewId: number) =>
    likeDislikeAction(classId, reviewId, "cancel");

  return (
    <ReviewsContext.Provider
      value={{
        reviewsByClass,
        isLoadingByClass,
        errorByClass,
        fetchReviews,
        submitReview,
        likeReview,
        dislikeReview,
        cancelLikeDislike,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviewsContext = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviewsContext must be used within a ReviewsProvider");
  }
  return context;
};

// Custom hook to get reviews for a specific class
export const useClassReviews = (classId: number) => {
  const {
    reviewsByClass,
    isLoadingByClass,
    errorByClass,
    fetchReviews,
    submitReview,
    likeReview,
    dislikeReview,
    cancelLikeDislike,
  } = useReviewsContext();
  return {
    reviews: reviewsByClass[classId] || [],
    isLoading: isLoadingByClass[classId] || false,
    error: errorByClass[classId] || null,
    fetchReviews: () => fetchReviews(classId),
    submitReview: (rating: number, text: string) =>
      submitReview(classId, rating, text),
    likeReview: (reviewId: number) => likeReview(classId, reviewId),
    dislikeReview: (reviewId: number) => dislikeReview(classId, reviewId),
    cancelLikeDislike: (reviewId: number) =>
      cancelLikeDislike(classId, reviewId),
  };
};
