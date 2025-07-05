import styled, { css } from "styled-components/native";
import { View, Text, TouchableOpacity, Image } from "react-native";

export const Container = styled(View)`
  flex: 1;
  overflow: scroll;
`;

export const Card = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  background-color: #fff;
  padding-horizontal: 16px;
  min-height: 72px;
  padding-vertical: 8px;
  margin-bottom: 0;
`;

export const CardImageContainer = styled(View)`
  background-color: #eee;
  border-radius: 12px;
  width: 56px;
  height: 56px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

export const CardImage = styled(Image)`
  width: 56px;
  height: 56px;
  border-radius: 12px;
`;

export const CardInfo = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

export const CardTitle = styled(Text)`
  color: #121714;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 2px;
`;

export const CardSubtitle = styled(Text)`
  color: #688273;
  font-size: 14px;
  font-weight: 400;
`;

export const IconTextWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const CardText = styled(Text)<{ isTitle?: boolean }>`
  font-size: 14px;
  color: #333;
  height: 30px;
  ${({ isTitle }) =>
    isTitle &&
    css`
      font-weight: bold;
    `}
`;
