import * as CSS from "./styles";
import {
  ScrollView,
  StyleSheet,
  RefreshControlProps,
  ViewStyle,
} from "react-native";
import { useState, ReactNode, ReactElement } from "react";
import { ErrorMessage } from "@/app/ui/error-message";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  refreshControl?: ReactElement<RefreshControlProps>;
  backgroundColor?: string;
  paddingHorizontal?: number;
}

const defaultContentContainerStyle = {
  paddingHorizontal: 16,
};

export const BeWellBackground = ({
  children,
  scrollable = false,
  contentContainerStyle,
  refreshControl,
  backgroundColor,
  paddingHorizontal = 16,
}: BeWellBackgroundProps) => {
  const [error, setError] = useState<Error | null>(null);

  try {
    const combinedStyle = StyleSheet.flatten([
      { ...defaultContentContainerStyle, paddingHorizontal },
      contentContainerStyle || {},
    ]);

    if (error) {
      return <ErrorMessage error={error} />;
    }

    return (
      <CSS.StyledSafeAreaView
        edges={["left", "right"]}
        backgroundColor={backgroundColor}
        style={{ position: "relative" }}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={combinedStyle}
            showsVerticalScrollIndicator={false}
            {...(refreshControl ? { refreshControl } : {})}
          >
            {children}
          </ScrollView>
        ) : (
          <CSS.ContentContainer style={combinedStyle}>
            {children}
          </CSS.ContentContainer>
        )}
      </CSS.StyledSafeAreaView>
    );
  } catch (err) {
    setError(err instanceof Error ? err : new Error("Layout error"));
    return <ErrorMessage error={error} />;
  }
};
