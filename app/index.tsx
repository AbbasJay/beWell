import React, { useState, useRef, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  Dimensions,
  FlatList,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

import FilterMenu from "@/components/filterMenu";
import Map from "../components/map";
import { BusinessCard } from "./ui/business-card/business-card";
import { LoadingSpinner } from "./ui/loading-spinner";
import { ErrorMessage } from "./ui/error-message";
import {
  Business,
  useBusinessContext,
  useFilterBusinessContext,
} from "./contexts/BusinessContext";
import { useAuth } from "./contexts/auth/AuthContext";
import { useMapView } from "./contexts/MapViewContext";
import * as CSS from "./homeStyles";

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
  const params = useLocalSearchParams<{
    mapView?: string;
    focusBusinessId?: string;
  }>();
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
  const { isMapView, setIsMapView } = useMapView();
  const [location, setLocation] = useState(INITIAL_REGION);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  // Filter businesses based on search query
  const filteredBusinesses = useMemo(() => {
    // Ensure businesses is an array to prevent filter errors
    const safeBusinesses = businesses || [];

    if (!searchQuery.trim()) {
      return safeBusinesses;
    }

    const query = searchQuery.toLowerCase().trim();
    return safeBusinesses.filter((business) => {
      const name = business.name?.toLowerCase() || "";
      const address = business.address?.toLowerCase() || "";
      const type = business.type?.toLowerCase() || "";
      const city = business.city?.toLowerCase() || "";
      const state = business.state?.toLowerCase() || "";
      const country = business.country?.toLowerCase() || "";
      const zipCode = business.zipCode?.toLowerCase() || "";

      return (
        name.includes(query) ||
        address.includes(query) ||
        type.includes(query) ||
        city.includes(query) ||
        state.includes(query) ||
        country.includes(query) ||
        zipCode.includes(query)
      );
    });
  }, [businesses, searchQuery]);

  // Get initialization state from context
  const isInitialized = getHomeInitialized();

  // Ensure businesses is an array to prevent filter errors
  const safeBusinesses = businesses || [];

  // Handle URL parameters for map view and business focus
  useEffect(() => {
    console.log("Home Debug - params.mapView:", params.mapView);
    if (params.mapView === "true") {
      setIsMapView(true);
    } else {
      setIsMapView(false);
    }
  }, [params.mapView, setIsMapView]);

  useEffect(() => {
    const initialiseHomeScreen = async () => {
      // Skip initialization if already done
      if (isInitialized) {
        setIsLoading(false);
        return;
      }

      // Remove: Skip if not authenticated or in guest mode
      // if (!user && !isGuestMode) {
      //   setIsLoading(false);
      //   return;
      // }

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

        // Always fetch businesses and filters
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
    if (isMapView) {
      // Switch to list view
      router.replace("/home" as any);
    } else {
      // Switch to map view
      router.replace("/home?mapView=true" as any);
    }
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

  const handleSearch = () => {
    // Search is now handled by the filteredBusinesses useMemo
    // This function can be used for additional search logic if needed
    console.log("Searching for:", searchQuery);
    setIsSearching(true);

    // Clear search after a short delay to show results
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
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

  // Remove the login/signup/guest prompt. Always show the homepage content below.

  // Show message when no businesses are available
  const renderNoBusinessesMessage = () => (
    <CSS.NoBusinessesContainer>
      <CSS.NoBusinessesText>
        No businesses found in your area
      </CSS.NoBusinessesText>
    </CSS.NoBusinessesContainer>
  );

  return (
    <CSS.Container>
      {isMapView ? (
        <Map
          businesses={safeBusinesses}
          toggleListView={toggleListView}
          toggleFilterMenu={toggleFilterMenu}
          location={location}
          focusBusinessId={params.focusBusinessId}
        />
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <CSS.HeroSection>
              <ImageBackground
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjGVpUnMoE8PUL1YsQDt7OTsyFkGfFMNcW4JxkyBKEYkDHIEVw6YqVMtPjpdrMWAC1avis3CCVTiIsqG7lsEYFIYMEBI9PQ8oRm3HOwYD6Hz0ZZodyh77KkDYyanvpvW7tx6ig0xQuz5jBvnDVhu3XuzmB9TDk42gpJdOy1Rkf0O_PnDJ0T7juNULasPl5jQfMmz72SefYZtzC0hiXoFPj7qiDsrrbkZpyWVRnUXQP_tEI7pKZlwspl0tpY6sswlYUMYAfOTjXVk0t",
                }}
                style={{ flex: 1, borderRadius: 0 }}
              >
                <CSS.HeroOverlay>
                  <CSS.HeroContent>
                    <CSS.HeroTitle>Find Your Fit</CSS.HeroTitle>
                    <CSS.HeroSubtitle>
                      Explore a variety of classes and studios to meet your
                      fitness goals.
                    </CSS.HeroSubtitle>
                  </CSS.HeroContent>

                  {/* Search Bar */}
                  <CSS.SearchContainer>
                    <CSS.SearchInputContainer>
                      <CSS.SearchIconContainer>
                        <MaterialIcons
                          name="search"
                          size={20}
                          color="#688273"
                        />
                      </CSS.SearchIconContainer>
                      <CSS.SearchInput
                        placeholder="Search studios, classes, or locations..."
                        placeholderTextColor="#688273"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                      />
                      {searchQuery.length > 0 && (
                        <CSS.ClearButton onPress={clearSearch}>
                          <MaterialIcons
                            name="close"
                            size={20}
                            color="#688273"
                          />
                        </CSS.ClearButton>
                      )}
                      <CSS.SearchButton onPress={handleSearch}>
                        <CSS.SearchButtonText>
                          {isSearching ? "..." : "Search"}
                        </CSS.SearchButtonText>
                      </CSS.SearchButton>
                    </CSS.SearchInputContainer>
                  </CSS.SearchContainer>
                </CSS.HeroOverlay>
              </ImageBackground>
            </CSS.HeroSection>

            {/* Search Results Header */}
            {searchQuery.trim() && (
              <CSS.SearchResultsHeader>
                <CSS.SearchResultsText>
                  {filteredBusinesses.length === 0
                    ? `No results found for "${searchQuery}"`
                    : `${filteredBusinesses.length} result${
                        filteredBusinesses.length === 1 ? "" : "s"
                      } for "${searchQuery}"`}
                </CSS.SearchResultsText>
                <TouchableOpacity onPress={clearSearch}>
                  <CSS.ClearSearchText>Clear</CSS.ClearSearchText>
                </TouchableOpacity>
              </CSS.SearchResultsHeader>
            )}

            {/* Filter Menu */}
            <FilterMenu
              rating={rating}
              isVisible={isFilterMenuVisible}
              toggleFilterMenu={toggleFilterMenu}
              distance={distance}
              selectedCategories={selectedCategories}
              applyFilters={applyFilters}
            />

            {/* Studios Near You */}
            <CSS.SectionTitle>
              {searchQuery.trim() ? "Search Results" : "Studios Near You"}
            </CSS.SectionTitle>
            {filteredBusinesses.length === 0 ? (
              renderNoBusinessesMessage()
            ) : (
              <CSS.FlatListContainer>
                <FlatList
                  data={filteredBusinesses}
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
                  ItemSeparatorComponent={() => <CSS.ScrollSeparator />}
                />
              </CSS.FlatListContainer>
            )}

            {/* Only show Trending and New sections when not searching */}
            {!searchQuery.trim() && (
              <>
                {/* Trending Now */}
                <CSS.SectionTitle>Trending Now</CSS.SectionTitle>
                {safeBusinesses.length === 0 ? (
                  renderNoBusinessesMessage()
                ) : (
                  <CSS.FlatListContainer>
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
                      ItemSeparatorComponent={() => <CSS.ScrollSeparator />}
                    />
                  </CSS.FlatListContainer>
                )}

                {/* New Studios */}
                <CSS.SectionTitle>New Studios</CSS.SectionTitle>
                {safeBusinesses.length === 0 ? (
                  renderNoBusinessesMessage()
                ) : (
                  <CSS.FlatListContainer>
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
                      ItemSeparatorComponent={() => <CSS.ScrollSeparator />}
                    />
                  </CSS.FlatListContainer>
                )}
              </>
            )}

            {/* Bottom Spacing */}
            <CSS.BottomSpacing />
          </ScrollView>

          {/* Floating Action Buttons */}
          <CSS.FloatingButtons>
            <CSS.FloatingButton onPress={toggleFilterMenu}>
              <MaterialIcons name="filter-alt" size={24} color="black" />
            </CSS.FloatingButton>
            <CSS.FloatingButton onPress={toggleListView}>
              <MaterialIcons name="map" size={24} color="black" />
            </CSS.FloatingButton>
          </CSS.FloatingButtons>
        </>
      )}
    </CSS.Container>
  );
}
