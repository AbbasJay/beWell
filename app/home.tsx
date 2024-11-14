import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList, Platform } from "react-native";
import { Container, Card, Title, FlatListContainer } from "./homeStyles";
import { API_URL } from "@/env";
import * as SecureStore from "expo-secure-store";

const { width: viewportWidth } = Dimensions.get("window");

type Business = {
  userId: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  type: string;
  id?: number | undefined;
  description?: string | null | undefined;
  hours?: string | null | undefined;
  createdAt?: Date | undefined;
};

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        let token;
        if (Platform.OS === "web") {
          token = localStorage.getItem("userToken");
        } else {
          token = await SecureStore.getItemAsync("userToken");
        }

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_URL}/api/businesses?all=true`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBusinesses();
  }, []);

  const renderItem = ({ item }: { item: Business }) => (
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
  );

  return (
    <Container>
      <FlatListContainer>
        <FlatList
          data={data}
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
