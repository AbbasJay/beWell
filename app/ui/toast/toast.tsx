import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { BeWellText, BeWellTextVariant } from "../be-well-text/be-well-text";
import * as CSS from "./styles";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = "success",
  onHide,
  duration = 2000,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;
  const hideTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible) {
      // Clear any existing timeout
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      // Show animation
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
      ]).start();

      // Hide after duration
      hideTimeout.current = setTimeout(() => {
        Animated.parallel([
          Animated.spring(opacity, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }),
          Animated.spring(translateY, {
            toValue: -100,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }),
        ]).start(() => {
          onHide();
        });
      }, duration);

      return () => {
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
        }
      };
    } else {
      // Reset values when not visible
      opacity.setValue(0);
      translateY.setValue(-100);
    }
  }, [visible, duration, opacity, translateY]);

  if (!visible) return null;

  const getIconName = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "check-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return theme.status.success;
      case "error":
        return theme.status.error;
      case "warning":
        return theme.status.warning;
      default:
        return theme.status.success;
    }
  };

  const AnimatedContainer = Animated.createAnimatedComponent(CSS.Container);

  return (
    <AnimatedContainer
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <MaterialIcons name={getIconName()} size={24} color={getIconColor()} />
      <BeWellText
        variant={BeWellTextVariant.TextMedium}
        style={{ marginLeft: 12, flex: 1 }}
      >
        {message}
      </BeWellText>
    </AnimatedContainer>
  );
};
