import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Button from "./ui/button/button";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

const Index = () => {
  const router = useRouter();

  return (
    <Container>
      <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
        Welcome to beWell
      </Text>

      <MaterialIcons
        onPress={() => router.push("/logIn")}
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
