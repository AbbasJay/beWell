import styled from "styled-components/native";
import { TextInput } from "react-native-paper";
import { Platform, TouchableOpacity, View, Text as RNText } from "react-native";
import { Colors } from "@/constants/Colors";

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  width: 100%;
  padding: 20px;
  background-color: ${Colors.light.background};
  margin-top: ${Platform.OS === "ios" ? "62px" : "0"};
`;

export const TitleText = styled(RNText)`
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: ${Colors.light.text};
`;

export const Body = styled.View`
  flex: 1;
  justify-content: flex-start;
  width: 100%;
`;

export const InputWrapper = styled(View)`
  background-color: #f0f5f2;
  border-radius: 16px;
  margin-bottom: 20px;
  position: relative;
`;

export const PlaceholderText = styled(RNText)`
  position: absolute;
  left: 18px;
  top: 18px;
  color: #638773;
  font-size: 18px;
  z-index: 1;
`;

export const PlainTextInput = styled.TextInput`
  border-width: 0px;
  background-color: transparent;
  color: ${Colors.light.text};
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 18px;
  padding-bottom: 18px;
  font-size: 18px;
`;

export const ButtonContainer = styled.View`
  margin-bottom: 20px;
`;

export const BottomLinkWrapper = styled(View)`
  margin-bottom: 20px;
`;

export const BottomLinkText = styled(RNText)`
  color: #638773;
  font-size: 16px;
  text-align: center;
`;

export const ErrorContainer = styled.View`
  background-color: #ffebee;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

export const ErrorText = styled.Text`
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
`;
