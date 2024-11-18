import React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Platform, StatusBar, View, ScrollView } from "react-native";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  style?: any;
  hasNavigationBar?: boolean;
  fixedPaddingTop?: boolean;
  scrollViewContentContainerStyle?: any;
  useScrollView?: boolean;
}

const StyledSafeAreaView = styled(SafeAreaView)<{
  fixedPaddingTop?: boolean;
}>`
  flex: 1;
  background-color: ${Colors.light.secondary};
  padding-horizontal: 12px;
  padding-top: ${({ fixedPaddingTop }) => (fixedPaddingTop ? "12px" : "0px")};
`;

export const BeWellBackground: React.FC<BeWellBackgroundProps> = ({
  children,
  style,
  hasNavigationBar = false,
  fixedPaddingTop = false,
  scrollViewContentContainerStyle,
  useScrollView = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <StyledSafeAreaView style={style} fixedPaddingTop={fixedPaddingTop}>
      {useScrollView ? (
        <ScrollView contentContainerStyle={scrollViewContentContainerStyle}>
          {children}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            paddingTop: hasNavigationBar ? insets.top : 0,
          }}
        >
          {children}
        </View>
      )}
    </StyledSafeAreaView>
  );
};
