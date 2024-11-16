import styled from "styled-components/native";
import { TouchableOpacity, Text } from "react-native";

interface ContainerProps {
  fullWidth?: boolean;
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4681f4;
  padding: 14px 20px;
  border-radius: 5px;
  width: ${(props) => (props.fullWidth ? "100%" : "fit-content")};
`;

export const StyledText = styled(Text)`
  color: #fff;
  font-size: 16px;
  font-weight: 800;
`;
