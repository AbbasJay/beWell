import { Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const Content = styled.View`
  justify-content: flex-end;
`;

export const TabBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${Platform.OS === "ios" ? "0 0 20px 0" : "10px"};
`;

export const Tab = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding: ${Platform.OS === "ios" ? "10px" : "6px"};
`;

export const TabText = styled.Text`
  color: #000;
  font-size: 10px;
  font-weight: 700;
`;

export const ActiveTabText = styled(TabText)`
  color: #007bff;
  font-weight: 700;
`;

export const BadgeContainer = styled.View`
  position: absolute;
  top: -12px;
  right: 2px;
  border-radius: 100px;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NotificationBadge = styled.Text`
  font-size: 10px;
  font-weight: 700;
`;

export const IconContainer = styled.View`
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
`;
