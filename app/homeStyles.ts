import styled from "styled-components/native";

export const Container = styled.TouchableOpacity``;

export const FlatListContainer = styled.View`
  height: fit-content;
`;

export const FullWidthContainer = styled.View`
  margin: 0 -12px;
  width: auto;
  margin-bottom: 12px;
`;

export const ScrollSeparator = styled.View`
  width: 16px;
`;

export const HeaderText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const Card = styled.View`
  shadow-color: #c7c7c7;
  shadow-offset: 0px 0px;
  shadow-opacity: 0.5;
  shadow-radius: 5px;
  elevation: 5;
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-left: 10px;
  margin-right: 10px;
  width: 300px;
  height: 200px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
