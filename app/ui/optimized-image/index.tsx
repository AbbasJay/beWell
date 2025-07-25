import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Image, ImageContentFit } from "expo-image";
import { Skeleton } from "react-native-skeletons";
import { MaterialIcons } from "@expo/vector-icons";

interface OptimizedImageProps {
  source: string | null;
  width: number;
  height: number;
  borderRadius?: number;
  placeholder?: any;
  onLoad?: () => void;
  onError?: () => void;
  style?: any;
  resizeMode?: ImageContentFit;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  width,
  height,
  borderRadius = 12,
  placeholder,
  onLoad,
  onError,
  style,
  resizeMode = "cover",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultPlaceholder = placeholder || require("@/assets/images/home-gym.webp");

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const imageSource = source ? { uri: source } : defaultPlaceholder;

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      {/* Loading Skeleton with Shimmer Effect */}
      {isLoading && source && (
        <View
          style={[styles.skeletonContainer, { width, height, borderRadius }]}
        >
          <Skeleton 
            height={height} 
            width={width} 
            style={{ borderRadius }}
            color="#e0e0e0"
          />
        </View>
      )}

      {/* Error State */}
      {hasError && (
        <View style={[styles.errorContainer, { width, height, borderRadius }]}>
          <MaterialIcons name="broken-image" size={24} color="#ccc" />
        </View>
      )}

      {/* Optimized Image */}
      <Image
        source={imageSource}
        style={[
          styles.image,
          {
            width,
            height,
            borderRadius,
            opacity: isLoading && source ? 0 : 1,
          },
        ]}
        contentFit={resizeMode}
        transition={200}
        onLoad={handleLoad}
        onError={handleError}
        cachePolicy="memory-disk"
        priority="normal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  skeletonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});
