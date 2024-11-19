import { Image } from "react-native";
import { styled } from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const Wrapper = styled.View``;

export const Container = styled.TouchableOpacity<{ width?: string }>`
  background-color: #ffffff;
  margin: 10px 0;
  border-radius: 8px;
  width: ${({ width }) => (width ? `${width}` : "150px")};
`;

export const ImageWrapper = styled.View``;

export const SampleImage = styled(Image)<{ height?: string }>`
  width: 100%;
  height: ${({ height }) => (height ? `${height}` : "100px")};
  border-radius: 4px;
  margin-bottom: 14px;
  resize-mode: cover;
  object-fit: cover;
`;

export const ContentWrapper = styled.View`
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  margin-bottom: 4px;
  font-weight: 400;
`;

export const Info = styled.Text`
  font-size: 12px;
  margin-bottom: 2px;
  color: ${Colors.dark.secondary};
`;

export const CardDescription = styled.Text`
  color: ${Colors.light.text};
`;

export const CardPhoneNumber = styled.Text``;

export const CardType = styled.Text`
  color: ${Colors.dark.secondary};
  font-weight: 800;
`;
