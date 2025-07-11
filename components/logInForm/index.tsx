import React, { useState } from "react";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import Button from "@/app/ui/button/button";
import { Colors } from "@/constants/Colors";
import * as CSS from "./styles";

interface LoginFormData {
  email: string;
  password: string;
}

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
    <CSS.Container>
      <CSS.Body>
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
            <>
              <CSS.StyledTextInput
                outlineStyle={{ borderRadius: 12 }}
                textColor={Colors.light.text}
                mode="outlined"
                activeOutlineColor={Colors.light.text}
                value={value}
                placeholder="Email"
                placeholderTextColor={Colors.light.text}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.email}
                left={<TextInput.Icon color={Colors.light.text} icon="email" />}
              />
              {errors.email && (
                <CSS.ErrorText>{errors.email.message}</CSS.ErrorText>
              )}
            </>
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <CSS.StyledTextInput
                outlineStyle={{ borderRadius: 12 }}
                textColor={Colors.light.text}
                mode="outlined"
                activeOutlineColor={Colors.light.text}
                value={value}
                placeholder="Password"
                placeholderTextColor={Colors.light.text}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.password}
                secureTextEntry
                left={<TextInput.Icon color={Colors.light.text} icon="lock" />}
              />
              {errors.password && (
                <CSS.ErrorText>{errors.password.message}</CSS.ErrorText>
              )}
            </>
          )}
          name="password"
        />

        <CSS.RememberMeContainer>
          <CSS.LinkText>Remember Me</CSS.LinkText>
          <CSS.StyledLink
            // onPress={() => Linking.openURL("https://www.google.com")}
            onPress={() => {}}
          >
            <CSS.LinkText>Forgot Password?</CSS.LinkText>
          </CSS.StyledLink>
        </CSS.RememberMeContainer>

        <CSS.ButtonContainer>
          <Button
            title="Log In"
            variant="secondary"
            onPress={handleSubmit(onSubmit)}
            disabled={isButtonDisabled}
          />

          <CSS.OptionContainer>
            <CSS.StyledText fontSize="16px">OR</CSS.StyledText>
          </CSS.OptionContainer>

          <Button
            title="Sign Up"
            variant="secondary"
            onPress={() => router.push("/signUp")}
          />
        </CSS.ButtonContainer>

        {/* <CSS.IconContainer>
          <Icon color="black" source="google" size={20} />
          <Icon color="black" source="instagram" size={20} />
          <Icon color="black" source="apple" size={20} />
        </CSS.IconContainer> */}
      </CSS.Body>

      <CSS.Footer>
        <CSS.FooterText onPress={handleContinueAsGuest}>
          Sign up later, continue to app
        </CSS.FooterText>
      </CSS.Footer>
    </CSS.Container>
  );
};

export default LoginForm;
