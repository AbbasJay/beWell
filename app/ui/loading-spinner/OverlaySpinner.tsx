import React from "react";
import { View, ActivityIndicator } from "react-native";
import { styles } from "./styles";

interface OverlaySpinnerProps {
  visible?: boolean;
  size?: "small" | "large";
  color?: string;
}

export default function OverlaySpinner({
  visible = true,
  size = "large",
  color = "#38E07A",
}: OverlaySpinnerProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.overlaySpinner}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </View>
  );
}
