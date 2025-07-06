import { styled } from "styled-components/native";

export const FallbackContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 10px;
`;

export const FallbackInput = styled.TextInput`
  flex: 1;
  height: 38px;
  color: #5d5d5d;
  font-size: 16px;
  background-color: lightgrey;
  border-radius: 10px;
  padding-horizontal: 15px;
  margin-right: 10px;
`;

export const FallbackButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding-horizontal: 15px;
  padding-vertical: 10px;
  border-radius: 8px;
`;

export const FallbackButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;
