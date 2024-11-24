import { useState } from "react";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { useForm, Controller, useWatch } from "react-hook-form";

import Button from "@/app/ui/button/button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";
import { useUserContext } from "@/app/contexts/UserContext";

import * as CSS from "./styles";
import { API_URL } from "@/env";
import { Colors } from "@/constants/Colors";

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

  const { setUser } = useUserContext();

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

      const userData = await response.json();
      setUser(userData);

      router.push("/home");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <CSS.Container>
      <CSS.Body>
        {/* <CSS.ThemeToggle onPress={toggleTheme}>
          <CSS.ThemeToggleText colours={colors}>
            Toggle Theme (Current: {theme})
          </CSS.ThemeToggleText>
        </CSS.ThemeToggle> */}

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
              textColor={Colors.light.text}
              mode="outlined"
              activeOutlineColor={Colors.light.text}
              value={value}
              placeholder="Name"
              placeholderTextColor={Colors.light.text}
              onChangeText={onChange}
              left={<TextInput.Icon color={Colors.light.text} icon="account" />}
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
              textColor={Colors.light.text}
              mode="outlined"
              activeOutlineColor={Colors.light.text}
              value={value}
              placeholder="Email"
              placeholderTextColor={Colors.light.text}
              onChangeText={onChange}
              left={<TextInput.Icon color={Colors.light.text} icon="email" />}
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
              textColor={Colors.light.text}
              mode="outlined"
              activeOutlineColor={Colors.light.text}
              value={value}
              placeholder="Password"
              placeholderTextColor={Colors.light.text}
              onChangeText={onChange}
              left={<TextInput.Icon color={Colors.light.text} icon="lock" />}
            />
          )}
          name="password"
        />

        {/* <Controller
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
              left={<TextInput.Icon color={Colors.light.text} icon="lock" />}
            />
          )}
          name="confirmPassword"
        /> */}

        <CSS.ButtonContainer>
          <Button
            variant="secondary"
            title="Sign Up"
            disabled={isButtonDisabled}
            onPress={handleSubmit(onSubmit)}
          />
        </CSS.ButtonContainer>

        <Button
          variant="secondary"
          title="Back to Login"
          onPress={() => router.push("/logIn")}
        />
      </CSS.Body>

      <CSS.Footer>
        <CSS.FooterText onPress={() => router.push("/home")}>
          Sign up later, continue to app
        </CSS.FooterText>
      </CSS.Footer>
    </CSS.Container>
  );
};

export default SignUp;
