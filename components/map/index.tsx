import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";

import { Text, Platform, Dimensions } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Business } from "../../app/contexts/BusinessContext";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import { calculate_distance } from "@/app/utils/helper-functions/haversine-distance";

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
  CardTitleContainer,
} from "./styles";

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
  businesses: Business[];
  location: { lat: number; lng: number };
  focusBusinessId?: string;
}

const Map: React.FC<MapComponentProps> = ({
  toggleListView,
  toggleFilterMenu,
  businesses,
  location,
  focusBusinessId,
}) => {
  if (Platform.OS === "web") {
    return <Text>Map View is not supported on web</Text>;
  }

  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<any>(null);
  const [center, setCenter] = useState<Region>();
  const [firstBusinessLocation, setFirstBusinessLocation] = useState<Region>();

  useEffect(() => {
    if (businesses.length === 0) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
      return;
    }

    const firstBusiness_location = {
      latitude: businesses[0].latitude!,
      longitude: businesses[0].longitude!,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setFirstBusinessLocation(firstBusiness_location);
  }, [businesses]);

  useEffect(() => {
    if (firstBusinessLocation) {
      mapRef.current?.animateToRegion(firstBusinessLocation!, 1000);
    }
  }, [firstBusinessLocation]);

  // Focus on specific business if focusBusinessId is provided
  useEffect(() => {
    if (focusBusinessId && businesses.length > 0) {
      const focusBusiness = businesses.find(
        (b) => b.id?.toString() === focusBusinessId
      );
      if (focusBusiness && focusBusiness.latitude && focusBusiness.longitude) {
        const region = {
          latitude:
            typeof focusBusiness.latitude === "string"
              ? parseFloat(focusBusiness.latitude)
              : focusBusiness.latitude,
          longitude:
            typeof focusBusiness.longitude === "string"
              ? parseFloat(focusBusiness.longitude)
              : focusBusiness.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(region, 1000);
      }
    }
  }, [focusBusinessId, businesses]);

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

  const renderCarouselItem = ({ item }: { item: Business }) => {
    const distance =
      calculate_distance(
        location.lat,
        location.lng,
        item.latitude!,
        item.longitude!
      ) / 1000;

    return (
      <Card onPress={() => router.push(`/business/${item.id}/classes`)}>
        <CardTitleContainer>
          <CardTitle>{item.name}</CardTitle>
          <Text>{distance.toFixed(1)} km</Text>
        </CardTitleContainer>
        <CardAddress>{item.address}</CardAddress>
        <CardAddress>
          {item.city}, {item.state}
        </CardAddress>
      </Card>
    );
  };

  const onSnapToItem = (index: number) => {
    const business = businesses[index];
    if (!business || !business.latitude || !business.longitude) return;

    let latitude = business.latitude;
    let longitude = business.longitude;

    if (typeof latitude === "string") {
      latitude = parseFloat(latitude);
    }
    if (typeof longitude === "string") {
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
  };

  const handleMarkerPress = (marker: {
    latitude: number;
    longitude: number;
  }) => {
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
      <ButtonContainer>
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
        onPress={() => Keyboard.dismiss()}
      >
        {businesses.map(
          (marker, index) =>
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
                onPress={() => {
                  // When marker is pressed, also snap carousel to this item
                  if (carouselRef.current) {
                    carouselRef.current.snapToItem(index);
                  }
                  handleMarkerPress({
                    latitude: marker.latitude!,
                    longitude: marker.longitude!,
                  });
                }}
              />
            )
        )}
      </StyledMapView>
      <CarouselContainer>
        <StyledCarousel
          ref={carouselRef}
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
