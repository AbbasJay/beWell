import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
`;

export const TitleContainer = styled.View`
  align-items: center;
`;

export const Title = styled.Text``;

export const DetailTextWrapper = styled.View``;

export const Subtitle = styled.Text``;

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

export const ModalCloseIcon = styled.TouchableOpacity.attrs({
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
})`
  width: 100%;
  align-items: flex-end;
`;

export const ButtonContainer = styled.View`
  align-items: center;
`;
