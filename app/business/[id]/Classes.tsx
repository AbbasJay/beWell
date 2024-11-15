import React, { useEffect, useState } from "react";
import { Platform, ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Class, useClassesContext } from "@/app/contexts/ClassesContext";
import { ClassesCard } from "@/app/ui/classes-card";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/env";
import { useBusinessContext } from "../../contexts/BusinessContext";

export default function Business() {
  const { businesses } = useBusinessContext();
  const { id } = useLocalSearchParams();
  const business = businesses.find((b) => b.id === Number(id));
  const [classes, setClasses] = useState<Class[]>([]);

  if (!business) {
    return <Text>No business data available</Text>;
  }

  useEffect(() => {
    const fetchClasses = async () => {
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

        const response = await fetch(`${API_URL}/api/classes/${business.id}`, {
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
        setClasses(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClasses();
  }, [business.id]);

  return (
    <ScrollView>
      {classes.map((item) => (
        <ClassesCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
