import * as CSS from "./styles";
import { ScrollView, StyleSheet, RefreshControlProps } from "react-native";
import { useState, ReactNode, ReactElement } from "react";
import { ErrorMessage } from "@/app/ui/error-message";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: object;
  refreshControl?: ReactElement<RefreshControlProps>;
}

const defaultContentContainerStyle = {
  paddingHorizontal: 12,
};

export const BeWellBackground = ({
  children,
  scrollable = false,
  contentContainerStyle,
  refreshControl,
}: BeWellBackgroundProps) => {
  const [error, setError] = useState<Error | null>(null);

  try {
    const combinedStyle = StyleSheet.flatten([
      defaultContentContainerStyle,
      contentContainerStyle || {},
    ]);

    if (error) {
      return <ErrorMessage error={error} />;
    }

    return (
      <CSS.StyledSafeAreaView edges={["left", "right"]}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={combinedStyle}
            {...(refreshControl ? { refreshControl } : {})}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </CSS.StyledSafeAreaView>
    );
  } catch (err) {
    setError(err instanceof Error ? err : new Error("Layout error"));
    return <ErrorMessage error={error} />;
  }
};
