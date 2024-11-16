import styled from "styled-components/native";

export const Content = styled.View`
  flex: 1;
`;

export const TabBar = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: #eee;
  padding-vertical: 10px;
`;

export const Tab = styled.Pressable`
  padding: 10px;
`;

export const TabText = styled.Text`
  color: #000;
`;

export const ActiveTabText = styled(TabText)`
  color: #007bff;
  font-weight: bold;
`;
