import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Container, FlatListContainer } from "./homeStyles";
import { Business, useBusinessContext } from "./contexts/BusinessContext";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import Map from "../components/map";
import { BusinessCard } from "./ui/business-card/business-card";
import { Ionicons } from "@expo/vector-icons";

const { width: viewportWidth } = Dimensions.get("window");

export default function HomePage() {
  const { businesses } = useBusinessContext();
  const [isMapView, setIsMapView] = useState(false);

  const toggleListView = () => {
    setIsMapView(!isMapView);
  };

  const renderItem = ({ item }: { item: Business }) => {
    const businessId = item.id ?? 0;

    return (
      <BusinessCard
        item={{
          ...item,
          name: item.name,
          address: item.address,
          phoneNumber: item.phoneNumber,
          type: item.type,
          hours: "Mon-Fri",
          description: "",
        }}
        onPress={() => router.push(`/business/${businessId}/classes`)}
      />

      // <Container
      //   key={businessId}
      //   onPress={() => router.push(`/business/${businessId}/classes`)}
      // >
      //   <Card>
      //     <Title>{item.name}</Title>
      //     <Text>
      //       <Text style={{ fontWeight: "bold" }}>Address: </Text>
      //       {`${item.address}, ${item.city}, ${item.state}, ${item.zipCode}`}
      //     </Text>
      //     <Text>
      //       <Text style={{ fontWeight: "bold" }}>Phone: </Text>
      //       {item.phoneNumber}
      //     </Text>
      //     <Text>
      //       <Text style={{ fontWeight: "bold" }}>Type: </Text>
      //       {item.type}
      //     </Text>
      //   </Card>
      // </Container>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isMapView ? (
        <Map businesses={businesses} toggleListView={toggleListView} />
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

      {!isMapView && (
        <View
          style={{
            position: "absolute",
            bottom: 60,
            right: 20,
            gap: 10,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={{
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
            }}
            onPress={toggleListView}
          >
            <Ionicons name="map" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
