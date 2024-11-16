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
import { Business } from "../../app/contexts/BusinessContext";
import { router } from "expo-router";

const INITIAL_REGION = {
  //london
  latitude: 51.5176,
  longitude: 0.1145,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Map = ({ businesses }: { businesses: Business[] }) => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();

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
  }, []);

  const focusMap = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 1000);
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
});

export default Map;
