import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as CSS from "./styles";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  style?: any;
  hasNavigationBar?: boolean;
  fixedPaddingTop?: boolean;
  scrollViewContentContainerStyle?: any;
  useScrollView?: boolean;
}

export const BeWellBackground: React.FC<BeWellBackgroundProps> = ({
  children,
  style,
  hasNavigationBar = false,
  fixedPaddingTop = false,
  scrollViewContentContainerStyle,
  useScrollView = false,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    paddingTop: fixedPaddingTop ? insets.top : 0,
    paddingBottom: hasNavigationBar ? insets.bottom : 0,
    ...style,
  };

  return (
    <CSS.StyledSafeAreaView style={containerStyle}>
      {useScrollView ? (
        <CSS.StyledScrollView
          contentContainerStyle={{
            ...scrollViewContentContainerStyle,
          }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </CSS.StyledScrollView>
      ) : (
        <CSS.StyledView
          hasNavigationBar={hasNavigationBar}
          topInset={insets.top}
        >
          {children}
        </CSS.StyledView>
      )}
    </CSS.StyledSafeAreaView>
  );
};
