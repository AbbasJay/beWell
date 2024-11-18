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
import styled from "styled-components/native";

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
    <BeWellBackground
      hasNavigationBar={true}
      useScrollView={true}
      scrollViewContentContainerStyle={{
        paddingTop: 10,
        paddingHorizontal: 10,
      }}
    >
      <Container>
        <FlatListContainer>
          <FlatList
            data={businesses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || ""}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={viewportWidth * 0.6 + 50}
            contentContainerStyle={{
              paddingHorizontal: 0,
            }}
            ItemSeparatorComponent={() => <ScrollSeparator />}
          />
        </FlatListContainer>
      </Container>
      <View>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
      </View>
    </BeWellBackground>
  );
}
