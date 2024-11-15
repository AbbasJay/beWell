import { View, Text } from "react-native";
import styled from "styled-components/native";

export const BusinessDetails = styled(View)`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 10px;
`;

export const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const ClassesTitle = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const DetailText = styled(Text)`
  font-size: 16px;
  margin-bottom: 8px;
`;

export const BoldText = styled(Text)`
  font-weight: bold;
`;

export const ReadMoreText = styled(Text)`
  margin-top: -4px;
  margin-bottom: 4px;
  color: #999999;
`;
export const ModalContainer = styled(View)`
  height: 95%;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

export const ModalLayout = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
