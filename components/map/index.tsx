import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Business } from "../../app/contexts/BusinessContext";
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { set } from "react-hook-form";

const INITIAL_REGION = {
  //london
  latitude: 51.5176,
  longitude: 0.1145,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const { width: viewportWidth } = Dimensions.get("window");

const provider = Platform.select({
  ios: PROVIDER_DEFAULT,
  android: PROVIDER_GOOGLE,
});

interface MapComponentProps {
  toggleListView: () => void;
  businesses: Business[];
}

const Map: React.FC<MapComponentProps> = ({ toggleListView, businesses }) => {
  if (Platform.OS === "web") {
    return <Text>Map View is not supported on web</Text>;
  }

  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<any>(INITIAL_REGION);
  const [center, setCenter] = useState<any>(INITIAL_REGION);

  businesses = businesses.filter((b) => b.latitude && b.longitude);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status == "granted") {
      } else {
        setLocation(INITIAL_REGION);
        setCenter(INITIAL_REGION);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = loc.coords;

      const user_location = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setLocation(user_location);
      setCenter(user_location);
    })();
  }, []);

  const focusMap = () => {
    mapRef.current?.animateToRegion(location, 1000);
  };

  const zoomIn = () => {
    mapRef.current?.animateToRegion(
      {
        //cuurent location
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: center.latitudeDelta / 2,
        longitudeDelta: center.longitudeDelta / 2,
      },
      1000
    );
  };

  const zoomOut = () => {
    mapRef.current?.animateToRegion(
      {
        //cuurent location
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: center.latitudeDelta * 2,
        longitudeDelta: center.longitudeDelta * 2,
      },
      1000
    );
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
    let { latitude, longitude } = businesses[index];

    if (latitude && longitude) {
      if (typeof latitude === "string" && typeof longitude === "string") {
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
      }
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
    if (
      typeof marker.latitude === "string" &&
      typeof marker.longitude === "string"
    ) {
      marker.latitude = parseFloat(marker.latitude);
      marker.longitude = parseFloat(marker.longitude);
    }

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={focusMap}>
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleListView}>
          <MaterialIcons name="list" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={zoomOut}>
          <MaterialIcons name="arrow-upward" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={zoomIn}>
          <MaterialIcons name="arrow-downward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        initialRegion={location}
        provider={provider}
        showsMyLocationButton={false}
        showsUserLocation={true}
        ref={mapRef}
        onRegionChangeComplete={(region) => {
          setCenter(region);
        }}
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
                  latitude:
                    typeof marker.latitude === "string"
                      ? parseFloat(marker.latitude)
                      : marker.latitude,
                  longitude:
                    typeof marker.longitude === "string"
                      ? parseFloat(marker.longitude)
                      : marker.longitude,
                }}
                onPress={() =>
                  onMarkerPress({
                    latitude: marker.latitude!,
                    longitude: marker.longitude!,
                  })
                }
              ></Marker>
            )
        )}
      </MapView>

      {/* Carousel */}
      {/* <GestureHandlerRootView>
        <GestureDetector gesture={carouselGesture}> */}
      <View style={styles.outerView}>
        <Carousel
          data={businesses}
          renderItem={renderCarouselItem}
          width={viewportWidth * 0.8}
          onSnapToItem={onSnapToItem}
          style={styles.carouselContainer}
          pointerEvents="auto"
        />
      </View>
      {/* </GestureDetector>
      </GestureHandlerRootView> */}
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
  outerView: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  carouselContainer: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
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

  buttonContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    gap: 10,
    zIndex: 10,
  },

  button: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});

export default Map;
