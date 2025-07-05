import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";

interface StyledSafeAreaViewProps {
  backgroundColor?: string;
}

export const StyledSafeAreaView = styled(SafeAreaView)<StyledSafeAreaViewProps>`
  flex: 1;
  background-color: ${({ backgroundColor }) =>
    backgroundColor || Colors.light.secondary};
`;

export const ContentContainer = styled.View`
  flex: 1;
`;
