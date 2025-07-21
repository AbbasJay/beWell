import { styled } from "styled-components/native";
import { Animated, Dimensions } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

export const ActionSheetContainer = styled(Animated.View)`
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-bottom: 20px;
  max-height: ${screenHeight * 0.6}px;
  width: 100%;
`;

export const DragHandle = styled.View`
  width: 36px;
  height: 4px;
  background-color: #d1d5db;
  border-radius: 2px;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const TitleContainer = styled.View`
  padding: 16px 20px 8px 20px;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  text-align: center;
`;

export const OptionsContainer = styled.View`
  padding: 12px 0;
`;

export const OptionButton = styled.TouchableOpacity<{ isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  background-color: white;
  margin-horizontal: 12px;
  margin-bottom: ${(props) => (props.isLast ? "0" : "8")}px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
`;

export const OptionIcon = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const OptionText = styled.Text<{ destructive?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.destructive ? "#ef4444" : "#111827")};
  flex: 1;
`;

export const CancelButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  background-color: white;
  margin: 12px;
  margin-top: 8px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
`;

export const CancelText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ef4444;
  flex: 1;
  text-align: center;
`;
