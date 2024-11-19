import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Business, useBusinessContext } from "./contexts/BusinessContext";
import { router } from "expo-router";
import Map from "../components/map";
import { BusinessCard } from "./ui/business-card/business-card";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatListContainer,
  FullWidthContainer,
  ScrollSeparator,
} from "./homeStyles";

import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { HeaderText } from "./homeStyles";

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
          description: "",
        }}
        onPress={() => router.push(`/business/${businessId}/classes`)}
      />
    );
  };

  return (
    // <View style={{ flex: 1 }}>
    //   {isMapView ? (
    //     <Map businesses={businesses} toggleListView={toggleListView} />
    //   ) : (
    //     <ScrollView style={{ backgroundColor: Colors.light.secondary }}>
    //       <Container>
    //         <FlatListContainer>
    //           <FlatList
    //             data={businesses}
    //             renderItem={renderItem}
    //             keyExtractor={(item) => item.id?.toString() || ""}
    //             horizontal={true}
    //             showsHorizontalScrollIndicator={false}
    //             snapToAlignment="center"
    //             decelerationRate="fast"
    //             snapToInterval={viewportWidth * 0.6 + 50}
    //           />
    //         </FlatListContainer>
    //       </Container>
    //     </ScrollView>
    //   )}

    //   {!isMapView && (
    //     <View
    //       style={{
    //         position: "absolute",
    //         bottom: 60,
    //         right: 20,
    //         gap: 10,
    //         zIndex: 10,
    //       }}
    //     >
    //       <TouchableOpacity
    //         style={{
    //           padding: 10,
    //           backgroundColor: "white",
    //           borderRadius: 5,
    //           elevation: 2,
    //           shadowColor: "#000",
    //           shadowOpacity: 0.1,
    //           shadowRadius: 6,
    //           shadowOffset: {
    //             width: 1,
    //             height: 10,
    //           },
    //         }}
    //         onPress={toggleListView}
    //       >
    //         <Ionicons name="map" size={24} color="black" />
    //       </TouchableOpacity>
    //     </View>
    //   )}
    // </View>
    <BeWellBackground scrollable>
      <FullWidthContainer>
        <HeaderText style={{ marginLeft: 12 }}>Studios Near You</HeaderText>
        <FlatListContainer
          style={{
            marginBottom: 12,
            marginLeft: Platform.select({
              ios: 12,
            }),
          }}
        >
          <FlatList
            data={businesses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || ""}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={viewportWidth - 30}
            contentContainerStyle={Platform.select({
              android: { paddingHorizontal: 12 },
            })}
            contentInset={Platform.select({
              ios: { left: 12, right: 12 },
            })}
            ItemSeparatorComponent={() => <ScrollSeparator />}
          />
        </FlatListContainer>
        <HeaderText style={{ marginLeft: 12 }}>Trending Now</HeaderText>
        <FlatListContainer
          style={{
            marginBottom: 12,
            marginLeft: Platform.select({
              ios: 12,
            }),
          }}
        >
          <FlatList
            data={businesses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || ""}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={viewportWidth - 30}
            contentContainerStyle={Platform.select({
              android: { paddingHorizontal: 12 },
            })}
            contentInset={Platform.select({
              ios: { left: 12, right: 12 },
            })}
            ItemSeparatorComponent={() => <ScrollSeparator />}
          />
        </FlatListContainer>
        <HeaderText style={{ marginLeft: 12 }}>New Studios</HeaderText>
        <FlatListContainer
          style={{
            marginBottom: 12,
            marginLeft: Platform.select({
              ios: 12,
            }),
          }}
        >
          <FlatList
            data={businesses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || ""}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={viewportWidth - 30}
            contentContainerStyle={Platform.select({
              android: { paddingHorizontal: 12 },
            })}
            contentInset={Platform.select({
              ios: { left: 12, right: 12 },
            })}
            ItemSeparatorComponent={() => <ScrollSeparator />}
          />
        </FlatListContainer>
      </FullWidthContainer>
    </BeWellBackground>
  );
}
