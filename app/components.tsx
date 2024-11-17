import { View, Text, ScrollView } from "react-native";
import styled from "styled-components/native";
import Button from "./ui/button/button";
import { BusinessCard } from "./ui/business-card/business-card";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";

export default function Components() {
  return (
    <Container>
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <SectionContent>
          <Button title="Primary" onPress={() => {}} />
          <Button title="Secondary" onPress={() => {}} variant="secondary" />
          <Button title="Tertiary" onPress={() => {}} variant="tertiary" />
          <Button title="Disabled" onPress={() => {}} disabled />
          <Button title="Small" onPress={() => {}} size="small" />
          <Button title="Medium" onPress={() => {}} size="medium" />
          <Button title="Large" onPress={() => {}} size="large" />
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Business Card</SectionTitle>
        <SectionContent>
          <BusinessCard
            fullWidth
            item={{
              userId: 1,
              name: "Example Business",
              address: "123 Main St",
              city: "Anytown",
              state: "CA",
              country: "USA",
              zipCode: "12345",
              phoneNumber: "(555) 555-5555",
              email: "example@example.com",
              type: "Restaurant",
              description: "Strength, Conditioning",
              hours: "Mon-Fri",
            }}
            onPress={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>BeWell tab bar</SectionTitle>
        <SectionContent>
          <BeWellTabBar />
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Navigation bar</SectionTitle>
        <SectionContent style={{ gap: 60 }}>
          <NavigationBar
            title="Title"
            subtitle="Subtitle"
            left={{ label: "Back", onPress: () => {} }}
            right={{ label: "Next", onPress: () => {} }}
          />
          <NavigationBar
            title="Title"
            subtitle="Subtitle"
            left={{ label: "Back", onPress: () => {} }}
            right={{ label: "Next", onPress: () => {} }}
          />
          <NavigationBar
            left={{ label: "Back", onPress: () => {} }}
            right={{ label: "Next", onPress: () => {} }}
          />
          <NavigationBar right={{ label: "Next", onPress: () => {} }} />
          <NavigationBar title="Title" />
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Icons</SectionTitle>
        <SectionContent
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <MaterialIcons name="calendar-today" size={32} color="#FF0099" />
          <MaterialIcons name="notifications" size={48} color="#4287f5" />
          <MaterialIcons name="person" size={24} color="#42f54b" />
          <MaterialIcons name="settings" size={56} color="#f5d442" />
          <MaterialIcons name="home" size={40} color="#f54242" />
          <MaterialIcons name="search" size={28} color="#9942f5" />
          <MaterialIcons name="menu" size={44} color="#42f5f5" />
          <MaterialIcons name="close" size={36} color="#f542aa" />
          <MaterialIcons name="chevron-right" size={20} color="#f58742" />
          <MaterialIcons name="chevron-left" size={52} color="#42f599" />
          <MaterialIcons name="chevron-left" size={16} color="#8bf542" />
          <MaterialIcons name="chevron-right" size={60} color="#f54263" />
          <MaterialIcons name="chevron-left" size={28} color="#4254f5" />
          <MaterialIcons name="favorite" size={44} color="#e63946" />
          <MaterialIcons name="star" size={32} color="#ffb703" />
          <MaterialIcons name="local-cafe" size={52} color="#bc6c25" />
          <MaterialIcons name="lightbulb" size={24} color="#ffd60a" />
          <MaterialIcons name="music-note" size={40} color="#7209b7" />
          <MaterialIcons name="pets" size={36} color="#fb8500" />
          <MaterialIcons name="local-pizza" size={48} color="#d62828" />
          <MaterialIcons name="beach-access" size={28} color="#00b4d8" />
          <MaterialIcons name="flight" size={56} color="#3a86ff" />
          <MaterialIcons name="local-florist" size={44} color="#2a9d8f" />
        </SectionContent>
      </Section>
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  padding: 10px 20px 40px 20px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  width: 100%;
  border-bottom-width: 4px;
  border-bottom-color: #000;
`;

const SectionContent = styled.View`
  display: flex;
  gap: 20px;
`;
