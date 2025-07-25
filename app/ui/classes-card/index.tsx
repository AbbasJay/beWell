import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Class } from "@/app/contexts/ClassesContext";
import {
  formattedStartDate,
  formatDuration,
} from "@/app/utils/helper-functions/format-time-and-dates";
import { ErrorMessage } from "@/app/ui/error-message";
import { OptimizedImage } from "@/app/ui/optimized-image";
import * as CSS from "./styles";

interface ClassesCardProps {
  item: Class;
  isFull?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  imageIndex?: number;
}

export const ClassesCard = ({
  item,
  isFull = false,
  onPress,
  disabled = false,
  imageIndex = 0,
}: ClassesCardProps) => {
  const [error, setError] = useState<Error | null>(null);

  if (!item) {
    return null; // Don't render anything if item is missing
  }

  return (
    <CSS.Container key={item.id}>
      {error && <ErrorMessage error={error} />}
      <CSS.Card
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || isFull}
      >
        <CSS.CardImageContainer>
          <OptimizedImage
            source={item.photo || null}
            width={56}
            height={56}
            borderRadius={12}
            onError={() => setError(new Error("Failed to load image"))}
          />
        </CSS.CardImageContainer>
        <CSS.CardInfo>
          <CSS.CardTitle numberOfLines={1}>{item.name}</CSS.CardTitle>
          <CSS.CardSubtitle numberOfLines={2}>
            {new Date(item.startDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            · {formatDuration(item.duration)} · with {item.instructor || "-"}
            {item.classTypeLabel && ` · ${item.classTypeLabel}`}
          </CSS.CardSubtitle>
        </CSS.CardInfo>
      </CSS.Card>
    </CSS.Container>
  );
};
