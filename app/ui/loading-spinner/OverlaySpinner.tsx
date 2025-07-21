import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { styles } from "./styles";

interface OverlaySpinnerProps {
  visible?: boolean;
}

export default function OverlaySpinner({
  visible = true,
}: OverlaySpinnerProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <LottieView
        source={require("../../animations/lottie-loader.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}
