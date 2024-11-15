import React, { useEffect, useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Class, useClassesContext } from "@/app/contexts/ClassesContext";
import { ClassesCard } from "@/app/ui/classes-card";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/env";
import { useBusinessContext } from "../../contexts/BusinessContext";
import {
  BusinessDetails,
  Title,
  DetailText,
  BoldText,
  ReadMoreText,
  ClassesTitle,
} from "./styles";

export default function Business() {
  const { businesses } = useBusinessContext();
  const { id } = useLocalSearchParams();
  const business = businesses.find((b) => b.id === Number(id));
  const [classes, setClasses] = useState<Class[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!business) {
    return <DetailText>No business data available</DetailText>;
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

  const descriptionLimit = 200;
  const isDescriptionLong =
    business.description && business.description.length > descriptionLimit;

  return (
    <ScrollView>
      <BusinessDetails>
        <Title>{business.name}</Title>

        <DetailText>
          <BoldText>Address:</BoldText> {business.address}
        </DetailText>

        <DetailText>
          <BoldText>Phone:</BoldText> {business.phoneNumber}
        </DetailText>

        <DetailText>
          <BoldText>Email:</BoldText> {business.email}
        </DetailText>

        <DetailText>
          <BoldText>Type:</BoldText> {business.type}
        </DetailText>

        <DetailText>
          <BoldText>Hours:</BoldText> {business.hours}
        </DetailText>

        <View>
          <DetailText>
            <BoldText>Description:</BoldText>{" "}
            {showFullDescription || !isDescriptionLong
              ? business.description
              : `${business.description?.slice(0, descriptionLimit)}...`}
          </DetailText>
          {isDescriptionLong && (
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <ReadMoreText>
                {showFullDescription ? "Read less" : "Read more"}
              </ReadMoreText>
            </TouchableOpacity>
          )}
        </View>
      </BusinessDetails>

      <ClassesTitle>Classes</ClassesTitle>

      {classes.map((item) => (
        <ClassesCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
