import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Container, Card, Title, FlatListContainer } from "./homeStyles";
import { Business, useBusinessContext } from "./contexts/BusinessContext";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import Map from "../components/map";

const { width: viewportWidth } = Dimensions.get("window");

export default function HomePage() {
  const { businesses } = useBusinessContext();
  const [isMapView, setIsMapView] = useState(false);

  const renderItem = ({ item }: { item: Business }) => {
    const businessId = item.id ?? 0;

    return (
      <Container
        key={businessId}
        onPress={() => router.push(`/business/${businessId}/classes`)}
      >
        <Card>
          <Title>{item.name}</Title>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Address: </Text>
            {`${item.address}, ${item.city}, ${item.state}, ${item.zipCode}`}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Phone: </Text>
            {item.phoneNumber}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Type: </Text>
            {item.type}
          </Text>
        </Card>
      </Container>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          setIsMapView(!isMapView);
        }}
      >
        <Text>{isMapView ? "Map View" : "List View"}</Text>
      </TouchableOpacity>
      {isMapView ? (
        <Map businesses={businesses} />
      ) : (
        <ScrollView style={{ backgroundColor: Colors.light.secondary }}>
          <Container>
            <FlatListContainer>
              <FlatList
                data={businesses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id?.toString() || ""}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate="fast"
                snapToInterval={viewportWidth * 0.6 + 50}
              />
            </FlatListContainer>
          </Container>
        </ScrollView>
      )}
    </View>
  );
}
