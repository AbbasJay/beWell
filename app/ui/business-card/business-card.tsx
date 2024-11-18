import { Business } from "@/app/contexts/BusinessContext";
import * as CSS from "./styles";

type BusinessCardProps = {
  item: Business;
  onPress?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
};

export const BusinessCard = ({
  item,
  onPress,
  width,
  height,
  disabled,
}: BusinessCardProps) => {
  return (
    <CSS.Wrapper>
      <CSS.Container onPress={onPress} width={width} disabled={disabled}>
        <CSS.ImageWrapper></CSS.ImageWrapper>
        <CSS.SampleImage
          height={height}
          source={require("@/assets/images/home-gym.webp")}
          resizeMode="cover"
        />
        <CSS.ContentWrapper>
          <CSS.CardTitle>{item.name}</CSS.CardTitle>
          <CSS.Info>{item.address}</CSS.Info>
          <CSS.Info>{item.phoneNumber}</CSS.Info>
          <CSS.Info>{item.type}</CSS.Info>
        </CSS.ContentWrapper>
      </CSS.Container>
    </CSS.Wrapper>
  );
};
