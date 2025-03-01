import { Business } from "@/app/contexts/BusinessContext";
import * as CSS from "./styles";
import { Skeleton } from "react-native-skeletons";

type BusinessCardProps = {
  item: Business;
  onPress?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  isLoading?: boolean;
  distance?: number;
};

export const BusinessCard = ({
  item,
  onPress,
  width,
  height,
  disabled,
  isLoading = false,
  distance,
}: BusinessCardProps) => {
  return (
    <CSS.Wrapper>
      <CSS.Container onPress={onPress} width={width} disabled={disabled}>
        {isLoading ? (
          <>
            <Skeleton height={80} width="100%" />
            <Skeleton height={20} width="60%" style={{ marginTop: 10 }} />
            <Skeleton height={20} width="80%" style={{ marginTop: 5 }} />
            <Skeleton height={20} width="40%" style={{ marginTop: 5 }} />
          </>
        ) : (
          <>
            <CSS.ImageWrapper></CSS.ImageWrapper>
            <CSS.SampleImage
              height={height}
              source={
                item.photo
                  ? { uri: item.photo }
                  : require("@/assets/images/home-gym.webp")
              }
              resizeMode="cover"
            />
            <CSS.ContentWrapper>
              <CSS.CardTitle>{item.name}</CSS.CardTitle>
              <CSS.CardType>{distance?.toFixed(1)} km</CSS.CardType>
              <CSS.Info>{item.address}</CSS.Info>
              <CSS.Info>{item.phoneNumber}</CSS.Info>
              <CSS.Info>{item.type}</CSS.Info>
            </CSS.ContentWrapper>
          </>
        )}
      </CSS.Container>
    </CSS.Wrapper>
  );
};
