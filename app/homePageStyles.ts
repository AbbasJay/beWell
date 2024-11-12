import styled from "styled-components/native";
import { Dimensions } from "react-native";

const { width: viewportWidth } = Dimensions.get("window");

export const Container = styled.View`
  flex: 1;
  padding-top: 20px;
  padding-bottom: 20px;
`;

export const FlatListContainer = styled.View`
  height: fit-content;
`;

export const Card = styled.View`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-left: 25px;
  margin-right: 25px;
  width: ${viewportWidth * 0.6}px;
  height: 200px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
