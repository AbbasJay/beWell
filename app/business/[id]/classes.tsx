import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, Image, ScrollView } from "react-native";
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
import { ClassesCard } from "@/app/ui/classes-card";
import { LoadingSpinner } from "@/app/ui/loading-spinner";
import { ErrorMessage } from "@/app/ui/error-message";
import { useToast } from "@/app/contexts/ToastContext";
import {
  formattedStartDate,
  formatDuration,
  formatDateTime,
} from "@/app/utils/helper-functions/format-time-and-dates";
import * as CSS from "./styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function BusinessClassesScreen() {
  const { businesses } = useBusinessContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [error, setError] = useState<Error | null>(null);
  const businessId = Number(id);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (isNaN(businessId)) {
      setError(new Error("Invalid business ID"));
      return;
    }
    const foundBusiness = businesses.find((b) => b.id === businessId);
    if (!foundBusiness) {
      setError(new Error("Business not found"));
      return;
    }

    setBusiness(foundBusiness);
    setError(null);
  }, [businessId, businesses]);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!business) {
    return <LoadingSpinner />;
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
  const { refreshNotifications } = useNotificationsContext();
  const { sendNotification } = useNotifications();
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (classesError) {
      setError(classesError);
    }
  }, [classesError]);

  useEffect(() => {
    return () => setError(null);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const handleClassPress = (classItem: Class) => {
    router.push(`/business/${business.id}/classes/${classItem.id}`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Today Section */}
      <Text
        style={{
          color: "#121714",
          fontSize: 18,
          fontWeight: "bold",
          letterSpacing: -0.3,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        Today
      </Text>
      {/* Classes List */}
      {classes.map((classItem, idx) => (
        <ClassesCard
          key={classItem.id}
          item={classItem}
          onPress={() => handleClassPress(classItem)}
          imageIndex={idx}
        />
      ))}
    </ScrollView>
  );
}
