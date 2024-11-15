import styled from "styled-components/native";
import { View, Text } from "react-native";

export const Container = styled(View)`
  flex: 1;
  overflow: scroll;
  padding-left: 10px;
  padding-right: 10px;
`;

export const Card = styled(View)`
  flex-direction: row;
  background-color: #fff;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
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

export const CardTitle = styled(Text)`
  font-weight: bold;
`;
