import styled from "styled-components/native";
import MapView from "react-native-maps";
import Carousel from "react-native-reanimated-carousel";

export const Container = styled.View`
  flex: 1;
`;

export const StyledMapView = styled(MapView)`
  flex: 1;
`;

export const CarouselContainer = styled.View`
  position: absolute;
  bottom: 20px;
  width: 100%;
`;

export const StyledCarousel = styled(Carousel)`
  width: 100%;
  height: 100px;
  align-items: flex-center;
  justify-content: center;
`;

export const Card = styled.TouchableOpacity`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-horizontal: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  elevation: 5;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const CardAddress = styled.Text`
  font-size: 14px;
  color: #555;
`;

export const ButtonContainer = styled.View`
  position: absolute;
  top: 150px;
  right: 20px;
  gap: 10px;
  z-index: 10;
`;

export const Button = styled.TouchableOpacity`
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  shadow-offset: {
    width: 1px;
    height: 10px;
  }
`;

export const CardTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;


