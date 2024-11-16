import styled from "styled-components/native";

export const Container = styled.View`
width: 100%;
display: flex;
flex-direction: row;
justify-content: space-between;
`;

export const TitleContainer = styled.View`
display: flex;
gap: 8px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: gray;
`;

export const LeftContainer = styled.View`
display: flex;
flex-direction: row;
gap: 12px;
`;

export const LeftItem = styled.TouchableOpacity`
`;

export const LeftItemText = styled.Text`
`;

export const RightContainer = styled.View`
display: flex;
flex-direction: row;
gap: 12px;
`;

export const RightItem = styled.TouchableOpacity`
`;

export const RightItemText = styled.Text`
`;

