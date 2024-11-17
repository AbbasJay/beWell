import styled from "styled-components/native";

export const BusinessCardContainer = styled.View`
  margin-bottom: 5px;
`;

export const ModalBackground = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ConfirmedText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

export const BusinessDetails = styled.View`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 10px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const ClassesTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const DetailText = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
`;

export const BoldText = styled.Text`
  font-weight: bold;
`;

export const ReadMoreText = styled.Text`
  margin-top: -4px;
  margin-bottom: 4px;
  color: #999999;
`;

export const ModalLayout = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ModalContainer = styled.View`
  height: 95%;
  width: 100%;
  background-color: white;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

export const ButtonContainer = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 10px;
`;

export const FullWidthButton = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  padding: 15px;
  right: 1px;
  top: -10px;
  z-index: 1;
`;

export const CloseButtonText = styled.Text`
  font-size: 24px;
  color: #333;
`;
