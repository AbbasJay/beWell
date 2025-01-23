import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";

import { Text, Platform, Dimensions } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Business } from "../../app/contexts/BusinessContext";
import { router } from "expo-router";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

import {
  Container,
  Card,
  CardTitle,
  CardAddress,
  StyledMapView,
  CarouselContainer,
  ButtonContainer,
  Button,
  StyledCarousel,
} from "./styles";

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
}) as typeof PROVIDER_GOOGLE;

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

interface MapComponentProps {
  toggleListView: () => void;
  toggleFilterMenu: () => void;
  isVisible: boolean;
  businesses: Business[];
}

const Map: React.FC<MapComponentProps> = ({
  toggleListView,
  toggleFilterMenu,
  isVisible,
  businesses,
}) => {
  if (Platform.OS === "web") {
    return <Text>Map View is not supported on web</Text>;
  }

  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Region>();
  const [center, setCenter] = useState<Region>();
  const [firstBusinessLocation, setFirstBusinessLocation] = useState<Region>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status == "granted") {
        const loc = await Location.getCurrentPositionAsync({});

        const { latitude, longitude } = loc.coords;

        const user_location = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setLocation(user_location);
      } else {
        setLocation(INITIAL_REGION);
      }
    })();
  }, []);

  useEffect(() => {
    const firstBusiness_location = {
      latitude: businesses[0].latitude!,
      longitude: businesses[0].longitude!,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setFirstBusinessLocation(firstBusiness_location);
  }, [businesses]);

  useEffect(() => {
    mapRef.current?.animateToRegion(firstBusinessLocation!, 1000);
  }, [firstBusinessLocation]);

  const focusMap = () => {
    mapRef.current?.animateToRegion(location!, 1000);
  };

  const zoomIn = () => {
    mapRef.current?.animateToRegion(
      {
        //cuurent location
        latitude: center!.latitude,
        longitude: center!.longitude,
        latitudeDelta: center!.latitudeDelta / 2,
        longitudeDelta: center!.longitudeDelta / 2,
      },
      1000
    );
  };

  const zoomOut = () => {
    mapRef.current?.animateToRegion(
      {
        //cuurent location
        latitude: center!.latitude,
        longitude: center!.longitude,
        latitudeDelta: center!.latitudeDelta * 2,
        longitudeDelta: center!.longitudeDelta * 2,
      },
      1000
    );
  };

  const renderCarouselItem = ({ item }: { item: Business }) => (
    <Card onPress={() => router.push(`/business/${item.id}/classes`)}>
      <CardTitle>{item.name}</CardTitle>
      <CardAddress>{item.address}</CardAddress>
      <CardAddress>
        {item.city}, {item.state}
      </CardAddress>
    </Card>
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
    <Container>
      {/* Buttons */}
      <ButtonContainer>
        <Button onPress={focusMap}>
          <MaterialIcons name="my-location" size={24} color="black" />
        </Button>
        <Button onPress={toggleListView}>
          <MaterialIcons name="list" size={24} color="black" />
        </Button>
        <Button onPress={toggleFilterMenu}>
          <MaterialIcons name="filter-alt" size={24} color="black" />
        </Button>
        <Button onPress={zoomOut}>
          <MaterialIcons name="arrow-upward" size={24} color="black" />
        </Button>
        <Button onPress={zoomIn}>
          <MaterialIcons name="arrow-downward" size={24} color="black" />
        </Button>
      </ButtonContainer>

      <StyledMapView
        initialRegion={center}
        provider={provider}
        showsMyLocationButton={false}
        showsUserLocation={false}
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
      </StyledMapView>

      <CarouselContainer>
        <StyledCarousel
          data={businesses}
          renderItem={renderCarouselItem}
          width={viewportWidth * 0.8}
          onSnapToItem={onSnapToItem}
        />
      </CarouselContainer>
    </Container>
  );
};

export default Map;
