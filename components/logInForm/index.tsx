import { useState } from "react";
import { Linking } from "react-native";
import { Icon, TextInput } from "react-native-paper";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";

import * as CSS from "./styles";
import { useRouter } from "expo-router";

const LoginForm = () => {
  const router = useRouter();

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
    <CSS.Container colours={colors}>
      <CSS.Logo>
        <CSS.StyledText fontSize="40px" colours={colors}>
          LOGO
        </CSS.StyledText>
      </CSS.Logo>

      <CSS.Body>
        <CSS.ThemeToggle onPress={toggleTheme}>
          <CSS.ThemeToggleText colours={colors}>
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
          <CSS.LinkText colours={colors}>Remember Me</CSS.LinkText>
          <CSS.StyledLink
            onPress={() => Linking.openURL("https://www.google.com")}
          >
            <CSS.LinkText colours={colors}>Forgot Password?</CSS.LinkText>
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
            Log In
          </CSS.StyledButton>
        </CSS.ButtonContainer>

        <CSS.OptionContainer>
          <CSS.StyledText fontSize="16px" colours={colors}>
            OR
          </CSS.StyledText>
        </CSS.OptionContainer>

        <CSS.ButtonContainer>
          <CSS.StyledButton
            textColor={colors.text}
            buttonColor={colors.secondary}
            mode="contained"
            uppercase
            onPress={() => router.push("/signUpPage")}
          >
            Sign Up
          </CSS.StyledButton>
        </CSS.ButtonContainer>

        <CSS.IconContainer>
          <Icon color="black" source="google" size={20} />
          <Icon color="black" source="instagram" size={20} />
          <Icon color="black" source="apple" size={20} />
        </CSS.IconContainer>
      </CSS.Body>

      <CSS.Footer>
        <CSS.FooterText colours={colors}>
          Sign up later, continue to app
        </CSS.FooterText>
      </CSS.Footer>
    </CSS.Container>
  );
};

export default LoginForm;
