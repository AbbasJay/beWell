import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import Button from "@/app/ui/button/button";
import * as CSS from "./styles";
import { useAuth } from "@/app/contexts/auth/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

const BRIGHT_GREEN = "#38E07A";
const PLACEHOLDER_COLOR = "#6B7A6B";

const LoginForm = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  const email = watch("email");
  const password = watch("password");
  const isButtonDisabled = !Boolean(email && password);

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      await signIn(data.email, data.password);
      router.push("/home");
    } catch (err: any) {
      setLoginError("Invalid email or password");
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
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.InputWrapper>
              {!value && <CSS.PlaceholderText>Email</CSS.PlaceholderText>}
              <CSS.PlainTextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={""}
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </CSS.InputWrapper>
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{ required: "Password is required" }}
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
