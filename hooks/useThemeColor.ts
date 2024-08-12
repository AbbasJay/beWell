/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useTheme } from "./themeContext";

export function useThemeColor() {
  const { theme } = useTheme();
  return Colors[theme];
}
