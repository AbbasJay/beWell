import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useBusinessContext, Business } from "@/app/contexts/BusinessContext";
import { useNotificationsContext } from "@/app/contexts/NotificationsContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/app/contexts/auth/AuthContext";
import {
  ClassesProvider,
  useClassesContext,
  Class,
} from "@/app/contexts/ClassesContext";
import { BeWellBackground } from "@/app/ui/be-well-background/be-well-background";
import { BusinessCard } from "@/app/ui/business-card/business-card";
import { ClassesCard } from "@/app/ui/classes-card";
import { LoadingSpinner } from "@/app/ui/loading-spinner";
import { ErrorMessage } from "@/app/ui/error-message";
import { BeWellClassCardConfirmationModal } from "@/app/ui/be-well-class-card-confirmation-modal/be-well-class-card-confirmation-modal";
import { useToast } from "@/app/contexts/ToastContext";
import {
  formattedStartDate,
  formatDuration,
} from "@/app/utils/helper-functions/format-time-and-dates";
import * as CSS from "./styles";

export default function BusinessClassesScreen() {
  const { businesses } = useBusinessContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [error, setError] = useState<Error | null>(null);
  const businessId = Number(id);

  // Handle invalid ID
  if (isNaN(businessId)) {
    setError(new Error("Invalid business ID"));
    return <ErrorMessage error={error} />;
  }

  const business = businesses.find((b) => b.id === businessId);

  if (!business) {
    setError(new Error("Business not found"));
    return <ErrorMessage error={error} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <ClassesProvider businessId={businessId}>
      <BusinessClasses business={business} />
    </ClassesProvider>
  );
}

interface BusinessClassesProps {
  business: Business;
}

function BusinessClasses({ business }: BusinessClassesProps) {
  const { classes, isLoading, error: classesError } = useClassesContext();
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const { refreshNotifications } = useNotificationsContext();
  const { sendNotification } = useNotifications();
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  if (isLoading) return <LoadingSpinner />;
  if (classesError) {
    setError(classesError);
    return <ErrorMessage error={error} />;
  }

  const handleClassPress = (classItem: Class) => {
    setError(null); // Clear any previous errors
    setSelectedClass(classItem);
    setModalVisible(true);
  };

  const handleBookClass = async () => {
    if (!selectedClass) return;

    if (!user) {
      setModalVisible(false);
      router.push("/logIn");
      return;
    }

    setIsBooking(true);
    try {
      await sendNotification(selectedClass);
      await refreshNotifications();
      setModalVisible(false);
      showToast(`Successfully booked ${selectedClass.name}!`, "success");
    } catch (err) {
      console.error(
        "Error booking class:",
        err instanceof Error ? err.message : "Unknown error"
      );
      setError(err instanceof Error ? err : new Error("Failed to book class"));
      showToast("Failed to book class", "error");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <BeWellBackground scrollable>
      {error && <ErrorMessage error={error} />}
      <CSS.BusinessCardContainer>
        <BusinessCard item={business} width="100%" height="200px" disabled />
      </CSS.BusinessCardContainer>

      {classes.length > 0 && <CSS.HeaderText>Available Classes</CSS.HeaderText>}

      {classes.map((classItem) => (
        <TouchableOpacity
          key={classItem.id}
          onPress={() => handleClassPress(classItem)}
        >
          <ClassesCard item={classItem} />
        </TouchableOpacity>
      ))}

      <BeWellClassCardConfirmationModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onConfirm={handleBookClass}
        title={selectedClass?.name ?? ""}
        description={selectedClass?.description ?? ""}
        instructor={selectedClass?.instructor ?? ""}
        address={`${business.address}, ${selectedClass?.location ?? ""}`}
        date={selectedClass ? formattedStartDate(selectedClass.startDate) : ""}
        duration={selectedClass ? formatDuration(selectedClass.duration) : ""}
        showLoginPrompt={!user}
      />
    </BeWellBackground>
  );
}
