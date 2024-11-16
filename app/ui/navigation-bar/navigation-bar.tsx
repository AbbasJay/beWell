import React, { useCallback } from "react";
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
  left?: NavigationItem;
  right?: NavigationItem;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  subtitle,
  left,
  right,
}) => {
  const navigation = useNavigation();

  const renderItem = useCallback(
    (item?: NavigationItem, isRight = false) => {
      if (!item) return null;

      const handlePress = () => {
        if (item.onPress) {
          item.onPress();
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        }
      };

      const ItemComponent = isRight ? CSS.RightItem : CSS.LeftItem;
      const TextComponent = isRight ? CSS.RightItemText : CSS.LeftItemText;

      return (
        <ItemComponent key={item.label} onPress={handlePress}>
          {item.icon}
          {item.label && <TextComponent>{item.label}</TextComponent>}
        </ItemComponent>
      );
    },
    [navigation]
  );

  return (
    <CSS.Container>
      <CSS.LeftContainer>{left && renderItem(left, false)}</CSS.LeftContainer>

      <CSS.TitleContainer>
        {title && <CSS.Title numberOfLines={1}>{title}</CSS.Title>}
        {subtitle && <CSS.Subtitle numberOfLines={1}>{subtitle}</CSS.Subtitle>}
      </CSS.TitleContainer>

      <CSS.RightContainer>
        {right && renderItem(right, true)}
      </CSS.RightContainer>
    </CSS.Container>
  );
};
