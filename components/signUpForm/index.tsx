import { useState } from "react";
import { useRouter } from "expo-router";
import { useForm, Controller, useWatch } from "react-hook-form";
import Button from "@/app/ui/button/button";
import * as CSS from "./styles";
import { API_URL } from "@/env";
import { TouchableOpacity } from "react-native";

const BRIGHT_GREEN = "#38E07A";
const PLACEHOLDER_COLOR = "#638773";

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
  const isButtonDisabled = !Boolean(
    name && emailText && password && confirmPassword
  );
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
      router.push("/home");
    } catch (error) {
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
    <CSS.Container style={{ justifyContent: "flex-start", paddingTop: 48 }}>
      <CSS.TitleText>Sign Up</CSS.TitleText>
      <CSS.Body>
        {signUpError && (
          <CSS.ErrorContainer>
            <CSS.ErrorText>{signUpError.message}</CSS.ErrorText>
          </CSS.ErrorContainer>
        )}
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.InputWrapper>
              {!value && <CSS.PlaceholderText>Name</CSS.PlaceholderText>}
              <CSS.PlainTextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={""}
                placeholderTextColor={PLACEHOLDER_COLOR}
                autoCapitalize="words"
              />
            </CSS.InputWrapper>
          )}
          name="name"
        />
        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: "Enter a valid email address",
            },
          }}
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
          name="emailText"
        />
        {errors.emailText && (
          <CSS.ErrorContainer>
            <CSS.ErrorText>{errors.emailText.message}</CSS.ErrorText>
          </CSS.ErrorContainer>
        )}
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.InputWrapper>
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
        <Controller
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              value === formValues.password || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CSS.InputWrapper style={{ marginBottom: 8 }}>
              {!value && (
                <CSS.PlaceholderText>Confirm Password</CSS.PlaceholderText>
              )}
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
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <CSS.ErrorContainer>
            <CSS.ErrorText>
              {errors.confirmPassword.message || "Confirm password is required"}
            </CSS.ErrorText>
          </CSS.ErrorContainer>
        )}
        <CSS.ButtonContainer>
          <Button
            variant="primary"
            title="Sign Up"
            disabled={isButtonDisabled || isSubmitting}
            onPress={handleSubmit(onSubmit)}
            fullWidth
            style={{
              borderRadius: 32,
              marginBottom: 16,
            }}
          />
          <Button
            variant="secondary"
            title="Back to Login"
            onPress={() => router.push("/logIn")}
            fullWidth
            style={{
              backgroundColor: "#94E0B2",
              borderRadius: 32,
              marginBottom: 8,
            }}
          />
        </CSS.ButtonContainer>
      </CSS.Body>
      <CSS.BottomLinkWrapper>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <CSS.BottomLinkText>
            Sign up later, continue to app
          </CSS.BottomLinkText>
        </TouchableOpacity>
      </CSS.BottomLinkWrapper>
    </CSS.Container>
  );
};

export default SignUp;
