import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";

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

const Container = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4681f4;
  padding: 14px 20px;
  border-radius: 5px;
`;

const StyledText = styled(Text)`
  color: #fff;
  font-size: 16px;
  font-weight: 800;
`;
