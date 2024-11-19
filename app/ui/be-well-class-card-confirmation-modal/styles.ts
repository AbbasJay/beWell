import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const TitleContainer = styled.View``;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: 900;
`;

export const DetailTextWrapper = styled.View``;

export const Subtitle = styled.Text`
  font-size: 18px;
  font-weight: 900;
`;

export const TextInfo = styled.Text``;

export const ModalContainer = styled.View`
  height: 80%;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  width: 100%;
  justify-content: space-between;
`;

export const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

export const ModalTopSection = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: black;
  padding-bottom: 10px;
`;

export const ButtonContainer = styled.View`
  align-items: center;
`;

export const ConfirmContainer = styled.View`
  align-items: center;
  gap: 16px;
`;

export const ConfirmText = styled.Text`
  font-size: 20px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 20px;
`;
