import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  Text,
} from "react-native";
import Button from "@/app/ui/button/button";
import { useLocalSearchParams } from "expo-router";
import { Class } from "@/app/contexts/ClassesContext";
import { ClassesCard } from "@/app/ui/classes-card";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/env";
import { useBusinessContext } from "../../contexts/BusinessContext";
import * as CSS from "./styles";
import { Colors } from "@/constants/Colors";
import { BusinessCard } from "@/app/ui/business-card/business-card";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { BeWellBackground } from "@/app/ui/be-well-background/be-well-background";

export default function Business() {
  const { businesses } = useBusinessContext();
  const { id } = useLocalSearchParams();
  const business = businesses.find((b) => b.id === Number(id));
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { refreshNotifications } = useNotificationsContext();
  const { sendNotification } = useNotifications();

  if (!business) {
    return <CSS.DetailText>No business data available</CSS.DetailText>;
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClasses();
  }, [business.id]);

  const descriptionLimit = 200;
  const isDescriptionLong =
    business.description && business.description.length > descriptionLimit;

  const handleClassPress = (item: Class) => {
    setSelectedClass(item);
    setShowConfirmation(false);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(true);

    if (selectedClass) {
      sendNotification(selectedClass, business.id || 0);
      refreshNotifications();
    }
  };

  return (
    <BeWellBackground scrollable>
      <CSS.BusinessCardContainer>
        <BusinessCard item={business} fullWidth disabled />
      </CSS.BusinessCardContainer>

      {classes.length > 0 && <CSS.HeaderText>Classes</CSS.HeaderText>}

      {isLoading ? (
        <CSS.HeaderText>Loading Classes...</CSS.HeaderText>
      ) : (
        classes.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleClassPress(item)}
          >
            <ClassesCard item={item} />
          </TouchableOpacity>
        ))
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <CSS.ModalBackground>
          <CSS.ModalContainer>
            <CSS.CloseButton onPress={() => setModalVisible(false)}>
              <CSS.CloseButtonText>{"x"}</CSS.CloseButtonText>
            </CSS.CloseButton>
            <CSS.ModalLayout>
              {showConfirmation ? (
                <CSS.ConfirmedText>Booking Confirmed</CSS.ConfirmedText>
              ) : (
                selectedClass && (
                  <View>
                    <CSS.ClassesTitle>
                      <CSS.BoldText>{selectedClass.name}</CSS.BoldText>
                    </CSS.ClassesTitle>
                    <CSS.DetailText>
                      <CSS.BoldText>Description: </CSS.BoldText>
                      {selectedClass.description}
                    </CSS.DetailText>
                    <CSS.DetailText>
                      <CSS.BoldText>Instructor: </CSS.BoldText>
                      {selectedClass.instructor}
                    </CSS.DetailText>
                    <CSS.DetailText>
                      <CSS.BoldText>Address: </CSS.BoldText>
                      {` ${business.address}, ${selectedClass.location}`}
                    </CSS.DetailText>
                  </View>
                )
              )}
            </CSS.ModalLayout>
            <CSS.ButtonContainer>
              <Button
                title={showConfirmation ? "Close" : "Confirm"}
                onPress={
                  showConfirmation
                    ? () => setModalVisible(false)
                    : handleConfirm
                }
              />
            </CSS.ButtonContainer>
          </CSS.ModalContainer>
        </CSS.ModalBackground>
      </Modal>
    </BeWellBackground>
  );
}
