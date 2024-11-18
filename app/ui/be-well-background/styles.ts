import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";

export const StyledSafeAreaView = styled(SafeAreaView)<{
  fixedPaddingTop?: boolean;
}>`
  flex: 1;
  background-color: ${Colors.light.secondary};
  padding-top: ${({ fixedPaddingTop }) => (fixedPaddingTop ? "12px" : "0px")};
`;

export const StyledView = styled(View)<{
  hasNavigationBar?: boolean;
  topInset?: number;
}>`
  flex: 1;
  padding-top: ${({ hasNavigationBar, topInset }) =>
    hasNavigationBar ? `${topInset}px` : "0px"};
`;

export const StyledScrollView = styled(ScrollView)``;
