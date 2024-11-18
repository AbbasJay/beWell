import React from "react";
import { Dimensions, FlatList, Platform } from "react-native";
import {
  FlatListContainer,
  FullWidthContainer,
  ScrollSeparator,
} from "./homeStyles";
import { Business, useBusinessContext } from "./contexts/BusinessContext";
import { router } from "expo-router";
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
          description: "",
        }}
        onPress={() => router.push(`/business/${businessId}/classes`)}
      />
    );
  };

  return (
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
