import { Platform } from "react-native";
import styled from "styled-components/native";

export const Content = styled.View`
  justify-content: flex-end;
`;

export const TabBar = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #f1f4f2;
  background-color: white;
  padding-horizontal: 16px;
  padding-top: 10px;
  padding-bottom: ${Platform.OS === "ios" ? "28px" : "20px"};
  height: 72px;
`;

export const Tab = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-vertical: 6px;
`;

export const TabText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #121714;
  margin-top: 2px;
`;

export const TabTextInactive = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #688273;
  margin-top: 2px;
`;

export const BadgeContainer = styled.View`
  position: absolute;
  top: 2px;
  right: -8px;
  background-color: #ff4444;
  border-radius: 10px;
  padding: 2px 6px;
  min-width: 16px;
  align-items: center;
  justify-content: center;
`;

export const NotificationBadge = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: white;
`;

export const IconContainer = styled.View`
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
`;
