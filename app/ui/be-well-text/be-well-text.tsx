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
  textCenter?: boolean;
  children?: React.ReactNode;
  themeMode?: "light" | "dark";
}

const getTextStyle = (variant: BeWellTextVariant) => {
  switch (variant) {
    case BeWellTextVariant.Headline1:
      return { fontSize: 36, fontWeight: "700" };
    case BeWellTextVariant.Headline2:
      return { fontSize: 32, fontWeight: "700" };
    case BeWellTextVariant.Headline3:
      return { fontSize: 28, fontWeight: "700" };
    case BeWellTextVariant.Headline4:
      return { fontSize: 24, fontWeight: "700" };
    case BeWellTextVariant.Headline5:
      return { fontSize: 22, fontWeight: "700" };
    case BeWellTextVariant.Headline6:
      return { fontSize: 20, fontWeight: "700" };
    case BeWellTextVariant.TextMedium:
      return { fontSize: 16, fontWeight: "400" };
    case BeWellTextVariant.TextMediumBold:
      return { fontSize: 16, fontWeight: "700" };
    case BeWellTextVariant.TextSmall:
      return { fontSize: 14, fontWeight: "400" };
    case BeWellTextVariant.TextSmallBold:
      return { fontSize: 14, fontWeight: "700" };
    case BeWellTextVariant.TextXSmall:
      return { fontSize: 12, fontWeight: "400" };
    case BeWellTextVariant.TextXSmallBold:
      return { fontSize: 12, fontWeight: "700" };
    case BeWellTextVariant.Numbers:
      return { fontSize: 44, fontWeight: "400" };
    default:
      return { fontSize: 16, fontWeight: "400" };
  }
};

export const BeWellText: React.FC<BeWellTextStyleProps & TextProps> = ({
  children,
  variant = BeWellTextVariant.TextMedium,
  color,
  textCenter,
  style,
  themeMode = "light",
  ...props
}) => {
  return (
    <StyledText
      variant={variant}
      color={color}
      themeMode={themeMode}
      textCenter={textCenter}
      style={style}
      {...props}
    >
      {children}
    </StyledText>
  );
};

const StyledText = styled.Text<BeWellTextStyleProps>`
  color: ${({ color, themeMode }) =>
    color || (themeMode === "light" ? theme.light.text : theme.dark.text)};
  ${({ variant = BeWellTextVariant.TextMedium, textCenter }) => {
    const style = getTextStyle(variant);
    return `
      font-size: ${style.fontSize}px;
      font-weight: ${style.fontWeight};
      text-align: ${textCenter ? "center" : "left"};    
    `;
  }}
`;
