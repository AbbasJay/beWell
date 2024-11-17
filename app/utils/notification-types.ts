export interface Notification {
  id: number;
  businessId: number;
  classId: number;
  message: string;
  userId: number;
  read: boolean;
  createdAt: string;
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadNotificationsCount: number;
  refreshNotifications: () => void;
}
