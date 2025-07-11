import { useState } from "react";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { useForm, Controller, useWatch } from "react-hook-form";

import Button from "@/app/ui/button/button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";

import * as CSS from "./styles";
import { API_URL } from "@/env";
import { Colors } from "@/constants/Colors";
import { ErrorMessage } from "@/app/ui/error-message";

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

  const [signUpError, setSignUpError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setSignUpError(null);

    if (data.password !== data.confirmPassword) {
      setSignUpError(new Error("Passwords do not match"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/mobile/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.emailText.toLowerCase(),
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to register");
      }

      router.push("/");
    } catch (error) {
      console.error("Error signing up:", error);
      setSignUpError(
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CSS.Container>
      <CSS.Body>
        {signUpError && <ErrorMessage error={signUpError} />}

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
              secureTextEntry
              left={<TextInput.Icon color={Colors.light.text} icon="lock" />}
            />
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              value === formValues.password || "Passwords do not match",
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
              secureTextEntry
              error={Boolean(errors.confirmPassword)}
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <ErrorMessage
            error={
              new Error(
                errors.confirmPassword.message || "Confirm password is required"
              )
            }
          />
        )}

        <CSS.ButtonContainer>
          <Button
            variant="secondary"
            title="Sign Up"
            disabled={isButtonDisabled || isSubmitting}
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
        <CSS.FooterText onPress={() => router.push("/")}>
          Sign up later, continue to app
        </CSS.FooterText>
      </CSS.Footer>
    </CSS.Container>
  );
};

export default SignUp;
