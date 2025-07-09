import React, { useState } from "react";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import Button from "@/app/ui/button/button";

type Props = {
  initialText?: string;
  initialRating?: number;
  onSubmit: (data: { text: string; rating: number }) => void;
  onCancel?: () => void;
  submitting?: boolean;
};

export function ReviewForm({
  initialText = "",
  initialRating = 5,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [text, setText] = useState(initialText);
  const [rating, setRating] = useState(initialRating);
  return (
    <FormContainer>
      <Row>
        <Label>Your Review</Label>
        <Stars>
          {Array.from({ length: 5 }, (_, i) => (
            <StarButton key={i} onPress={() => setRating(i + 1)}>
              <MaterialIcons
                name={i < rating ? "star" : "star-border"}
                size={24}
                color={i < rating ? "#111714" : "#bccdc3"}
              />
            </StarButton>
          ))}
        </Stars>
      </Row>
      <StyledInput
        placeholder="Write your review..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button
        title={submitting ? "Submitting..." : "Submit Review"}
        variant="secondary"
        onPress={() => onSubmit({ text, rating })}
        disabled={submitting || !text}
      />
      {onCancel && (
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onCancel}
          disabled={submitting}
        />
      )}
    </FormContainer>
  );
}

const FormContainer = styled.View`
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
const Label = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-right: 8px;
`;
const Stars = styled.View`
  flex-direction: row;
`;
const StarButton = styled.TouchableOpacity``;

const StyledInput = styled(TextInput)`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 8px;
  min-height: 890px;
  margin-bottom: 8px;
  font-size: 15px;
`;
