import * as CSS from "./styles";
import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { ErrorMessage } from "@/app/ui/error-message";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: object;
  refreshControl?: React.ReactElement;
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
      <CSS.StyledSafeAreaView>
        {scrollable ? (
          <ScrollView 
            contentContainerStyle={combinedStyle}
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </CSS.StyledSafeAreaView>
    );
  } catch (err) {
    setError(err instanceof Error ? err : new Error('Layout error'));
    return <ErrorMessage error={error} />;
  }
};
