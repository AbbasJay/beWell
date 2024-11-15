import React from "react";
import { View, Text, Dimensions, FlatList } from "react-native";
import { Container, Card, Title, FlatListContainer } from "./homeStyles";
import { useBusinessContext } from "./contexts/BusinessContext";
import { router } from "expo-router";

const { width: viewportWidth } = Dimensions.get("window");

export default function HomePage() {
  const { businesses } = useBusinessContext();

  const renderItem = ({ item }: { item: any }) => {
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
            {item.address}
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
        />
      </FlatListContainer>
    </Container>
  );
}
