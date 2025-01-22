import styled from "styled-components/native";

export const Container = styled.View`
  position: absolute;
  top: 60px;
  left: 20px;
  right: 20px;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  z-index: 9999;
`;

export const Message = styled.Text`
  margin-left: 12px;
  flex: 1;
`;
