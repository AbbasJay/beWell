import { View, Text, ScrollView } from "react-native";
import styled from "styled-components/native";
import Button from "./ui/button/button";
import { BusinessCard } from "./ui/business-card/business-card";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";

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
          <BusinessCard fullWidth item={{
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
          }} onPress={function (): void {
            throw new Error("Function not implemented.");
          } } />
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
