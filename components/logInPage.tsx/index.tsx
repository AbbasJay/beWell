import { useState } from "react";
import { Linking } from "react-native";
import { Icon, TextInput, Text } from "react-native-paper";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";

import * as CSS from "./styles";

export const LoginPage = () => {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [status, setStatus] = useState("checked");

  const { theme, setTheme } = useTheme();
  const colors = useThemeColor();

  const isButtonDisabled = !Boolean(emailText && passwordText);

  const onButtonToggle = () => {
    setStatus(status === "checked" ? "unchecked" : "checked");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <CSS.Container
      style={{
        backgroundColor: colors.background,
      }}
    >
      <CSS.Logo>
        <Text style={{ color: colors.text }} variant="displayLarge">
          LOGO
        </Text>
      </CSS.Logo>

      <CSS.Body>
        <CSS.ThemeToggle onPress={toggleTheme}>
          <CSS.ThemeToggleText style={{ color: colors.text }}>
            Toggle Theme (Current: {theme})
          </CSS.ThemeToggleText>
        </CSS.ThemeToggle>

        <CSS.StyledTextInput
          outlineStyle={{
            borderRadius: 12,
          }}
          textColor={colors.text}
          mode="outlined"
          value={emailText}
          placeholder="Email"
          placeholderTextColor={colors.text}
          onChangeText={(text: string) => setEmailText(text)}
          left={<TextInput.Icon color={colors.text} icon="email" />}
        />

        <CSS.StyledTextInput
          outlineStyle={{
            borderRadius: 12,
          }}
          textColor={colors.text}
          mode="outlined"
          value={passwordText}
          placeholder="Password"
          placeholderTextColor={colors.text}
          onChangeText={(text: string) => setPasswordText(text)}
          left={<TextInput.Icon color={colors.text} icon="lock" />}
        />

        <CSS.RememberMeContainer>
          <CSS.LinkText style={{ color: colors.text }}>
            Remember Me
          </CSS.LinkText>
          <CSS.StyledLink
            onPress={() => Linking.openURL("https://www.google.com")}
          >
            <CSS.LinkText style={{ color: colors.text }}>
              Forgot Password?
            </CSS.LinkText>
          </CSS.StyledLink>
        </CSS.RememberMeContainer>

        <CSS.ButtonContainer>
          <CSS.StyledButton
            textColor={colors.text}
            buttonColor={colors.secondary}
            mode="contained"
            uppercase
            disabled={isButtonDisabled}
          >
            Sign Up
          </CSS.StyledButton>
        </CSS.ButtonContainer>

        <Text
          style={{
            color: colors.text,
            textAlign: "center",
          }}
          variant="titleLarge"
        >
          OR
        </Text>

        <CSS.IconContainer>
          <Icon color="black" source="google" size={20} />
          <Icon color="black" source="instagram" size={20} />
          <Icon color="black" source="apple" size={20} />
        </CSS.IconContainer>
      </CSS.Body>

      <CSS.Footer>
        <CSS.FooterText
          style={{
            color: colors.text,
          }}
        >
          Sign up later, continue to app
        </CSS.FooterText>
      </CSS.Footer>
    </CSS.Container>
  );
};
