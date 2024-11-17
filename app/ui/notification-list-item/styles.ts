import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const Container = styled.View`
  padding: 8px 8px 24px 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.dark.secondary};
  flex-direction: row;
  align-items: center;
`;

export const LeftSection = styled.View`
  margin-right: 12px;
`;

export const SampleImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 10px;
`;

export const MiddleSection = styled.View`
  flex: 1;
  justify-content: space-between;
  min-height: 80px;
`;

export const MessageText = styled.Text`
  font-weight: 600;
`;

export const DateTimeText = styled.Text`
  color: ${Colors.dark.secondary};
`;

export const RightSection = styled.View`
  margin-left: 12px;
  align-self: center;
`;

export const TimeText = styled.Text`
  color: ${Colors.dark.secondary};
  font-size: 12px;
`;

export const BusinessNameText = styled.Text`
  font-weight: 600;
`;
