import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Touchable,
  Animated,
  Easing,
} from "react-native";
import { Business, useBusinessContext } from "./contexts/BusinessContext";
import { router } from "expo-router";
import Map from "../components/map";
import { BusinessCard } from "./ui/business-card/business-card";
import Slider from "@react-native-community/slider";
import { Chip } from "react-native-paper";

import {
  Container,
  FlatListContainer,
  FullWidthContainer,
  ScrollSeparator,
} from "./homeStyles";

import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { HeaderText } from "./homeStyles";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "./ui/button/button";

const { width: viewportWidth } = Dimensions.get("window");

export default function HomePage() {
  const { businesses } = useBusinessContext();
  const [isMapView, setIsMapView] = useState(false);

  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;

  const [rating, setRating] = useState(0);
  const [distance, setDistance] = useState(1);
  const categories = ["gym", "classes"];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 600], // 0 = fully visible, 600 = off-screen
  });

  const toggleListView = () => {
    setIsMapView(!isMapView);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuVisible(!isFilterMenuVisible);
  };

  //use effect here to trigger the animation
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFilterMenuVisible ? 0 : 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isFilterMenuVisible, animatedValue]);

  const renderItem = ({ item }: { item: Business }) => {
    const businessId = item.id ?? 0;

    return (
      <BusinessCard
        item={{
          ...item,
          name: item.name,
          address: item.address,
          phoneNumber: item.phoneNumber,
          description: "",
        }}
        onPress={() => router.push(`/business/${businessId}/classes`)}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
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

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Min Rating {rating}/5</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={5}
            step={1}
            value={rating}
            onValueChange={(value) => setRating(value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
          <Text>Max Distance {distance} km</Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={distance}
            onValueChange={(value) => setDistance(value)}
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
                selected={selectedCategories.includes(category)}
                onPress={() => {
                  setSelectedCategories((prev) =>
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
              onPress={toggleFilterMenu}
            />
          </View>
        </View>
      </Animated.View>

      {isMapView ? (
        <Map
          businesses={businesses}
          toggleListView={toggleListView}
          toggleFilterMenu={toggleFilterMenu}
          filterMenuVisible={isFilterMenuVisible}
        />
      ) : (
        <>
          <BeWellBackground scrollable>
            <FullWidthContainer>
              <HeaderText style={{ marginLeft: 12 }}>
                Studios Near You
              </HeaderText>
              <FlatListContainer
                style={{
                  marginBottom: 12,
                }}
              >
                <FlatList
                  data={businesses}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id?.toString() || ""}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  snapToInterval={viewportWidth - 30}
                  contentContainerStyle={Platform.select({
                    android: { paddingHorizontal: 12 },
                  })}
                  contentInset={Platform.select({
                    ios: { left: 12, right: 12 },
                  })}
                  contentOffset={Platform.select({
                    ios: { x: -12, y: 0 },
                  })}
                  ItemSeparatorComponent={() => <ScrollSeparator />}
                />
              </FlatListContainer>
              <HeaderText style={{ marginLeft: 12 }}>Trending Now</HeaderText>
              <FlatListContainer
                style={{
                  marginBottom: 12,
                }}
              >
                <FlatList
                  data={businesses}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id?.toString() || ""}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  snapToInterval={viewportWidth - 30}
                  contentContainerStyle={Platform.select({
                    android: { paddingHorizontal: 12 },
                  })}
                  contentInset={Platform.select({
                    ios: { left: 12, right: 12 },
                  })}
                  contentOffset={Platform.select({
                    ios: { x: -12, y: 0 },
                  })}
                  ItemSeparatorComponent={() => <ScrollSeparator />}
                />
              </FlatListContainer>
              <HeaderText style={{ marginLeft: 12 }}>New Studios</HeaderText>
              <FlatListContainer
                style={{
                  marginBottom: 12,
                }}
              >
                <FlatList
                  data={businesses}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id?.toString() || ""}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  snapToInterval={viewportWidth - 30}
                  contentContainerStyle={Platform.select({
                    android: { paddingHorizontal: 12 },
                  })}
                  contentInset={Platform.select({
                    ios: { left: 12, right: 12 },
                  })}
                  contentOffset={Platform.select({
                    ios: { x: -12, y: 0 },
                  })}
                  ItemSeparatorComponent={() => <ScrollSeparator />}
                />
              </FlatListContainer>
            </FullWidthContainer>
          </BeWellBackground>
          {!isMapView && (
            <View
              style={{
                position: "absolute",
                bottom: 40,
                right: 20,
                gap: 10,
                zIndex: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: "lightgrey",
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
                <MaterialIcons name="filter-alt" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: "lightgrey",
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
                onPress={toggleListView}
              >
                <MaterialIcons name="map" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
