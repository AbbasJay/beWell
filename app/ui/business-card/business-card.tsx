import { View } from "react-native";
import { Business } from "@/app/contexts/BusinessContext";
import * as CSS from "./styles";

type BusinessCardProps = {
  item: Business;
  onPress?: () => void;
  fullWidth?: boolean;
};

export const BusinessCard = ({ item, onPress, fullWidth }: BusinessCardProps) => {
  return (
    <CSS.Wrapper>
      <CSS.Container onPress={onPress} fullWidth={fullWidth}>
        <CSS.ImageWrapper>
          <CSS.CardHours>{item.hours}</CSS.CardHours>
          <CSS.BookmarkIcon />
        </CSS.ImageWrapper>
        <CSS.SampleImage
          source={require('@/assets/images/image 84.png')}
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
