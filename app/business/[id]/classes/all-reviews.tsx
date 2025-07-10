import React, { useMemo } from "react";
import { ScrollView, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  useClassesContext,
  ClassesProvider,
} from "@/app/contexts/ClassesContext";
import { ReviewForm } from "../../../ui/class-reviews/ReviewForm";
import { ReviewsList } from "../../../ui/class-reviews/ReviewsList";

function AllReviewsContent() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { classes } = useClassesContext();
  const classItem = useMemo(
    () => classes.find((c) => c.id === Number(classId)),
    [classes, classId]
  );

  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        {classItem && (
          <>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#111714",
                marginBottom: 4,
                letterSpacing: 0.5,
                textAlign: "left",
              }}
              numberOfLines={2}
            >
              {classItem.name}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                color: "#444",
                marginBottom: 16,
                letterSpacing: 0.2,
                textAlign: "left",
              }}
              numberOfLines={3}
            >
              {classItem.description}
            </Text>
          </>
        )}
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111714",
              marginBottom: 10,
              textAlign: "right",
            }}
          >
            All Reviews
          </Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <ReviewForm />
      </View>
      <View style={{ height: 8 }} />
      <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <ReviewsList showAll />
      </View>
    </ScrollView>
  );
}

export default function AllReviewsScreen() {
  const { id: businessId } = useLocalSearchParams<{ id: string }>();
  if (!businessId) return null;
  return (
    <ClassesProvider businessId={Number(businessId)}>
      <AllReviewsContent />
    </ClassesProvider>
  );
}
