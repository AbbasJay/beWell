import styled from "styled-components/native";
import { View, Text } from "react-native";

export const Container = styled(View)``;

export const Card = styled(View)`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
`;

export const CardIcon = styled(View)`
  width: 60px;
  height: 100%;
  margin-right: 20px;
`;

export const CardInfo = styled(View)``;

export const CardText = styled(Text)`
  font-size: 16px;
  color: #333;
`;
