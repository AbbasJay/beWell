import styled from "styled-components/native";
import { StatusBar, Platform, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  style?: any;
  useSafeArea?: boolean;
}

const StyledView = styled.View`
  flex: 1;
  background-color: ${Colors.light.primary};
  ${Platform.OS === "android"
    ? `padding-top: ${StatusBar.currentHeight}px;`
    : ""}
`;

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.light.secondary};
  padding: 10px 12px;
`;

export const BeWellBackground: React.FC<BeWellBackgroundProps> = ({
  children,
  style,
  useSafeArea = true,
}) => {
  const Container = useSafeArea ? StyledSafeAreaView : StyledView;

  return <Container style={style}>{children}</Container>;
};
