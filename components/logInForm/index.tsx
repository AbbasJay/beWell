import { useState } from "react";
import { Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Icon, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import Button from "@/app/ui/button/button";
import { Colors } from "@/constants/Colors";
import { ErrorMessage } from "@/app/ui/error-message";
import { API_URL } from "@/env";
import * as CSS from "./styles";

const LoginForm = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<Error | null>(null);
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [status, setStatus] = useState("checked");
  const email = watch("email");
  const password = watch("password");
  const isButtonDisabled = !Boolean(email && password);

  const onButtonToggle = () => {
    setStatus(status === "checked" ? "unchecked" : "checked");
  };

  const onSubmit = async (data: any) => {
    try {
      setLoginError(null); // Clear any previous errors
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;

        if (Platform.OS === "web") {
          localStorage.setItem("userToken", token);
        } else {
          await SecureStore.setItemAsync("userToken", token);
        }

        router.push("/home");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError(error instanceof Error ? error : new Error('An unexpected error occurred'));
    }
  };

  const { continueAsGuest } = useAuth();

  const handleContinueAsGuest = () => {
    continueAsGuest();
    router.push("/home");
  };

  return (
    // <ScrollView>
    <CSS.Container>
      <CSS.Body>
        {loginError && (
          <ErrorMessage error={loginError} />
        )}
        
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
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
              left={<TextInput.Icon color={Colors.light.text} icon="email" />}
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
              textColor={Colors.light.text}
              mode="outlined"
              activeOutlineColor={Colors.light.text}
              value={value}
              placeholder="Password"
              placeholderTextColor={Colors.light.text}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              left={<TextInput.Icon color={Colors.light.text} icon="lock" />}
            />
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
    // </ScrollView>
  );
};

export default LoginForm;
