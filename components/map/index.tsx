import MapView, { Marker, Callout } from "react-native-maps";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/env";

const INITIAL_REGION = {
  //london
  latitude: 51.5176,
  longitude: 0.1145,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const markers = [
  {
    id: "1",
    latitude: "51.5081",
    longitude: "0.0759",
    name: "Tower of London",
    address: "St Katharine's & Wapping, London",
    city: "London",
    state: "England",
    country: "United Kingdom",
  },
  {
    id: "2",
    latitude: "51.5033",
    longitude: "0.1195",
    name: "London Eye",
    address: "Lambeth, London",
    city: "London",
    state: "England",
    country: "United Kingdom",
  },
  {
    id: "3",
    latitude: "51.5014",
    longitude: "0.1419",
    name: "Buckingham Palace",
    address: "Westminster, London",
    city: "London",
    state: "England",
    country: "United Kingdom",
  },
];

const Map = () => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  interface MarkerData {
    id: string;
    latitude: string;
    longitude: string;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  }

  const [data, setData] = useState<MarkerData[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ marginRight: 20 }}>
            <Text>Focus</Text>
          </View>
        </TouchableOpacity>
      ),
    });
    fetchBusinesses();
  }, []);

  const focusMap = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 1000);
  };

  const fetchBusinesses = async () => {
    try {
      let token;
      if (Platform.OS === "web") {
        token = localStorage.getItem("userToken");
      } else {
        token = await SecureStore.getItemAsync("userToken");
      }

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/api/businesses?all=true`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      setData(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onMarkerPress = (marker: { latitude: number; longitude: number }) => {
    mapRef.current?.animateToRegion(
      {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        ref={mapRef}
      >
        {data.map(
          (
            marker //filter out the markers that have null atitude or longitude
          ) =>
            marker.latitude &&
            marker.longitude && (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                }}
                onPress={() =>
                  onMarkerPress({
                    latitude: parseFloat(marker.latitude),
                    longitude: parseFloat(marker.longitude),
                  })
                }
              >
                <Callout>
                  <Text>{marker.name}</Text>
                  <Text>{marker.address}</Text>
                  <Text>
                    {marker.city}, {marker.state}
                  </Text>
                  <Text>{marker.country}</Text>
                </Callout>
              </Marker>
            )
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
