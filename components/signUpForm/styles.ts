import styled from "styled-components/native";
import { TextInput, Button } from "react-native-paper";
import { Platform, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  width: 100%;
  padding: 20px;
  background-color: ${Colors.light.background};
  margin-top: ${Platform.OS === "ios" ? "62px" : "0"};
`;

export const Logo = styled.View`
  padding: 20px 0;
  align-items: center;
`;

export const StyledText = styled.Text<{
  fontSize: string;
}>`
  color: ${Colors.light.text};
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
  color: ${Colors.light.text};
  font-size: 16px;
`;

export const StyledTextInput = styled(TextInput)`
  background-color: ${(props) => props.theme.colors?.surface};
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
  &:hover {
    text-decoration: underline;
  }
`;

export const ButtonContainer = styled.View`
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const StyledButton = styled(Button)`
  padding: 8px 0;
  justify-content: center;
  border-radius: 8px;
  ${(props) => props.disabled && `background-color: gray`};
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

export const Footer = styled.View`
  padding: 20px 0;
  align-items: center;
`;

export const FooterText = styled.Text`
  text-align: center;
  color: ${Colors.light.text};
`;
