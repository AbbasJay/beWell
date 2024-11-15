import styled from "styled-components/native";
import { StatusBar } from "react-native";
import { Colors } from "@/constants/Colors";

const statusBarHeight = StatusBar.currentHeight ?? 50;

export const BeWellBackground = styled.SafeAreaView`
  flex: 1;
  background-color: ${Colors.light.background};
  padding-top: ${statusBarHeight + 20}px;
`;