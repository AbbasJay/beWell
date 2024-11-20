import * as CSS from "./styles";
import { ScrollView, StyleSheet } from "react-native";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: object;
}

const defaultContentContainerStyle = {
  paddingHorizontal: 12,
};

export const BeWellBackground = ({
  children,
  scrollable = false,
  contentContainerStyle,
}: BeWellBackgroundProps) => {
  const combinedStyle = StyleSheet.flatten([
    defaultContentContainerStyle,
    contentContainerStyle || {},
  ]);

  return (
    <CSS.StyledSafeAreaView>
      {scrollable ? (
        <ScrollView contentContainerStyle={combinedStyle}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </CSS.StyledSafeAreaView>
  );
};
