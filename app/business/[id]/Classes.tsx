import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Class } from "@/app/contexts/ClassesContext";
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
  ModalLayout,
  ModalContainer,
} from "./styles";

export default function Business() {
  const { businesses } = useBusinessContext();
  const { id } = useLocalSearchParams();
  const business = businesses.find((b) => b.id === Number(id));
  const [classes, setClasses] = useState<Class[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleClassPress = (item: Class) => {
    setSelectedClass(item);
    setShowConfirmation(false);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(true);
  };

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
      </BusinessDetails>

      {classes.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => handleClassPress(item)}>
          <ClassesCard item={item} />
        </TouchableOpacity>
      ))}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <ModalContainer>
            <ModalLayout>
              {showConfirmation ? (
                <>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Confirmed
                  </Text>
                  <Button
                    title="Close"
                    onPress={() => setModalVisible(false)}
                  />
                </>
              ) : (
                <>
                  {selectedClass && (
                    <View>
                      <ClassesTitle>
                        <BoldText>{selectedClass.name}</BoldText>
                      </ClassesTitle>

                      <DetailText>
                        <BoldText>Description:</BoldText>{" "}
                        {selectedClass.description}
                      </DetailText>

                      <DetailText>
                        <BoldText>Instructor:</BoldText>{" "}
                        {selectedClass.instructor}
                      </DetailText>

                      <DetailText>
                        <BoldText>Address:</BoldText>
                        {` ${business.address}, ${selectedClass.location}`}
                      </DetailText>
                    </View>
                  )}
                  <Button title="Confirm" onPress={handleConfirm} />
                </>
              )}
            </ModalLayout>
          </ModalContainer>
        </View>
      </Modal>
    </ScrollView>
  );
}
