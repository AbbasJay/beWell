import React from "react";
import { Container, StyledText } from "./styled";

interface ButtonProps {
  variant?: "primary" | "secondary";
  title: string;
  onPress: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({ title, onPress, iconLeft, iconRight, variant = "primary", fullWidth = true }: ButtonProps) {
  return (
    <Container onPress={onPress} fullWidth={fullWidth}>
      <StyledText>{title}</StyledText>
    </Container>
  );
}