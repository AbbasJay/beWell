import React from "react";
import styled from "styled-components/native";
import { TextProps, TextStyle } from "react-native";
import { theme } from "../../../constants/theme";

export enum BeWellTextVariant {
  Headline1 = "headline1",
  Headline2 = "headline2",
  Headline3 = "headline3",
  Headline4 = "headline4",
  Headline5 = "headline5",
  Headline6 = "headline6",
  TextMedium = "TextMedium",
  TextMediumBold = "TextMediumBold",
  TextSmall = "TextSmall",
  TextSmallBold = "TextSmallBold",
  TextXSmall = "textXSmall",
  TextXSmallBold = "textXSmallBold",
  Numbers = "numbers",
}

interface BeWellTextStyleProps {
  variant?: BeWellTextVariant;
  color?: string;
  style?: TextStyle;
  children?: React.ReactNode;
}

const getTextStyle = (variant: BeWellTextVariant) => {
  switch (variant) {
    case BeWellTextVariant.Headline1:
      return { fontSize: 36, fontFamily: "" };
    case BeWellTextVariant.Headline2:
      return { fontSize: 32, fontFamily: "" };
    case BeWellTextVariant.Headline3:
      return { fontSize: 28, fontFamily: "" };
    case BeWellTextVariant.Headline4:
      return { fontSize: 24, fontFamily: "" };
    case BeWellTextVariant.Headline5:
      return { fontSize: 22, fontFamily: "" };
    case BeWellTextVariant.Headline6:
      return { fontSize: 20, fontFamily: "" };
    case BeWellTextVariant.TextMedium:
      return { fontSize: 16, fontFamily: "" };
    case BeWellTextVariant.TextMediumBold:
      return { fontSize: 16, fontFamily: "" };
    case BeWellTextVariant.TextSmall:
      return { fontSize: 14, fontFamily: "" };
    case BeWellTextVariant.TextSmallBold:
      return { fontSize: 14, fontFamily: "" };
    case BeWellTextVariant.TextXSmall:
      return { fontSize: 12, fontFamily: "" };
    case BeWellTextVariant.TextXSmallBold:
      return { fontSize: 12, fontFamily: "" };
    case BeWellTextVariant.Numbers:
      return { fontSize: 44, fontFamily: "" };
    default:
      return { fontSize: 16, fontFamily: "" };
  }
};

const StyledText = styled.Text<BeWellTextStyleProps>`
  color: ${({ color, theme }) => color || theme.text || "#FFFFFF"};
  ${({ variant = BeWellTextVariant.TextMedium }) => {
    const style = getTextStyle(variant);
    return `
      font-size: ${style.fontSize}px;
      font-family: ${style.fontFamily};
    `;
  }}
`;

export const BeWellText: React.FC<BeWellTextStyleProps & TextProps> = ({
  children,
  variant = BeWellTextVariant.TextMedium,
  color,
  style,
  ...props
}) => {
  return (
    <StyledText
      variant={variant}
      color={color}
      theme={theme}
      style={style}
      {...props}
    >
      {children}
    </StyledText>
  );
};
