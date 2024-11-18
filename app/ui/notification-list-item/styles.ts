import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.View`
  align-items: center;
  border-bottom-color: ${Colors.dark.secondary};
  border-bottom-width: 1px;
  flex-direction: row;
  padding: 8px 8px 24px 8px;
`;

export const LeftSection = styled.View`
  margin-right: 12px;
`;

export const SampleImage = styled.Image`
  border-radius: 10px;
  height: 80px;
  width: 80px;
`;

export const MiddleSection = styled.View`
  flex: 1;
  justify-content: space-between;
  min-height: 80px;
`;

export const MessageText = styled.Text`
  font-weight: 600;
`;

export const BusinessNameText = styled.Text`
  font-weight: 600;
  font-size: 16px;
  color: #ff0099;
`;

export const DateTimeText = styled.Text`
  color: ${Colors.dark.secondary};
  font-size: 12px;
`;

export const RightSection = styled.View`
  align-self: center;
  margin-left: 12px;
`;

export const TimeText = styled.Text`
  color: ${Colors.dark.secondary};
  font-size: 12px;
`;
