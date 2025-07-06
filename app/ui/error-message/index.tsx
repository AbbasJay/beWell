import React from "react";
import { Container, Text } from "./styles";

interface ErrorMessageProps {
  error: Error | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <Container>
    <Text>Error: {error?.message}</Text>
  </Container>
);
