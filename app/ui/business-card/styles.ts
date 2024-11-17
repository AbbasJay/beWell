import { Image } from "react-native";
import { styled } from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const Wrapper = styled.View`
  padding-right: 8px;
  padding-left: 8px;
`;

export const Container = styled.TouchableOpacity<{ fullWidth?: boolean }>`
  background-color: #ffffff;
  padding: 10px 12px;
  border-radius: 6px;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "300px")};
`;

export const ImageWrapper = styled.View``;

export const SampleImage = styled(Image)`
  width: 100%;
  height: 200px;
  border-radius: 4px;
  margin-bottom: 14px;
  resize-mode: cover;
  object-fit: cover;
`;

export const ContentWrapper = styled.View`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 4px;
`;

export const CardTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
`;

export const CardAddress = styled.Text`
  color: ${Colors.dark.secondary};
  font-weight: 800;
`;

export const CardDescription = styled.Text`
  color: ${Colors.light.text};
`;

export const CardPhoneNumber = styled.Text``;

export const CardType = styled.Text`
  color: ${Colors.dark.secondary};
  font-weight: 800;
`;
