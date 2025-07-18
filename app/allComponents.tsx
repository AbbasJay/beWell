import React from "react";
import { View, ScrollView } from "react-native";
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
import { MaterialIcons } from "@expo/vector-icons";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Skeleton } from "react-native-skeletons";
import { BeWellText, BeWellTextVariant } from "./ui/be-well-text/be-well-text";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import { ClassesCard } from "./ui/classes-card";

export default function AllComponents() {
  return (
    <BeWellBackground scrollable>
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
              item={mockBusinessCard[0]}
              onPress={function (): void {
                throw new Error("Function not implemented.");
              }}
              imageIndex={0}
            />
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Classes Card</SectionTitle>
          <SectionContent>
            <ClassesCard
              item={{
                id: 1,
                businessId: 1,
                name: "Yoga Flow",
                description: "A relaxing yoga session for all levels",
                duration: 60,
                price: 15,
                instructor: "Sarah Johnson",
                location: "Studio A",
                startDate: new Date(Date.now() + 3600000).toISOString(),
                time: "10:00 AM",
                capacity: 20,
                slotsLeft: 8,
                createdAt: new Date(),
              }}
              onPress={() => {}}
              imageIndex={0}
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

        <Section>
          <SectionTitle>Loading spinner</SectionTitle>
          <SectionContent>
            <LoadingSpinner />
          </SectionContent>
        </Section>

        <Section style={{ gap: 60 }}>
          <SectionTitle>Skeleton</SectionTitle>
          <SectionContent>
            <Skeleton height={80} width="100%" />
            <Skeleton height={40} width="80%" />
            <Skeleton height={40} width="60%" />
            <Skeleton height={40} width="40%" />
            <Skeleton height={40} width="20%" />
          </SectionContent>
          <SectionContent>
            <Skeleton
              count={4}
              width={"100%"}
              height={14}
              color={"grey"}
              borderRadius={100}
            />
          </SectionContent>
          <SectionContent>
            <Skeleton width="100%" height={120} borderRadius={10} />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={{ flex: 1 }}>
                <Skeleton width={100} height={100} borderRadius={100} />
              </View>
              <View style={{ flex: 2, flexDirection: "column", gap: 10 }}>
                <Skeleton height={14} width="100%" />
                <Skeleton height={14} width="100%" />
                <Skeleton height={14} width="100%" />
              </View>
            </View>
            <Skeleton count={3} height={14} width="100%" />
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>BeWell Text</SectionTitle>
          <SectionContent>
            <BeWellText variant={BeWellTextVariant.Headline1}>Hello</BeWellText>
            <BeWellText variant={BeWellTextVariant.Headline2}>Hello</BeWellText>
            <BeWellText variant={BeWellTextVariant.Headline3}>Hello</BeWellText>
            <BeWellText variant={BeWellTextVariant.Headline4}>Hello</BeWellText>
            <BeWellText variant={BeWellTextVariant.Headline5}>Hello</BeWellText>
            <BeWellText variant={BeWellTextVariant.Headline6}>Hello</BeWellText>
            <BeWellText variant={BeWellTextVariant.TextMedium}>
              Hello
            </BeWellText>
            <BeWellText variant={BeWellTextVariant.TextMediumBold}>
              Hello
            </BeWellText>
            <BeWellText variant={BeWellTextVariant.TextSmall}>Hello</BeWellText>
            <BeWellText variant={BeWellTextVariant.TextSmallBold}>
              Hello
            </BeWellText>
            <BeWellText variant={BeWellTextVariant.TextXSmall}>
              Hello
            </BeWellText>
            <BeWellText variant={BeWellTextVariant.TextXSmallBold}>
              Hello
            </BeWellText>
          </SectionContent>
        </Section>
      </Container>
    </BeWellBackground>
  );
}

const Container = styled.View`
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
