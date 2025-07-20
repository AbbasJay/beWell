import { styled } from "styled-components/native";
import { TouchableOpacity } from "react-native";

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 16px;
  padding-bottom: 8px;
`;

export const HeaderTitle = styled.Text`
  color: #111714;
  font-size: 18px;
  font-weight: bold;
  flex: 1;
  text-align: center;
  padding-left: 48px;
`;

export const SettingsButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

export const ProfileSection = styled.View`
  padding: 16px;
  align-items: center;
  gap: 16px;
`;

export const ProfileImage = styled.Image`
  width: 128px;
  height: 128px;
  border-radius: 64px;
  background-color: #f0f0f0;
`;

export const ProfileInfo = styled.View`
  align-items: center;
  justify-content: center;
`;

export const ProfileName = styled.Text`
  color: #111714;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

export const ProfileStatus = styled.Text`
  color: #648772;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
`;

export const SectionTitle = styled.Text`
  color: #111714;
  font-size: 22px;
  font-weight: bold;
  padding-bottom: 12px;
  padding-top: 20px;
`;

export const ClassItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  background-color: white;
  padding: 16px;
  min-height: 72px;
`;

export const ClassImage = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

export const ClassInfo = styled.View`
  flex: 1;
  justify-content: center;
`;

export const ClassTime = styled.Text`
  color: #111714;
  font-size: 16px;
  font-weight: 500;
`;

export const ClassName = styled.Text`
  color: #648772;
  font-size: 14px;
  font-weight: normal;
  margin-top: 2px;
`;

export const BottomSpacing = styled.View`
  height: 100px;
`;

export const LoadingText = styled.Text`
  color: #648772;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  padding: 16px;
`;

export const EmptyText = styled.Text`
  color: #648772;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  padding: 16px;
  font-style: italic;
`;
