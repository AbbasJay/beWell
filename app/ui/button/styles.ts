import styled from "styled-components/native";
import { TouchableOpacity, Text } from "react-native";
import { Colors } from "@/constants/Colors";

interface ContainerProps {
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.size === "small" ? "8px 16px" : props.size === "large" ? "16px 32px" : "14px 20px"};
  border-radius: 5px;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  
  ${({ variant, disabled }) => {
    if (disabled) {
      return `
        background-color: ${Colors.disabled.disabled};
      `;
    }
    switch (variant) {
      case "secondary":
        return `
          background-color: ${Colors.dark.secondary};
        `;
      case "tertiary":
        return `
          background-color: transparent;
          border: 2px solid ${Colors.light.primary};
        `;
      default:
        return `
          background-color: ${Colors.light.primary};
        `;
    }
  }}
`;

export const StyledText = styled(Text)<ContainerProps>`
  color: ${({ variant }) => {
    console.log('Text variant:', variant);
    switch (variant) {
      case "secondary":
        return Colors.dark.text;
      case "tertiary":
        return Colors.light.text;
      case "primary":
      default:
        return Colors.light.text;
    }
  }};
  font-size: 16px;
  font-weight: 800;
`;
