import styled from "styled-components/native";
import { TextInput, Button, Text } from "react-native-paper";
import { Platform, TouchableOpacity, View, Text as RNText } from "react-native";
import { Colors } from "@/constants/Colors";

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: ${Colors.light.background};
  margin-top: ${Platform.OS === "ios" ? "62px" : "0"};
`;

export const TitleText = styled(RNText)`
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: ${Colors.light.text};
`;

export const InputWrapper = styled(View)`
  background-color: #f0f5f2;
  border-radius: 16px;
  margin-bottom: 20px;
  position: relative;
`;

export const PlaceholderText = styled(RNText)`
  position: absolute;
  left: 18px;
  top: 18px;
  color: #638773;
  font-size: 18px;
  z-index: 1;
`;

export const PlainTextInput = styled.TextInput`
  border-width: 0px;
  background-color: transparent;
  color: ${Colors.light.text};
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 18px;
  padding-bottom: 18px;
  font-size: 18px;
`;

export const ForgotPasswordText = styled(RNText)`
  color: #638773;
  font-size: 18px;
`;

export const BottomLinkWrapper = styled(View)`
  width: 100%;
  margin-bottom: 20px;
`;

export const BottomLinkText = styled(RNText)`
  color: #6b7a6b;
  font-size: 16px;
  text-align: center;
`;

export const Logo = styled.View`
  padding: 20px 0;
  align-items: center;
`;

export const StyledText = styled.Text<{
  fontSize: string;
}>`
  color: ${Colors.dark.text};
  font-size: ${(props) => props.fontSize};
`;

export const Body = styled.View`
  flex: 1;
  justify-content: flex-start;
  padding-top: 20px;
`;

export const ThemeToggle = styled.Pressable`
  margin-bottom: 20px;
`;

export const ThemeToggleText = styled.Text`
  color: ${Colors.dark.text};
  font-size: 16px;
`;

export const StyledTextInput = styled(TextInput)`
  background-color: ${Colors.dark.text};
  width: 100%;
  margin-bottom: 15px;
`;

export const RememberMeContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const LinkText = styled.Text`
  margin-right: 10px;
  color: ${Colors.light.text};
`;

export const StyledLink = styled(TouchableOpacity)`
  @media (hover: hover) {
    &:hover {
      text-decoration: none;
    }
  }
`;

export const ButtonContainer = styled.View`
  margin-bottom: 20px;
`;

export const OptionContainer = styled.View`
  align-items: center;
`;

export const IconContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const Footer = styled.View``;

export const FooterText = styled.Text`
  text-align: center;
  color: ${Colors.light.text};
`;

export const ErrorContainer = styled.View`
  background-color: #ffebee;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

export const ErrorText = styled.Text`
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
`;
