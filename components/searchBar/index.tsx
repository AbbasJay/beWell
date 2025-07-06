import React, { useState } from "react";
import { Keyboard, TextInput, TouchableOpacity } from "react-native";
import {
  FallbackContainer,
  FallbackInput,
  FallbackButton,
  FallbackButtonText,
} from "./styles";

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
    <FallbackContainer>
      <FallbackInput
        placeholder="Search (using default location)"
        value={search}
        onChangeText={setSearch}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
      />
      <FallbackButton onPress={handleFallbackSearch}>
        <FallbackButtonText>Search</FallbackButtonText>
      </FallbackButton>
    </FallbackContainer>
  );
};

export default AddressSearchBar;
