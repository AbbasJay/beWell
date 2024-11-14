import { useState } from "react";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { useForm, Controller, useWatch } from "react-hook-form";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";

import * as CSS from "./styles";
import { API_URL } from "@/env";

const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      emailText: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();
  const formValues = useWatch({ control });

  const { name, emailText, password, confirmPassword } = formValues;

  const [status, setStatus] = useState("checked");

  const { theme, setTheme } = useTheme();
  const colors = useThemeColor();

  const isButtonDisabled = !Boolean(
    name && emailText && password && confirmPassword
  );

  const onButtonToggle = () => {
    setStatus(status === "checked" ? "unchecked" : "checked");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.userName,
          email: data.emailText,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register");
      }

      if (response.ok) {
        router.push("/home");
      } else {
        console.log("Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
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

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.StyledTextInput
              outlineStyle={{
                borderRadius: 12,
              }}
              onBlur={onBlur}
              textColor={colors.text}
              mode="outlined"
              value={value}
              placeholder="Full Name"
              placeholderTextColor={colors.text}
              onChangeText={onChange}
              left={<TextInput.Icon color={colors.text} icon="account" />}
            />
          )}
          name="name"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.StyledTextInput
              outlineStyle={{
                borderRadius: 12,
              }}
              textColor={colors.text}
              mode="outlined"
              value={value}
              placeholder="Email"
              placeholderTextColor={colors.text}
              onChangeText={onChange}
              left={<TextInput.Icon color={colors.text} icon="email" />}
            />
          )}
          name="emailText"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.StyledTextInput
              outlineStyle={{
                borderRadius: 12,
              }}
              textColor={colors.text}
              mode="outlined"
              value={value}
              placeholder="Password"
              placeholderTextColor={colors.text}
              onChangeText={onChange}
              left={<TextInput.Icon color={colors.text} icon="lock" />}
            />
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.StyledTextInput
              outlineStyle={{
                borderRadius: 12,
              }}
              textColor={colors.text}
              mode="outlined"
              value={value}
              placeholder="Confirm Password"
              placeholderTextColor={colors.text}
              onChangeText={onChange}
              left={<TextInput.Icon color={colors.text} icon="lock" />}
            />
          )}
          name="confirmPassword"
        />

        <CSS.ButtonContainer>
          <CSS.StyledButton
            textColor={colors.text}
            buttonColor={colors.secondary}
            mode="contained"
            uppercase
            onPress={handleSubmit(onSubmit)}
            disabled={isButtonDisabled}
          >
            Sign Up
          </CSS.StyledButton>
        </CSS.ButtonContainer>

        <CSS.StyledButton
          textColor={colors.text}
          buttonColor={colors.secondary}
          mode="contained"
          uppercase
          onPress={() => router.push("/logIn")}
        >
          Back to Login
        </CSS.StyledButton>
      </CSS.Body>

      <CSS.Footer>
        <CSS.FooterText colours={colors}>
          Sign up later, continue to app
        </CSS.FooterText>
      </CSS.Footer>
    </CSS.Container>
  );
};

export default SignUp;
