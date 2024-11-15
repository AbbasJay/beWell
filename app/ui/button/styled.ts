import styled from "styled-components/native";
import { TouchableOpacity, Text } from "react-native";

export const Container = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4681f4;
  padding: 14px 20px;
  border-radius: 5px;
`;

export const StyledText = styled(Text)`
  color: #fff;
  font-size: 16px;
  font-weight: 800;
`;
