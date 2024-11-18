import React from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";
import {
  Container,
  Card,
  Title,
  FlatListContainer,
  FullWidthContainer,
  ScrollSeparator,
} from "./homeStyles";
import { Business, useBusinessContext } from "./contexts/BusinessContext";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { BusinessCard } from "./ui/business-card/business-card";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { HeaderText } from "./homeStyles";

const { width: viewportWidth } = Dimensions.get("window");

export default function HomePage() {
  const { businesses } = useBusinessContext();

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
    );
  };

  return (
    <BeWellBackground scrollable>
      <FullWidthContainer>
        <Container>
          <HeaderText style={{ marginLeft: 12 }}>Near you</HeaderText>
          <FlatListContainer
            style={{ marginHorizontal: -20, marginBottom: 12 }}
          >
            <FlatList
              data={businesses}
              renderItem={renderItem}
              keyExtractor={(item) => item.id?.toString() || ""}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              snapToInterval={viewportWidth * 0.6 + 50}
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
          <FlatListContainer style={{ marginHorizontal: -20 }}>
            <FlatList
              data={businesses}
              renderItem={renderItem}
              keyExtractor={(item) => item.id?.toString() || ""}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              snapToInterval={viewportWidth * 0.6 + 50}
              contentContainerStyle={Platform.select({
                android: { paddingHorizontal: 12 },
              })}
              contentInset={Platform.select({
                ios: { left: 12, right: 12 },
              })}
              ItemSeparatorComponent={() => <ScrollSeparator />}
            />
          </FlatListContainer>
        </Container>
      </FullWidthContainer>
    </BeWellBackground>
  );
}
