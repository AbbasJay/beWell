import { styled } from "styled-components/native";

export const Container = styled.View`
  padding-top: 0px;
  padding-bottom: 0px;
`;

export const SectionHeader = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-top: 24px;
  margin-bottom: 12px;
  margin-left: 16px;
`;

export const NotificationRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 16px;
  margin-bottom: 16px;
  padding-vertical: 4px;
  border-radius: 12px;
  background-color: #fff;
  position: relative;
`;

export const UnreadIndicator = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #4caf50;
  margin-right: 12px;
  align-self: center;
`;

export const ReadIndicatorSpacer = styled.View`
  width: 8px;
  margin-right: 12px;
`;

export const ActivityImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 16px;
  background-color: #f3f6f4;
`;

export const NotificationTextContainer = styled.View`
  flex: 1;
`;

export const ActivityName = styled.Text`
  font-size: 18px;
  font-weight: 400;
  color: #222;
  margin-bottom: 2px;
`;

export const ActivityNameUnread = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #121714;
  margin-bottom: 2px;
`;

export const Time = styled.Text`
  font-size: 15px;
  color: #7a9683;
  font-weight: 400;
`;

export const DeleteButton = styled.TouchableOpacity`
  margin-left: 12px;
  padding: 4px;
`;

export const MarkAllButton = styled.TouchableOpacity`
  padding-vertical: 6px;
  padding-horizontal: 18px;
  background-color: #eaf3ee;
  border-radius: 20px;
  margin-right: 0px;
`;

export const MarkAllText = styled.Text`
  color: #688273;
  font-weight: bold;
  font-size: 16px;
`;

export const DeleteAllButton = styled.TouchableOpacity`
  padding-vertical: 6px;
  padding-horizontal: 18px;
  background-color: #fbe9e7;
  border-radius: 20px;
  margin-left: 0px;
`;

export const DeleteAllText = styled.Text`
  color: #d9534f;
  font-weight: bold;
  font-size: 16px;
`;

export const ActionRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 8px;
  margin-right: 8px;
`;
