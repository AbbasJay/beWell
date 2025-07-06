import { Image } from "react-native";
import { styled } from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const Card = styled.TouchableOpacity<{ width?: number }>`
  gap: 12px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  width: ${({ width }) => (width ? `${width}px` : "160px")};
`;

export const CardImage = styled(Image)<{ width?: number; height?: number }>`
  border-radius: 12px;
  width: ${({ width }) => (width ? `${width}px` : "160px")};
  height: ${({ height }) => (height ? `${height}px` : "160px")};
`;

export const Info = styled.View`
  gap: 4px;
  padding-horizontal: 12px;
  padding-bottom: 12px;
`;

export const Name = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #121714;
  letter-spacing: -0.3px;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: #688273;
  font-weight: 400;
`;

// Skeleton wrapper for loading state
export const SkeletonCard = styled.View<{ width?: number }>`
  gap: 12px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  width: ${({ width }) => (width ? `${width}px` : "160px")};
`;

export const SkeletonImage = styled.View<{ width?: number; height?: number }>`
  border-radius: 12px;
  width: ${({ width }) => (width ? `${width}px` : "160px")};
  height: ${({ height }) => (height ? `${height}px` : "160px")};
`;

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

export const InfoText = styled.Text`
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
