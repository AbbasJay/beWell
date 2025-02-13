import React, { useRef, useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import * as ExpoGooglePlaces from "expo-google-places";
import { SearchBar } from "@rneui/themed";
import { View } from "react-native";
import { ResultsContainer, ResultItem, ResultText } from "./styles";
interface SearchBarProps {
  updateLocation: (lat: number, lng: number) => void;
}

const AddressSearchBar: React.FC<SearchBarProps> = ({ updateLocation }) => {
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    ExpoGooglePlaces.AutocompletePrediction[]
  >([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [placeId, setPlaceId] = useState<string>();

  const [placeDetails, setPlaceDetails] =
    useState<Pick<ExpoGooglePlaces.Place, "coordinate">>();

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  const fetchPredictions = async (search: string) => {
    try {
      const predictions = await ExpoGooglePlaces.fetchPredictionsWithSession(
        search,
        {
          countries: ["uk"],
        }
      );
      // Do something with the predictions like set them
      // into a state and render them in a list
      setSearchResults(predictions);
    } catch (error) {
      console.log("Error fetching predictions", error);
    }
  };

  const fetchPlace = async (placeID: string) => {
    try {
      const placeDetails = await ExpoGooglePlaces.fetchPlaceWithSession(
        placeID,
        ["coordinate"]
      );
      setPlaceDetails(placeDetails);
      console.log(placeDetails);
    } catch (error) {
      console.log("Error fetching place details", error);
    }
  };

  useEffect(() => {
    // fetch search results
    if (search.length > 2) {
      fetchPredictions(search);
    }
  }, [search]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  useEffect(() => {
    if (placeId && placeId.length > 0) {
      fetchPlace(placeId);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeDetails) {
      console.log(placeDetails.coordinate);
      updateLocation(
        placeDetails.coordinate.latitude,
        placeDetails.coordinate.longitude
      );
    }
  }, [placeDetails]);

  return (
    <>
      <SearchBar
        placeholder="Search"
        value={search}
        onChangeText={(text) => updateSearch(text)}
        onClear={() => setSearch("")}
        lightTheme={true}
        round={true}
        containerStyle={{
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderBottomWidth: 0,
          paddingHorizontal: 0,
        }}
        inputContainerStyle={{
          backgroundColor: "lightgrey", // or "transparent"
          borderRadius: 10,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && searchResults.length > 0 && (
        <ResultsContainer>
          {searchResults.map((result, index) => (
            <ResultItem
              onPress={() => {
                setPlaceId(result.placeID);
                setSearchResults([]);
                setSearch("");
              }}
            >
              <ResultText key={index}>{result.primaryText}</ResultText>
            </ResultItem>
          ))}
        </ResultsContainer>
      )}
    </>
  );
};

export default AddressSearchBar;
