import React from "react";
import * as CSS from "./styles";
import { useNavigation } from "@react-navigation/native";

interface NavigationItem {
    label?: string;
    icon?: React.ReactNode;
    onPress?: () => void;
}

interface NavigationBarProps {
  title?: string;
  subtitle?: string;
  left?: NavigationItem[];
  right?: NavigationItem[];
}


export const NavigationBar = ({ title, subtitle, left, right }: NavigationBarProps) => {
const navigation = useNavigation();

return (
    <CSS.Container>

        <CSS.LeftContainer>
                {left?.map((item) => (
                    <CSS.LeftItem key={item.label} onPress={item.onPress}>
                        {item.icon}
                        {item.label && <CSS.LeftItemText>{item.label}</CSS.LeftItemText>}
                </CSS.LeftItem>
            ))}
        </CSS.LeftContainer>

        <CSS.TitleContainer>
            <CSS.Title>{title}</CSS.Title>
            <CSS.Subtitle>{subtitle}</CSS.Subtitle>
        </CSS.TitleContainer>

        <CSS.RightContainer>
            {right?.map((item) => (
                <CSS.RightItem key={item.label} onPress={item.onPress}>
                    {item.icon}
                    {item.label && <CSS.RightItemText>{item.label}</CSS.RightItemText>}
                </CSS.RightItem>
            ))}
        </CSS.RightContainer>

    </CSS.Container>
)
}
