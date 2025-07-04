import { Business } from "@/app/contexts/BusinessContext";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Skeleton } from "react-native-skeletons";

type BusinessCardProps = {
  item: Business;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  height?: string;
  isLoading?: boolean;
  distance?: number;
};

export const BusinessCard = ({
  item,
  onPress,
  width = 160,
  height,
  disabled,
  isLoading = false,
  distance,
}: BusinessCardProps) => {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <Skeleton height={160} width={160} style={styles.image} />
        <View style={styles.info}>
          <Skeleton height={16} width="60%" style={{ marginBottom: 4 }} />
          <Skeleton height={14} width="80%" />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={disabled}>
      <Image
        source={
          item.photo
            ? { uri: item.photo }
            : require("@/assets/images/home-gym.webp")
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>
          {distance
            ? `${distance.toFixed(1)} km away`
            : item.type || "Fitness Studio"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 16,
    width: 160,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
  info: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#121714",
  },
  description: {
    fontSize: 14,
    color: "#688273",
  },
});
