import MapView, { Marker, Callout } from "react-native-maps";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Business } from "../../app/contexts/BusinessContext";
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";

const INITIAL_REGION = {
  //london
  latitude: 51.5176,
  longitude: 0.1145,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const { width: viewportWidth } = Dimensions.get("window");

const Map = ({ businesses }: { businesses: Business[] }) => {
  if (Platform.OS === "web") {
    return <Text>Map View is not supported on web</Text>;
  }

  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  businesses = businesses.filter((b) => b.latitude && b.longitude);

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

    if (businesses.length > 0) {
      const { latitude, longitude } = businesses[selectedIndex];
      if (latitude && longitude) {
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }
    }
  }, []);

  const focusMap = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 1000);
  };

  const renderCarouselItem = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/business/${item.id}/classes`)}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardAddress}>{item.address}</Text>
      <Text style={styles.cardAddress}>
        {item.city}, {item.state}
      </Text>
    </TouchableOpacity>
  );

  const onSnapToItem = (index: number) => {
    setSelectedIndex(index);
    const { latitude, longitude } = businesses[index];
    if (latitude && longitude) {
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
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
        {businesses.map(
          (
            marker //filter out the markers that have null atitude or longitude
          ) =>
            marker.latitude &&
            marker.longitude && (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                onPress={() =>
                  onMarkerPress({
                    latitude: marker.latitude!,
                    longitude: marker.longitude!,
                  })
                }
              >
                <Callout
                  onPress={() => router.push(`/business/${marker.id}/classes`)}
                >
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

      {/* Carousel */}
      <View>
        <Carousel
          data={businesses}
          renderItem={renderCarouselItem}
          width={viewportWidth * 0.8}
          onSnapToItem={onSnapToItem}
          style={styles.carouselContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  carouselContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 14,
    color: "#555",
  },
});

export default Map;
