import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Home Page</Text>
      <Button
        title="Go to Login"
        onPress={() => router.push("/business/18/classes")}
      />
    </View>
  );
};

export default Index;
