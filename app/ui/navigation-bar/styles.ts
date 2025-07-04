import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${Colors.dark.primary};
  padding: 0 12px;
  min-height: 44px;
`;

export const TitleContainer = styled.View`
  display: flex;
  flex: 2;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: gray;
  text-align: center;
`;

export const LeftContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex: 1;
`;

export const LeftItem = styled.TouchableOpacity``;

export const LeftItemText = styled.Text``;

export const RightContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
`;

export const RightItem = styled.TouchableOpacity``;

export const RightItemText = styled.Text``;
