import React from "react";
import styled from "styled-components/native";
import { Review as ReviewItem, ReviewType } from "./Review";

type Props = {
  reviews: ReviewType[];
  onEdit?: (review: ReviewType) => void;
  onDelete?: (review: ReviewType) => void;
  userId?: string;
};

export function ReviewList({ reviews, onEdit, onDelete, userId }: Props) {
  return (
    <ListContainer>
      {reviews
        .filter((r) => !userId || r.userId !== userId)
        .map((r) => (
          <ReviewItem
            key={r.id}
            review={r}
            onEdit={onEdit ? () => onEdit(r) : undefined}
            onDelete={onDelete ? () => onDelete(r) : undefined}
            showActions={false}
          />
        ))}
    </ListContainer>
  );
}

const ListContainer = styled.View``;
