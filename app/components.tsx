import { View, Text, ScrollView } from "react-native";
import styled from "styled-components/native";
import Button from "./ui/button/button";
import { BusinessCard } from "./ui/business-card/business-card";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import NotificationListItem from "./ui/notification-list-item/notification-list-item";
import { Business } from "@/app/contexts/BusinessContext";
import { Notification } from "@/app/utils/notification-types";

const mockBusiness: Business = {
  id: 1,
  name: "Jabbar Fitness",
  userId: 1,
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  country: "USA",
  zipCode: "94105",
  phoneNumber: "(555) 555-5555",
  email: "info@jabbarfitness.com",
  type: "Gym",
  description: "Strength, Conditioning",
  hours: "Mon-Fri",
};

const notifications: Array<{
  notification: Notification;
  messageAlert: string;
}> = [
  {
    notification: {
      id: 1,
      createdAt: new Date().toISOString(),
      businessId: 1,
      classId: 1,
      message: "New class available",
      userId: 1,
      read: false,
    },
    messageAlert: "New HIIT class starting next week!",
  },
  {
    notification: {
      id: 2,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      businessId: 1,
      classId: 2,
      message: "Booking confirmed",
      userId: 1,
      read: true,
    },
    messageAlert: "Your yoga session is confirmed",
  },
  {
    notification: {
      id: 3,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      businessId: 1,
      classId: 3,
      message: "Special offer",
      userId: 1,
      read: false,
    },
    messageAlert: "50% off on annual membership!",
  },
  {
    notification: {
      id: 4,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      businessId: 1,
      classId: 4,
      message: "Class reminder",
      userId: 1,
      read: true,
    },
    messageAlert: "Your spinning class is tomorrow",
  },
  {
    notification: {
      id: 5,
      createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      businessId: 1,
      classId: 5,
      message: "New trainer",
      userId: 1,
      read: false,
    },
    messageAlert: "Welcome our new fitness trainer Sarah!",
  },
  {
    notification: {
      id: 6,
      createdAt: new Date(Date.now() - 2592000000).toISOString(), // 1 month ago
      businessId: 1,
      classId: 6,
      message: "Membership update",
      userId: 1,
      read: true,
    },
    messageAlert: "Your membership has been renewed",
  },
];

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
        <SectionTitle>Notification list item</SectionTitle>
        <SectionContent>
          {notifications.map(({ notification, messageAlert }) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              messageAlert={messageAlert}
              business={mockBusiness}
            />
          ))}
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
