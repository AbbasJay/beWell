import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${Colors.dark.primary};
  padding: 20px 16px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

export const TitleContainer = styled.View`
  display: flex;
  gap: 8px;
  flex: 2;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: gray;
  text-align: center;
`;

export const LeftContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex: 1;
`;

export const LeftItem = styled.TouchableOpacity``;

export const LeftItemText = styled.Text``;

export const RightContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
`;

export const RightItem = styled.TouchableOpacity``;

export const RightItemText = styled.Text``;
