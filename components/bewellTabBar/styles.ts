import styled from "styled-components/native";

export const Content = styled.View`
  justify-content: flex-end;
`;

export const TabBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 10px;
`;

export const Tab = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding: 6px;
`;

export const TabText = styled.Text`
  color: #000;
  font-size: 10px;
  font-weight: 800;
`;

export const ActiveTabText = styled(TabText)`
  color: #007bff;
  font-weight: bold;
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
  font-weight: 900;
`;

export const IconContainer = styled.View`
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
`;
