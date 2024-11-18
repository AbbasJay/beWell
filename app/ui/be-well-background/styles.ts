import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";

export const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.light.secondary};
`;
