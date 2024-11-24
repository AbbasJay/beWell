import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const getToken = async (): Promise<string | null> => {
  return Platform.OS === "web"
    ? localStorage.getItem("userToken")
    : await SecureStore.getItemAsync("userToken");
};
