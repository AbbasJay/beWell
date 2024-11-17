import { View, Text, ScrollView } from "react-native";
import styled from "styled-components/native";
import Button from "./ui/button/button";
import { BusinessCard } from "./ui/business-card/business-card";
import { BeWellTabBar } from "@/components/bewellTabBar";
import { NavigationBar } from "./ui/navigation-bar/navigation-bar";
import NotificationListItem from "./ui/notification-list-item/notification-list-item";
import { mockBusinessCard } from "@/app/utils/components-data/business-card-data";
import {
  notifications,
  mockBusinessNotification,
} from "@/app/utils/components-data/notifications-data";

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
            item={mockBusinessCard[0]}
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
              business={mockBusinessNotification}
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
