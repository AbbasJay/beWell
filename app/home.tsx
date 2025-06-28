import React, { useState, useRef, useEffect, useMemo } from "react";
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
import { useAuth } from "./contexts/auth/AuthContext";
import {
  FlatListContainer,
  FullWidthContainer,
  ScrollSeparator,
  SearchBarContainer,
} from "./homeStyles";

import Constants from "expo-constants";
import SearchBar from "@/components/searchBar";
import { calculate_distance } from "./utils/helper-functions/haversine-distance";

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
  const {
    businesses,
    error: businessError,
    forceRefresh,
  } = useBusinessContext();
  const {
    updateFilters,
    getCurrentFilters,
    endInitialization,
    setHomeInitialized,
    getHomeInitialized,
    resetHomeInitialization,
  } = useFilterBusinessContext();
  const {
    user,
    isGuestMode,
    isLoading: authLoading,
    continueAsGuest,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [locationSetupError, setLocationSetupError] = useState<Error | null>(
    null
  );
  const [isMapView, setIsMapView] = useState(false);
  const [location, setLocation] = useState(INITIAL_REGION);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);

  // Get current filter values from context
  const currentFilters = getCurrentFilters();
  const rating = useMemo(
    () => Number(currentFilters.minRating),
    [currentFilters.minRating]
  );
  const distance = useMemo(
    () => Number(currentFilters.distance) / 1000,
    [currentFilters.distance]
  ); // Convert from meters to km
  const selectedCategories = useMemo(
    () => currentFilters.serviceTypes as string[],
    [currentFilters.serviceTypes]
  );

  // Get initialization state from context
  const isInitialized = getHomeInitialized();

  useEffect(() => {
    const initialiseHomeScreen = async () => {
      // Skip initialization if already done
      if (isInitialized) {
        setIsLoading(false);
        return;
      }

      // Skip if not authenticated or in guest mode
      if (!user && !isGuestMode) {
        setIsLoading(false);
        return;
      }

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

        // Only fetch businesses if user is authenticated
        if (user || isGuestMode) {
          const savedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
          if (savedFilters) {
            const {
              rating: savedRating,
              distance: savedDistance,
              categories: savedCategories,
            } = JSON.parse(savedFilters);

            await updateFilters(
              savedDistance * 1000,
              { lat: initial_location.lat, lng: initial_location.lng },
              savedRating,
              savedCategories,
              true // skipFetch during initialization
            );
          } else {
            await updateFilters(
              5000, // 5km default
              { lat: initial_location.lat, lng: initial_location.lng },
              1, // default rating
              ["gym", "classes"], // default categories
              true // skipFetch during initialization
            );
          }
        }

        setHomeInitialized(true);

        // End initialization to trigger first business fetch
        endInitialization();
      } catch (error) {
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
  }, [isInitialized]);

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

  const handleRefresh = async () => {
    try {
      await forceRefresh();
    } catch (error) {
      console.error("Error refreshing businesses:", error);
    }
  };

  const applyFilters = async (
    filterDistance: number,
    filterRating: number,
    filterCategories: string[]
  ) => {
    // Update filters in context
    updateFilters(
      filterDistance * 1000,
      { lat: location.lat, lng: location.lng },
      filterRating,
      filterCategories,
      false // don't skip fetch for user-initiated filter changes
    );

    // Save filters to AsyncStorage
    try {
      const filtersToSave = {
        rating: filterRating,
        distance: filterDistance,
        categories: filterCategories,
      };
      await AsyncStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify(filtersToSave)
      );
    } catch (error) {
      console.error("Error saving filters:", error);
    }

    setIsFilterMenuVisible(false);
  };

  const renderItem = ({ item }: { item: Business }) => {
    const businessId = item.id ?? 0;

    const distance =
      calculate_distance(
        location.lat,
        location.lng,
        item.latitude!,
        item.longitude!
      ) / 1000;

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
        distance={distance}
      />
    );
  };

  if (authLoading || isLoading) return <LoadingSpinner />;
  if (locationSetupError) return <ErrorMessage error={locationSetupError} />;
  if (businessError) return <ErrorMessage error={businessError} />;

  // Show login prompt if not authenticated
  if (!user && !isGuestMode) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <HeaderText>Welcome to Be Well</HeaderText>
        <TouchableOpacity
          style={{
            backgroundColor: "#007AFF",
            padding: 15,
            borderRadius: 8,
            marginTop: 20,
          }}
          onPress={() => router.push("/logIn")}
        >
          <HeaderText style={{ color: "white" }}>Sign In</HeaderText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            padding: 15,
            borderRadius: 8,
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#007AFF",
          }}
          onPress={() => router.push("/signUp")}
        >
          <HeaderText style={{ color: "#007AFF" }}>Sign Up</HeaderText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            padding: 15,
            borderRadius: 8,
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#28a745",
          }}
          onPress={continueAsGuest}
        >
          <HeaderText style={{ color: "#28a745" }}>
            Continue as Guest
          </HeaderText>
        </TouchableOpacity>
      </View>
    );
  }

  // Ensure businesses is an array to prevent filter errors
  const safeBusinesses = businesses || [];

  // Show message when no businesses are available
  const renderNoBusinessesMessage = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <HeaderText style={{ textAlign: "center", marginBottom: 20 }}>
        "No businesses found in your area"
      </HeaderText>
    </View>
  );

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
        distance={distance}
        selectedCategories={selectedCategories}
        applyFilters={applyFilters}
      />
      {isMapView ? (
        <Map
          businesses={safeBusinesses}
          toggleListView={toggleListView}
          toggleFilterMenu={toggleFilterMenu}
          location={location}
        />
      ) : (
        <>
          <BeWellBackground scrollable>
            <FullWidthContainer>
              {safeBusinesses.length === 0 ? (
                renderNoBusinessesMessage()
              ) : (
                <>
                  <HeaderText style={{ marginLeft: 12 }}>
                    Studios Near You
                  </HeaderText>
                  <FlatListContainer
                    style={{
                      marginBottom: 12,
                    }}
                  >
                    <FlatList
                      data={safeBusinesses}
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
                  <HeaderText style={{ marginLeft: 12 }}>
                    Trending Now
                  </HeaderText>
                  <FlatListContainer
                    style={{
                      marginBottom: 12,
                    }}
                  >
                    <FlatList
                      data={safeBusinesses}
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
                  <HeaderText style={{ marginLeft: 12 }}>
                    New Studios
                  </HeaderText>
                  <FlatListContainer
                    style={{
                      marginBottom: 12,
                    }}
                  >
                    <FlatList
                      data={safeBusinesses}
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
                </>
              )}
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
