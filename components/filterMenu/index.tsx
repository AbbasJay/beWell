import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated, Easing, TouchableOpacity } from "react-native";
import { Chip } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../app/ui/button/button";

type FilterMenuProps = {
  isVisible: boolean;
  toggleFilterMenu: () => void;
  distance: number;
  rating: number;
  selectedCategories: string[];
  applyFilters: (
    filterDistance: number,
    rating: number,
    filterCategories: string[]
  ) => void;
};

const FilterMenu: React.FC<FilterMenuProps> = ({
  isVisible,
  toggleFilterMenu,
  distance,
  rating,
  selectedCategories,
  applyFilters,
}) => {
  const categories = ["gym", "classes"];

  const animatedValue = useRef(new Animated.Value(1)).current;
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 600], // 0 = fully visible, 600 = off-screen
  });

  const [filterRating, setFilterRating] = useState<number>(rating);
  const [filterDistance, setFilterDistance] = useState<number>(distance);
  const [filterCategories, setFilterCategories] =
    useState<string[]>(selectedCategories);

  // Sync local state with parent state when props change
  useEffect(() => {
    setFilterRating(rating);
  }, [rating]);

  useEffect(() => {
    setFilterDistance(distance);
  }, [distance]);

  useEffect(() => {
    setFilterCategories(selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisible ? 0 : 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isVisible, animatedValue]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        transform: [{ translateY }],
        bottom: 0,
        zIndex: 15,
        width: "100%",
        height: "75%",
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}
    >
      <TouchableOpacity
        style={{
          alignSelf: "flex-start",
          padding: 20,
          borderRadius: 5,
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: {
            width: 1,
            height: 10,
          },
        }}
        onPress={toggleFilterMenu}
      >
        <MaterialIcons name="clear" size={24} color="black" />
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Min Rating {filterRating}/5</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={5}
          step={1}
          value={filterRating}
          onValueChange={(value) => setFilterRating(value)}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
        />
        <Text>Max Distance {filterDistance} km</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={1}
          maximumValue={200}
          step={1}
          value={filterDistance}
          onValueChange={(value) => setFilterDistance(value)}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
        ></Slider>
        <Text>Type</Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            padding: 10,
          }}
        >
          {categories.map((category) => (
            <Chip
              style={{ margin: 5 }}
              key={category}
              selected={filterCategories.includes(category)}
              onPress={() => {
                setFilterCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((item) => item !== category)
                    : [...prev, category]
                );
              }}
            >
              {category}
            </Chip>
          ))}
        </View>
        <View style={{ top: 10 }}>
          <Button
            fullWidth
            variant="secondary"
            title="Apply Filters"
            onPress={() => {
              applyFilters(filterDistance, filterRating, filterCategories);
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default FilterMenu;
