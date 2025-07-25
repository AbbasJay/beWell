import { Business } from "@/app/contexts/BusinessContext";
import { View } from "react-native";
import { Skeleton } from "react-native-skeletons";
import {
  Card,
  Info,
  Name,
  Description,
  SkeletonCard,
  SkeletonImage,
} from "./styles";
import { OptimizedImage } from "@/app/ui/optimized-image";

type BusinessCardProps = {
  item: Business;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  isLoading?: boolean;
  distance?: number;
  imageIndex?: number;
};

export const BusinessCard = ({
  item,
  onPress,
  width = 160,
  height = 160,
  disabled,
  isLoading = false,
  distance,
  imageIndex = 0,
}: BusinessCardProps) => {
  if (isLoading) {
    return (
      <SkeletonCard width={width}>
        <Skeleton height={height} width={width} style={{ borderRadius: 12 }} />
        <Info>
          <Skeleton height={16} width="60%" style={{ marginBottom: 4 }} />
          <Skeleton height={14} width="80%" />
        </Info>
      </SkeletonCard>
    );
  }

  return (
    <Card
      width={width}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <OptimizedImage
        source={item.photo || null}
        width={width}
        height={height}
        borderRadius={12}
      />
      <Info>
        <Name numberOfLines={1}>{item.name}</Name>
        <Description numberOfLines={1}>
          {distance
            ? `${distance.toFixed(1)} km away`
            : item.type || "Fitness Studio"}
        </Description>
      </Info>
    </Card>
  );
};
