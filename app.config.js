// app.config.js
import "dotenv/config";

export default {
  expo: {
    name: "be-well",
    slug: "be-well",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
    },
    plugins: ["expo-router", "expo-secure-store"],
    experiments: {
      typedRoutes: true,
    },
  },
};
