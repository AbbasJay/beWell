import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Button from "./ui/button/button";
import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

const Index = () => {
  const router = useRouter();

  return (
    <Container>
      <Text>Welcome to the Home Page</Text>
      <Button title="Go to Login" onPress={() => router.push("/logIn")} />
      <Button
        title="go to components"
        onPress={() => router.push("/components")}
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
