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
import { formattedStartDate } from "@/app/utils/helper-functions/format-time-and-dates";
import { formatDuration } from "@/app/utils/helper-functions/format-time-and-dates";
import { BeWellClassCardConfirmationModal } from "@/app/ui/be-well-class-card-confirmation-modal/be-well-class-card-confirmation-modal";
import { Chase } from "react-native-animated-spinkit";

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
      sendNotification(selectedClass, 19); // todo: this needs to be user id
      refreshNotifications();
    }
  };

  return (
    <BeWellBackground scrollable>
      <CSS.BusinessCardContainer>
        <BusinessCard item={business} width="100%" height="200px" disabled />
      </CSS.BusinessCardContainer>

      {classes.length > 0 && <CSS.HeaderText>Classes</CSS.HeaderText>}

      {isLoading ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 2 }}
        >
          <Chase size={48} color={Colors.dark.secondary} />
        </View>
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

      <BeWellClassCardConfirmationModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        confirmation={showConfirmation}
        onConfirm={handleConfirm}
        title={selectedClass?.name || ""}
        description={selectedClass?.description || ""}
        instructor={selectedClass?.instructor || ""}
        address={`${business.address}, ${selectedClass?.location || ""}`}
        date={selectedClass ? formattedStartDate(selectedClass.startDate) : ""}
        duration={selectedClass ? formatDuration(selectedClass.duration) : ""}
      />
    </BeWellBackground>
  );
}
