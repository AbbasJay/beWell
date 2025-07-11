import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

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

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  lottie: {
    width: 250,
    height: 250,
  },
});
