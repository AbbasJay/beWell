import styled from "styled-components/native";
import { TextInput, Button, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: ${Colors.light.background};
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
