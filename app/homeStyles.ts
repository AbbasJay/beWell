import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  flex: 1;
  padding-top: 20px;
  padding-bottom: 20px;
`;

export const FlatListContainer = styled.View`
  height: fit-content;
`;

export const Card = styled.View`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-left: 25px;
  margin-right: 25px;
  width: 300px;
  height: 200px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
