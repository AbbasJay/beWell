import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface SearchBarProps {
  updateLocation?: (lat: number, lng: number) => void;
}

const AddressSearchBar: React.FC<SearchBarProps> = ({ updateLocation }) => {
  const [search, setSearch] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>("Search");

  // Default updateLocation function if none provided
  const safeUpdateLocation =
    updateLocation ||
    ((lat: number, lng: number) => {
      console.log("Location update called with:", lat, lng);
    });

  const handleFocus = () => {
    setIsFocused(true);
    setPlaceholder("Search");
  };

  const handleFallbackSearch = () => {
    // For fallback, just update to a default location (London)
    safeUpdateLocation(51.5074, -0.1278);
    setPlaceholder("London (default)");
    setSearch("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.fallbackContainer}>
      <TextInput
        style={styles.fallbackInput}
        placeholder="Search (using default location)"
        value={search}
        onChangeText={setSearch}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity
        style={styles.fallbackButton}
        onPress={handleFallbackSearch}
      >
        <Text style={styles.fallbackButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  fallbackInput: {
    flex: 1,
    height: 38,
    color: "#5d5d5d",
    fontSize: 16,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  fallbackButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fallbackButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AddressSearchBar;
