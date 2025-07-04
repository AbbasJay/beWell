import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: white;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 16px;
  padding-bottom: 8px;
  background-color: white;
`;

export const ProfileSection = styled.View`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

export const ProfileImage = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #121714;
  flex: 1;
  text-align: center;
`;

export const SettingsButton = styled.TouchableOpacity`
  width: 48px;
  align-items: flex-end;
`;

export const ScrollView = styled.ScrollView`
  flex: 1;
`;

export const HeroSection = styled.View`
  min-height: 480px;
  margin-top: 0;
  border-radius: 0;
  overflow: hidden;
`;

export const HeroOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  padding-horizontal: 16px;
  padding-bottom: 40px;
  justify-content: flex-end;
  gap: 24px;
`;

export const HeroContent = styled.View`
  gap: 8px;
`;

export const HeroTitle = styled.Text`
  font-size: 36px;
  font-weight: 900;
  color: white;
  line-height: 40px;
  letter-spacing: -0.033px;
`;

export const HeroSubtitle = styled.Text`
  font-size: 14px;
  color: white;
  line-height: 20px;
`;

export const SearchContainer = styled.View`
  width: 100%;
  max-width: 480px;
`;

export const SearchInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  height: 56px;
  border-radius: 12px;
  background-color: white;
  border-width: 1px;
  border-color: #dde4e0;
`;

export const SearchIconContainer = styled.View`
  width: 56px;
  height: 56px;
  justify-content: center;
  align-items: center;
  border-right-width: 1px;
  border-right-color: #dde4e0;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  height: 56px;
  padding-horizontal: 15px;
  font-size: 14px;
  color: #121714;
`;

export const ClearButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

export const SearchButton = styled.TouchableOpacity`
  background-color: #94e0b2;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  border-radius: 8px;
  margin-right: 8px;
`;

export const SearchButtonText = styled.Text`
  color: #121714;
  font-size: 14px;
  font-weight: bold;
`;

export const SearchResultsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  background-color: #f8f9fa;
  border-bottom-width: 1px;
  border-bottom-color: #e9ecef;
`;

export const SearchResultsText = styled.Text`
  font-size: 14px;
  color: #688273;
  flex: 1;
`;

export const ClearSearchText = styled.Text`
  font-size: 14px;
  color: #007aff;
  font-weight: 500;
`;

export const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #121714;
  padding-horizontal: 16px;
  padding-top: 20px;
  padding-bottom: 12px;
`;

export const BusinessListContainer = styled.View`
  margin-bottom: 12px;
`;

export const NoBusinessesContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const NoBusinessesText = styled.Text`
  font-size: 16px;
  color: #688273;
  text-align: center;
`;

export const BottomSpacing = styled.View`
  height: 20px;
`;

export const FloatingButtons = styled.View`
  position: absolute;
  bottom: 100px;
  right: 20px;
  gap: 10px;
  z-index: 10;
`;

export const FloatingButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: lightgrey;
  border-radius: 5px;
  elevation: 6;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  shadow-offset: 1px 10px;
`;

export const BottomNavigation = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #f1f4f2;
  background-color: white;
  padding-horizontal: 16px;
  padding-top: 8px;
  padding-bottom: 12px;
`;

export const NavItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  gap: 4px;
`;

export const NavText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #121714;
`;

export const NavTextInactive = styled.Text`
  color: #688273;
`;

export const LoginContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const LoginTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const LoginButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
`;

export const LoginButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const SignUpButton = styled.TouchableOpacity`
  background-color: transparent;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  border-width: 1px;
  border-color: #007aff;
`;

export const SignUpButtonText = styled.Text`
  color: #007aff;
  font-size: 16px;
  font-weight: bold;
`;

export const GuestButton = styled.TouchableOpacity`
  background-color: transparent;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  border-width: 1px;
  border-color: #28a745;
`;

export const GuestButtonText = styled.Text`
  color: #28a745;
  font-size: 16px;
  font-weight: bold;
`;

export const FlatListContainer = styled.View`
  height: fit-content;
`;

export const FullWidthContainer = styled.View`
  margin: 60px -12px;
  width: auto;
  margin-bottom: 12px;
`;

export const ScrollSeparator = styled.View`
  width: 16px;
`;

export const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 12px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const SearchBarContainer = styled.View`
  position: absolute;
  top: 60px;
  width: 100%;
  padding-horizontal: 20px;
  z-index: 10;
`;
