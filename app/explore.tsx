import React, { useState } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as CSS from "./styles/explore";
import { OptimizedImage } from "./ui/optimized-image";
import { ClassesProvider, useClassesContext } from "./contexts/ClassesContext";
import { ClassesCard } from "./ui/classes-card";

const FILTERS = [
  { icon: "class", label: "Classes" },
  { icon: "fitness-center", label: "Activity" },
  { icon: "schedule", label: "Time" },
  { icon: "place", label: "Location" },
  { icon: "person", label: "Instructor" },
];

const businessId = 1;

function ExploreContent() {
  const { classes, isLoading } = useClassesContext();
  const [selectedFilter, setSelectedFilter] = useState("Classes");

  const filteredClasses =
    selectedFilter === "Classes"
      ? classes.filter((c) => c.classType || c.classTypeLabel)
      : classes;

  return (
    <CSS.OuterContainer>
      <CSS.CardContainer>
        <CSS.MainCard>
          <CSS.SearchContainer>
            <CSS.SearchBar>
              <MaterialIcons name="search" size={24} color="#648772" />
              <CSS.SearchInput
                placeholder="Search for classes or instructors"
                placeholderTextColor="#648772"
              />
            </CSS.SearchBar>
          </CSS.SearchContainer>
          <CSS.FilterRow horizontal showsHorizontalScrollIndicator={false}>
            {FILTERS.map((filter) => (
              <CSS.FilterChip
                key={filter.label}
                onPress={() => setSelectedFilter(filter.label)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={filter.icon as any}
                  size={20}
                  color="#111714"
                />
                <CSS.FilterChipText>{filter.label}</CSS.FilterChipText>
              </CSS.FilterChip>
            ))}
          </CSS.FilterRow>
          <CSS.SectionTitle>Popular classes</CSS.SectionTitle>
          <CSS.Grid style={{ flex: 1 }}>
            <FlatList
              data={filteredClasses}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={{ flex: 1, margin: 6 }}>
                  <ClassesCard item={item} />
                </View>
              )}
              ListEmptyComponent={
                <CSS.GridTextContainer
                  style={{ alignItems: "center", width: "100%", padding: 24 }}
                >
                  <CSS.GridTitle>No popular classes available</CSS.GridTitle>
                  <CSS.GridSubtitle>
                    Check back later for updates!
                  </CSS.GridSubtitle>
                </CSS.GridTextContainer>
              }
              refreshing={isLoading}
              contentContainerStyle={{ flexGrow: 1 }}
            />
          </CSS.Grid>
        </CSS.MainCard>
      </CSS.CardContainer>
    </CSS.OuterContainer>
  );
}

export default function ExplorePage() {
  return (
    <ClassesProvider businessId={businessId}>
      <ExploreContent />
    </ClassesProvider>
  );
}
