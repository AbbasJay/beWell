import { styled } from "styled-components/native";

export const ProfileImageWrapper = styled.View<{ size: number }>`
  position: relative;
  width: ${(props) => props.size + 16}px;
  height: ${(props) => props.size + 16}px;
  align-items: center;
  justify-content: center;
`;

export const ProfileImageContainer = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background-color: #648772;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ProfileImageStyled = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
`;

export const InitialsText = styled.Text<{ size: number }>`
  color: white;
  font-size: ${(props) => props.size * 0.4}px;
  font-weight: bold;
  text-align: center;
`;

export const CameraButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #111714;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: white;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  z-index: 10;
`;

export const LoadingOverlay = styled.View<{ size: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: ${(props) => props.size / 2}px;
  align-items: center;
  justify-content: center;
`;
