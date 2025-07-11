import React from "react";
import * as Haptics from "expo-haptics";
import * as CSS from "./styles";

interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  title: string;
  onPress: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: any;
}

const handlePress = async (onPress: () => void, disabled: boolean) => {
  if (disabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  } catch (error) {
    console.error("Haptics error:", error);
    onPress?.();
  }
};

export default function Button({
  title,
  onPress,
  iconLeft,
  iconRight,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <CSS.Container
      onPress={() => handlePress(onPress, disabled)}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      disabled={disabled}
      style={style}
    >
      <CSS.StyledText variant={variant} disabled={disabled}>
        {title}
      </CSS.StyledText>
    </CSS.Container>
  );
}
