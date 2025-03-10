import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { ErrorMessage } from "@/app/ui/error-message";
import "react-native-get-random-values"; //This solve the error when using Google Places Autocomplete

const Index = () => {
  const router = useRouter();
  const [error, setError] = useState<Error | null>(null);

  const handleNavigation = () => {
    try {
      router.push("/logIn");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Navigation failed"));
    }
  };

  if (error) return <ErrorMessage error={error} />;

  return (
    <Container>
      <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
        Welcome to beWell
      </Text>

      <MaterialIcons
        onPress={handleNavigation}
        name="login"
        size={80}
        color="black"
      />
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default Index;
