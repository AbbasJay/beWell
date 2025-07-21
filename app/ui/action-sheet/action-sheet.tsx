import React, { useEffect, useRef } from "react";
import { Modal, TouchableOpacity, Animated, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as CSS from "./styles";

interface ActionSheetOption {
  title: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  options: ActionSheetOption[];
  title?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  options,
  title,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim]);

  const handleOptionPress = (option: ActionSheetOption) => {
    onClose();
    option.onPress();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <CSS.Overlay>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={handleClose}
        />
        <CSS.ActionSheetContainer
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <CSS.DragHandle />
          {title && (
            <CSS.TitleContainer>
              <CSS.Title>{title}</CSS.Title>
            </CSS.TitleContainer>
          )}
          <CSS.OptionsContainer>
            {options.map((option, index) => (
              <CSS.OptionButton
                key={option.title}
                isLast={index === options.length - 1}
                onPress={() => handleOptionPress(option)}
              >
                <CSS.OptionIcon>
                  <MaterialIcons
                    name={option.icon as any}
                    size={24}
                    color={option.destructive ? "#ef4444" : "#6b7280"}
                  />
                </CSS.OptionIcon>
                <CSS.OptionText destructive={option.destructive}>
                  {option.title}
                </CSS.OptionText>
              </CSS.OptionButton>
            ))}
          </CSS.OptionsContainer>
          <CSS.CancelButton onPress={handleClose}>
            <CSS.OptionIcon>
              <MaterialIcons name="close" size={24} color="#ef4444" />
            </CSS.OptionIcon>
            <CSS.CancelText>Cancel</CSS.CancelText>
          </CSS.CancelButton>
        </CSS.ActionSheetContainer>
      </CSS.Overlay>
    </Modal>
  );
};
