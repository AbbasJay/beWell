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

    const renderItem = (item?: NavigationItem, isRight = false) => {
        if (!item) return null;
    
        const handlePress = () => {
            if (item.onPress) {
                item.onPress();
            } else if (navigation.canGoBack()) {
                navigation.goBack();
            }
        };
        
        return isRight ? (
            <CSS.RightItem key={item.label} onPress={handlePress}>
                {item.icon}
                {item.label && <CSS.RightItemText>{item.label}</CSS.RightItemText>}
            </CSS.RightItem>
        ) : (
            <CSS.LeftItem key={item.label} onPress={handlePress}>
                {item.icon}
                {item.label && <CSS.LeftItemText>{item.label}</CSS.LeftItemText>}
            </CSS.LeftItem>
        );
    };

    return (
        <CSS.Container>
            <CSS.LeftContainer>
                {left?.map((item) => renderItem(item, false))}
            </CSS.LeftContainer>

            <CSS.TitleContainer>
                <CSS.Title>{title}</CSS.Title>
                <CSS.Subtitle>{subtitle}</CSS.Subtitle>
            </CSS.TitleContainer>

            <CSS.RightContainer>
                {right?.map((item) => renderItem(item, true))}
            </CSS.RightContainer>
        </CSS.Container>
    );
};
