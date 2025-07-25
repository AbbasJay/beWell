import React from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as CSS from "./styles/explore";
import { OptimizedImage } from "./ui/optimized-image";

const { width: screenWidth } = Dimensions.get("window");
const gridItemWidth = (screenWidth - 48 - 12) / 2; // 48px padding, 12px gap

const FILTERS = [
  { icon: "fitness-center", label: "Activity" },
  { icon: "schedule", label: "Time" },
  { icon: "place", label: "Location" },
  { icon: "person", label: "Instructor" },
];

const POPULAR_CLASSES = [
  {
    name: "Yoga",
    desc: "Relax and stretch",
    image: require("@/assets/images/home-gym.webp"),
  },
  {
    name: "Pilates",
    desc: "Core strengthening",
    image: require("@/assets/images/home-gym.webp"),
  },
  {
    name: "HIIT",
    desc: "High-intensity workout",
    image: require("@/assets/images/home-gym.webp"),
  },
  {
    name: "Zumba",
    desc: "Dance fitness",
    image: require("@/assets/images/home-gym.webp"),
  },
];

export default function ExplorePage() {
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
              <CSS.FilterChip key={filter.label}>
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
          <CSS.Grid>
            {POPULAR_CLASSES.map((item, idx) => (
              <CSS.GridItem key={item.name}>
                <TouchableOpacity activeOpacity={0.8}>
                  <OptimizedImage
                    source={null} // No real image source for these demo items
                    width={gridItemWidth}
                    height={gridItemWidth}
                    borderRadius={16}
                    placeholder={item.image}
                  />
                  <CSS.GridTextContainer>
                    <CSS.GridTitle>{item.name}</CSS.GridTitle>
                    <CSS.GridSubtitle>{item.desc}</CSS.GridSubtitle>
                  </CSS.GridTextContainer>
                </TouchableOpacity>
              </CSS.GridItem>
            ))}
          </CSS.Grid>
        </CSS.MainCard>
      </CSS.CardContainer>
    </CSS.OuterContainer>
  );
}
