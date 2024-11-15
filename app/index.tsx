import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Button from "./ui/button/button";
import { Colors } from "@/constants/Colors";

const Index = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.light.secondary,
      }}
    >
      <Text>Welcome to the Home Page</Text>
      <Button
        title="Go to Login"
        onPress={() => router.push("/home")} // TODO: should be '/logIn', for now to bypass login page we are going '/home'
      />
      <Button
        title="go to components"
        onPress={() => router.push("/components")}
      />
    </View>
  );
};

export default Index;
