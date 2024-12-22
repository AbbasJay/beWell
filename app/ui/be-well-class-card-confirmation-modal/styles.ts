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

export const DetailTextWrapper = styled.View``;

export const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

export const ModalContent = styled.View`
  height: 80%;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  width: 100%;
  position: relative;
`;

export const ContentWrapper = styled.View`
  flex: 1;
`;

export const ModalTopSection = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: black;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

export const ButtonContainer = styled.View`
  align-items: center;
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
`;

export const ConfirmContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;
