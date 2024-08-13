import { useState } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import { Icon, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";

import * as CSS from "./styles";

const LoginForm = () => {
  const router = useRouter();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [status, setStatus] = useState("checked");

  const { theme, setTheme } = useTheme();
  const colors = useThemeColor();

  const email = watch("email");
  const password = watch("password");
  const isButtonDisabled = !Boolean(email && password);

  const onButtonToggle = () => {
    setStatus(status === "checked" ? "unchecked" : "checked");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle login logic here
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

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.StyledTextInput
              outlineStyle={{ borderRadius: 12 }}
              textColor={colors.text}
              mode="outlined"
              value={value}
              placeholder="Email"
              placeholderTextColor={colors.text}
              onChangeText={onChange}
              onBlur={onBlur}
              left={<TextInput.Icon color={colors.text} icon="email" />}
            />
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.StyledTextInput
              outlineStyle={{ borderRadius: 12 }}
              textColor={colors.text}
              mode="outlined"
              value={value}
              placeholder="Password"
              placeholderTextColor={colors.text}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              left={<TextInput.Icon color={colors.text} icon="lock" />}
            />
          )}
          name="password"
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
            onPress={handleSubmit(onSubmit)}
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
