import React from "react";
import { Container, StyledText } from "./styled";

interface ButtonProps {
  variant?: "primary" | "secondary";
  title: string;
  onPress: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export default function Button({ title, onPress, iconLeft, iconRight, variant = "primary" }: ButtonProps) {
  return (
    <Container onPress={onPress}>
      <StyledText>{title}</StyledText>
    </Container>
  );
}