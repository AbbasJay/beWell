import React from "react";
import { Container, StyledText } from "./styled";

interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  title: string;
  onPress: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  iconLeft,
  iconRight,
  variant = "primary",
  size = "medium",
  fullWidth = false,
}: ButtonProps) {
  return (
    <Container onPress={onPress} fullWidth={fullWidth}>
      <StyledText>{title}</StyledText>
    </Container>  
  );
}
