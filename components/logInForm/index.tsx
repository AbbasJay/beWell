import React, { useState } from "react";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import { TouchableOpacity } from "react-native";
import Button from "@/app/ui/button/button";
import { Colors } from "@/constants/Colors";
import * as CSS from "./styles";

interface LoginFormData {
  email: string;
  password: string;
}

const BRIGHT_GREEN = "#38E07A";
const PLACEHOLDER_COLOR = "#6B7A6B";

const LoginForm = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const { signIn, continueAsGuest, redirectPath, clearRedirectPath } =
    useAuth();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const email = watch("email");
  const password = watch("password");
  const isButtonDisabled = !Boolean(email && password);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      await signIn(data.email, data.password);

      // Check if there's a redirect path set
      if (redirectPath) {
        try {
          router.push(redirectPath as any);
          clearRedirectPath();
        } catch (error) {
          // If redirect fails, go to home
          router.push("/");
          clearRedirectPath();
        }
      } else {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes("user not found")) {
          setLoginError("No account found with this email");
        } else if (errorMessage.includes("invalid password")) {
          setLoginError("Incorrect password");
        } else if (errorMessage.includes("authentication failed")) {
          setLoginError("Invalid email or password");
        } else if (errorMessage.includes("no authentication token")) {
          setLoginError("Login failed. Please try again");
        } else if (errorMessage.includes("invalid response format")) {
          setLoginError("Server error. Please try again later");
        } else {
          setLoginError(err.message);
        }
      } else {
        setLoginError("An unexpected error occurred");
      }
    }
  };

  const handleContinueAsGuest = () => {
    try {
      continueAsGuest();
      router.push("/");
    } catch (err) {
      setLoginError("Failed to continue as guest. Please try again");
    }
  };

  return (
    <CSS.Container style={{ justifyContent: "flex-start", paddingTop: 48 }}>
      <CSS.TitleText>BeWell</CSS.TitleText>
      <CSS.Body style={{ flex: 1, width: "100%" }}>
        {loginError && (
          <CSS.ErrorContainer>
            <CSS.ErrorText>{loginError}</CSS.ErrorText>
          </CSS.ErrorContainer>
        )}
        <Controller
          control={control}
          rules={{
            required: "Email is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.InputWrapper>
              {!value && <CSS.PlaceholderText>Email</CSS.PlaceholderText>}
              <CSS.PlainTextInput
                value={value}
                placeholder={""}
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {errors.email && (
                <CSS.ErrorText>{errors.email.message}</CSS.ErrorText>
              )}
            </CSS.InputWrapper>
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.InputWrapper style={{ marginBottom: 8 }}>
              {!value && <CSS.PlaceholderText>Password</CSS.PlaceholderText>}
              <CSS.PlainTextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={""}
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.password && (
                <CSS.ErrorText>{errors.password.message}</CSS.ErrorText>
              )}
            </CSS.InputWrapper>
          )}
          name="password"
        />
        <TouchableOpacity
          style={{ marginBottom: 32, marginTop: 4 }}
          onPress={() => {}}
        >
          <CSS.ForgotPasswordText>Forgot Password?</CSS.ForgotPasswordText>
        </TouchableOpacity>
        <Button
          title="Sign In"
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={isButtonDisabled}
          fullWidth
          style={{
            borderRadius: 32,
            marginBottom: 16,
          }}
        />
        {/* <CSS.IconContainer>
          <Icon color="black" source="google" size={20} />
          <Icon color="black" source="instagram" size={20} />
          <Icon color="black" source="apple" size={20} />
        </CSS.IconContainer> */}
      </CSS.Body>
      <CSS.BottomLinkWrapper>
        <TouchableOpacity onPress={() => router.push("/signUp")}>
          <CSS.BottomLinkText>
            Don’t have an account? Sign Up
          </CSS.BottomLinkText>
        </TouchableOpacity>
      </CSS.BottomLinkWrapper>
    </CSS.Container>
  );
};

export default LoginForm;
