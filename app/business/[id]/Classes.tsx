import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ClassesProvider } from "@/app/contexts/ClassesContext";
import { useClassesContext } from "@/app/contexts/ClassesContext";
import { ClassesCard } from "@/app/ui/classes-card";
import { useBusinessContext } from "../../contexts/BusinessContext";

export default function Business() {
  const { businesses } = useBusinessContext();
  const { id } = useLocalSearchParams();
  const business = businesses.find((b) => b.id === Number(id));

  if (!business) {
    return <Text>No business data available</Text>;
  }

  return (
    <ClassesProvider businessId={business.id ?? 0}>
      <Classes />
    </ClassesProvider>
  );
}

function Classes() {
  const { classes } = useClassesContext();

  return classes.map((item) => <ClassesCard key={item.id} item={item} />);
}
