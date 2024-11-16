import styled from "styled-components/native";
import { StatusBar, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export const BeWellBackground = styled.SafeAreaView`
  flex: 1;
  background-color: ${Colors.dark.background};
  ${Platform.OS === 'android' ? `padding-top: ${StatusBar.currentHeight}px;` : ''}
`;
