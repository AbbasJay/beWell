import { useState } from "react";
import { Icon, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";

import * as CSS from "./styles";

const Login = () => {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [emailText, setEmailText] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("checked");

  const { theme, setTheme } = useTheme();
  const colors = useThemeColor();

  const isButtonDisabled = !Boolean(
    userName && emailText && password && confirmPassword
  );

  const onButtonToggle = () => {
    setStatus(status === "checked" ? "unchecked" : "checked");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <CSS.Container colours={colors}>
      <CSS.StyledText fontSize="40px" colours={colors}>
        Sign Up
      </CSS.StyledText>

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
          value={userName}
          placeholder="Full Name"
          placeholderTextColor={colors.text}
          onChangeText={(text: string) => setUserName(text)}
          left={<TextInput.Icon color={colors.text} icon="account" />}
        />

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
          value={password}
          placeholder="Password"
          placeholderTextColor={colors.text}
          onChangeText={(text: string) => setPassword(text)}
          left={<TextInput.Icon color={colors.text} icon="lock" />}
        />

        <CSS.StyledTextInput
          outlineStyle={{
            borderRadius: 12,
          }}
          textColor={colors.text}
          mode="outlined"
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor={colors.text}
          onChangeText={(text: string) => setConfirmPassword(text)}
          left={<TextInput.Icon color={colors.text} icon="lock" />}
        />

        <CSS.ButtonContainer>
          <CSS.StyledButton
            textColor={colors.text}
            buttonColor={colors.secondary}
            mode="contained"
            uppercase
            onPress={() => router.push("/signUpPage")}
            disabled={isButtonDisabled}
          >
            Sign Up
          </CSS.StyledButton>
        </CSS.ButtonContainer>
      </CSS.Body>

      <CSS.Footer>
        <CSS.FooterText colours={colors}>
          Sign up later, continue to app
        </CSS.FooterText>
      </CSS.Footer>
    </CSS.Container>
  );
};

export default Login;
