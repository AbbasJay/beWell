import styled from "styled-components/native";
import { TextInput, Button, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native";

export const Container = styled.View<{ colours: { background: string } }>`
  flex: 1;
  justify-content: flex-start;
  width: 100%;
  padding: 20px;
  background-color: ${(props) => props.colours.background};
`;

export const Logo = styled.View`
  padding: 20px 0;
  align-items: center;
`;

export const StyledText = styled.Text<{
  colours: { text: string };
  fontSize: string;
}>`
  color: ${(props) => props.colours.text};
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

export const ThemeToggleText = styled.Text<{ colours: { text: string } }>`
  color: ${(props) => props.colours.text};
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

export const LinkText = styled.Text<{ colours: { text: string } }>`
  margin-right: 10px;
  color: ${(props) => props.colours.text};
`;

export const StyledLink = styled(TouchableOpacity)`
  @media (hover: hover) {
    &:hover {
      text-decoration: none;
    }
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

export const FooterText = styled.Text<{ colours: { text: string } }>`
  text-align: center;
  color: ${(props) => props.colours.text};
`;
