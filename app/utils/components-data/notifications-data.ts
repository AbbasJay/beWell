import { Business } from "@/app/contexts/BusinessContext";
import { Notification } from "@/app/contexts/NotificationsContext";

export const notifications: Array<{
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
      createdAt: new Date(Date.now() - 3600000).toISOString(),
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
      createdAt: new Date(Date.now() - 86400000).toISOString(),
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
      createdAt: new Date(Date.now() - 172800000).toISOString(),
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
      createdAt: new Date(Date.now() - 604800000).toISOString(),
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
      createdAt: new Date(Date.now() - 2592000000).toISOString(),
      businessId: 1,
      classId: 6,
      message: "Membership update",
      userId: 1,
      read: true,
    },
    messageAlert: "Your membership has been renewed",
  },
];

export const mockBusinessNotification: Business = {
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
