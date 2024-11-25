import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export default async function getToken(): Promise<string | null> {
  return Platform.OS === "web"
    ? localStorage.getItem("userToken")
    : await SecureStore.getItemAsync("userToken");
}
