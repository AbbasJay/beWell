import styled from "styled-components/native";
import { StatusBar, Platform, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  style?: any;
  useSafeArea?: boolean;
  hasNavigationBar?: boolean;
}

const StyledView = styled.View`
  flex: 1;
  background-color: ${Colors.light.primary};
  ${Platform.OS === "android"
    ? `padding-top: ${StatusBar.currentHeight}px;`
    : ""}
`;

const StyledSafeAreaView = styled(SafeAreaView)<{ hasNavigationBar?: boolean }>`
  flex: 1;
  background-color: ${Colors.light.secondary};
  padding-horizontal: 12px;
  padding-top: ${(props) => (props.hasNavigationBar ? "10px" : "0")};
`;

export const BeWellBackground: React.FC<BeWellBackgroundProps> = ({
  children,
  style,
  useSafeArea = true,
  hasNavigationBar = false,
}) => {
  const Container = useSafeArea ? StyledSafeAreaView : StyledView;

  return (
    <Container hasNavigationBar={hasNavigationBar} style={style}>
      {children}
    </Container>
  );
};
