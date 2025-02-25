import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  Dimensions,
  FlatList,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

import FilterMenu from "@/components/filterMenu";
import Map from "../components/map";
import { BusinessCard } from "./ui/business-card/business-card";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { HeaderText } from "./homeStyles";
import { LoadingSpinner } from "./ui/loading-spinner";
import { ErrorMessage } from "./ui/error-message";
import {
  Business,
  useBusinessContext,
  useFilterBusinessContext,
} from "./contexts/BusinessContext";
import {
  FlatListContainer,
  FullWidthContainer,
  ScrollSeparator,
  SearchBarContainer,
} from "./homeStyles";

import Constants from "expo-constants";
import SearchBar from "@/components/searchBar";

const { width: viewportWidth } = Dimensions.get("window");

const INITIAL_REGION = {
  //london
  lat: 51.5176,
  lng: 0.1145,
};

const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? Constants.expoConfig?.ios?.config?.googleMapsApiKey || ""
    : Platform.OS === "android"
    ? Constants.expoConfig?.android?.config?.googleMaps?.apiKey || ""
    : "";

const FILTER_STORAGE_KEY = "@be_well_filters";

export default function HomePage() {
  const { businesses, error: businessError } = useBusinessContext();
  const { updateFilters } = useFilterBusinessContext();
  const [isLoading, setIsLoading] = useState(true);
  const [locationSetupError, setLocationSetupError] = useState<Error | null>(
    null
  );
  const [isMapView, setIsMapView] = useState(false);
  const [location, setLocation] = useState(INITIAL_REGION);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const [rating, setRating] = useState(1);
  const [distance, setDistance] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "gym",
  ]);

  useEffect(() => {
    const initialiseHomeScreen = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        let initial_location = INITIAL_REGION;

        if (status == "granted") {
          const loc = await Location.getCurrentPositionAsync({});

          const { latitude, longitude } = loc.coords;

          const user_location = {
            lat: latitude,
            lng: longitude,
          };

          setLocation(user_location);
          initial_location = user_location;
        } else {
          setLocation(INITIAL_REGION);
        }

        const savedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
        if (savedFilters) {
          const {
            rating: savedRating,
            distance: savedDistance,
            categories: savedCategories,
          } = JSON.parse(savedFilters);
          setRating(savedRating);
          setDistance(savedDistance);
          setSelectedCategories(savedCategories);

          await updateFilters(
            savedDistance * 1000,
            { lat: initial_location.lat, lng: initial_location.lng },
            savedRating,
            savedCategories
          );
        } else {
          await updateFilters(
            distance * 1000,
            { lat: initial_location.lat, lng: initial_location.lng },
            rating,
            selectedCategories
          );
        }
      } catch (error) {
        console.error("Error loading home screen:", error);
        setLocationSetupError(
          error instanceof Error
            ? error
            : new Error("Failed to initialise location and filters")
        );
      } finally {
        setIsLoading(false);
      }
    };

    initialiseHomeScreen();
  }, []);

  const saveFilters = async () => {
    try {
      const filtersToSave = {
        rating,
        distance,
        categories: selectedCategories,
      };
      await AsyncStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify(filtersToSave)
      );
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  };

  const toggleListView = () => {
    setIsMapView(!isMapView);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuVisible(!isFilterMenuVisible);
  };

  const applyFilters = (
    filterDistance: number,
    filterRating: number,
    filterCategories: string[]
  ) => {
    updateFilters(
      filterDistance * 1000,
      { lat: location.lat, lng: location.lng },
      filterRating,
      filterCategories
    );

    console.log("selectedCategories", selectedCategories);

    setIsFilterMenuVisible(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status == "granted") {
        const loc = await Location.getCurrentPositionAsync({});

        const { latitude, longitude } = loc.coords;

        const user_location = {
          lat: latitude,
          lng: longitude,
        };

        setLocation(user_location);
      } else {
        setLocation(INITIAL_REGION);
      }
    })();
  }, []);

  useEffect(() => {
    updateFilters(
      distance * 1000,
      { lat: location.lat, lng: location.lng },
      rating,
      selectedCategories
    );
    console.log("updating filters");
  }, [distance, location, rating, selectedCategories]);

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
        onPress={() =>
          router.push({
            pathname: "/business/[id]/classes",
            params: { id: businessId },
          })
        }
      />
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (locationSetupError) return <ErrorMessage error={locationSetupError} />;
  if (businessError) return <ErrorMessage error={businessError} />;

  return (
    <View style={{ flex: 1 }}>
      <SearchBarContainer>
        <SearchBar
          updateLocation={(lat: number, lng: number) =>
            setLocation({ lat: lat, lng: lng })
          }
        />
      </SearchBarContainer>

      <FilterMenu
        rating={rating}
        isVisible={isFilterMenuVisible}
        toggleFilterMenu={toggleFilterMenu}
        setRating={setRating}
        distance={distance}
        setDistance={setDistance}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        applyFilters={applyFilters}
      />
      {isMapView ? (
        <Map
          businesses={businesses}
          toggleListView={toggleListView}
          toggleFilterMenu={toggleFilterMenu}
          location={location}
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
