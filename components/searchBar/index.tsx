import React, { useEffect, useState } from "react";
import * as ExpoGooglePlaces from "expo-google-places";
import { SearchBar } from "@rneui/themed";
import { ResultsContainer, ResultItem, ResultText } from "./styles";
import { Keyboard } from "react-native";
import { set } from "react-hook-form";

interface SearchBarProps {
  updateLocation: (lat: number, lng: number) => void;
}

const AddressSearchBar: React.FC<SearchBarProps> = ({ updateLocation }) => {
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    ExpoGooglePlaces.AutocompletePrediction[]
  >([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>("Search");

  const [placeId, setPlaceId] = useState<string>();

  const [placeDetails, setPlaceDetails] =
    useState<Pick<ExpoGooglePlaces.Place, "coordinate">>();

  const [loading, setLoading] = useState<boolean>(false);

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

  const handleResultPress = (placeID: string, address: string) => {
    setPlaceId(placeID);
    setSearchResults([]);
    setSearch("");
    setPlaceholder(address);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setSearch("");
    setPlaceholder("Search");
    console.log(placeholder);
  };

  // Debounced API call for fetching predictions
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (search.length > 2) {
        fetchPredictions(search);
      }
    }, 1000); // Delay of 500ms

    if (search.length > 2 && !loading) {
      setLoading(true);
    }

    return () => clearTimeout(debounceTimeout);
  }, [search]);

  useEffect(() => {
    console.log(searchResults);

    if (loading) {
      setLoading(false);
    }
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
        placeholder={placeholder}
        value={search}
        onChangeText={(text) => updateSearch(text)}
        onClear={() => {
          handleClear();
        }}
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
          {loading ? (
            <ResultText>Searching...</ResultText>
          ) : (
            searchResults.map((result, index) => (
              <ResultItem
                key={index}
                onPress={() =>
                  handleResultPress(result.placeID, result.fullText)
                }
              >
                <ResultText>{result.fullText}</ResultText>
              </ResultItem>
            ))
          )}
        </ResultsContainer>
      )}
    </>
  );
};

export default AddressSearchBar;
