import { Business } from "@/app/contexts/BusinessContext";
import * as CSS from "./styles";

type BusinessCardProps = {
  item: Business;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
};

export const BusinessCard = ({
  item,
  onPress,
  fullWidth,
  disabled,
}: BusinessCardProps) => {
  return (
    <CSS.Wrapper>
      <CSS.Container
        onPress={onPress}
        fullWidth={fullWidth}
        disabled={disabled}
      >
        <CSS.ImageWrapper></CSS.ImageWrapper>
        <CSS.SampleImage
          source={require("@/assets/images/home-gym.webp")}
          resizeMode="cover"
        />
        <CSS.ContentWrapper>
          <CSS.CardTitle>{item.name}</CSS.CardTitle>
          <CSS.CardAddress>{item.address}</CSS.CardAddress>
          <CSS.CardDescription>{item.description}</CSS.CardDescription>
          <CSS.CardPhoneNumber>{item.phoneNumber}</CSS.CardPhoneNumber>
          <CSS.CardType>{item.type}</CSS.CardType>
        </CSS.ContentWrapper>
      </CSS.Container>
    </CSS.Wrapper>
  );
};
