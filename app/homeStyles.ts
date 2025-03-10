import styled from "styled-components/native";

export const Container = styled.TouchableOpacity``;

export const FlatListContainer = styled.View`
  height: fit-content;
`;

export const FullWidthContainer = styled.View`
  margin: 60px -12px;
  width: auto;
  margin-bottom: 12px;
`;

export const ScrollSeparator = styled.View`
  width: 16px;
`;

export const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 12px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const SearchBarContainer = styled.View`
  position: absolute;
  top: 60px;
  width: 100%;
  padding-horizontal: 20px;
  z-index: 10;
`;
