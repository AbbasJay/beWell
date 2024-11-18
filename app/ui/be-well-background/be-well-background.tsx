import * as CSS from "./styles";
import { Colors } from "@/constants/Colors";

interface BeWellBackgroundProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const BeWellBackground = ({
  children,
  scrollable = false,
}: BeWellBackgroundProps) => {
  return <CSS.StyledSafeAreaView>{children}</CSS.StyledSafeAreaView>;
};
