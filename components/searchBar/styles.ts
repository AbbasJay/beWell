import styled from "styled-components/native";

export const ResultsContainer = styled.View`
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  elevation: 3; /* For Android shadow */
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const ResultItem = styled.TouchableOpacity`
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const ResultText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #333;
`;
