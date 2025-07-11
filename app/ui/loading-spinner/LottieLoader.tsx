import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { styles } from "./styles";

export default function LottieLoader({ style }: { style?: object }) {
  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={require("../../animations/lottie-loader.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}
