import styled, { css } from "styled-components/native";
import { View, Text } from "react-native";

export const Container = styled(View)`
  flex: 1;
  overflow: scroll;
`;

export const Card = styled(View)`
  flex-direction: row;
  background-color: #fff;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #c7c7c7;
`;

export const CardIcon = styled(View)`
  width: fit-content;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  margin-left: 10px;
`;

export const CardInfo = styled(View)``;

export const CardText = styled(Text)<{ isTitle?: boolean }>`
  font-size: 14px;
  color: #333;
  align-items: center;
  justify-content: center;
  height: 30px;
  ${({ isTitle }) =>
    isTitle &&
    css`
      font-weight: bold;
    `}
`;

export const CardTitle = styled(Text)``;
