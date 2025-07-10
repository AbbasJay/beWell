import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as CSS from "./styles/explore";

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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoHYG6NJ9nPciQOufTeqB4Nn-oM2kv0c1UZMp3vZ5s-7RrwebCVNwpITkA2SFSMVC0w4V3625wj1sgIvTB68W7SaCH4bhztst3dCEkmA704mI62sl3ef0mOKfi-7Xzhf4hgYjcw-C3oraJ3Qu5QRg0-k4JMCBCid7yGkdKiNsU4X9kGRsdil7yjTDLbDFHKqpl5iG6CJo26lEY0raycv_s2EJWeaZADpfqPyeHnnem8vPIVvQri6e84tTqQx7W5hdmv7SHbr9LZmar",
  },
  {
    name: "Pilates",
    desc: "Core strengthening",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGGYtSP8nHk-K9yeWQlNtLQvcak0e6iY0RFnrQg240ccjgC3ERRILA9yxyTH3r2SkSexkWdlNxkmuitSYvvdX3tSkYGpRx-SpQXy9X6wG3OUnCnvd284PP2jS4QlJDkzcoEpJjB-0cVbL_hSyaluhmwQgk7n5t80SjscMsbEpLYhi9GKkuuj5kZUeiAbI-a-zFlmeMshC65UeOKyHb_-1QMmVGartfCG00DAtFWBU0YP7CvF9Zt0nYpZ1WpgQ-qqY_RiCnt_Du_Who",
  },
  {
    name: "HIIT",
    desc: "High-intensity workout",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJzUNqD_Po8aaK8KyF4B6hzrQNnyVJmAOeYBbKmgcaONcCwY4y1kfllQEe2cYM3d-h4UIg0Um7EDLzCHwk2jScNCup0icEGPOsZAVEljxSGb5KeBU3PP7o__HII57vqHLu8HyrEUQX1wxcbwE9fYhRPx8xlaP6a8oX52AiYuaaVBKRU1TViHU2G_36RB3yzisILpjx6JPUjw5wrNNDE0tzAOaZZvYuwoa6ONpm9S2OAO3xyLfGDqFKG2MsEqm_wXVYnUPFjx_bYrlt",
  },
  {
    name: "Zumba",
    desc: "Dance fitness",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqlhSfy4LbNySSvcIjXrIQ05Gp4iNBA8gd4hOlFR2QHqwtAgXZLc01tTOrlBFvKi75sKRJDvcvNhh_Nv-ugfLVDPVF2SXW8PH3nx2mZQTmEqIdxG_obYGR2Z9SHHH-yEUTnySe__hWZ7nS0IBcR8WNPtp1qaHn0dPzrcL38_lT-y0H3kVbK-9L2O1FQDat8W_nCnTEIVY4jtMpRvzwQhlnt2-obhua1jWLwbpeVUA6qdHrv2XIJW4VTf45SCzm7AEQTOR_TusmDonN",
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
                  <CSS.GridImage source={{ uri: item.image }} />
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
