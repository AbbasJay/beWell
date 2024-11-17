import React from "react";
import * as CSS from "./styles";
import { Notification } from "@/app/utils/notification-types";
import {
  formatGetTimeAgo,
  formatDateTime,
} from "@/app/utils/helper-functions/format-time-and-dates";

interface NotificationListItemProps {
  messageAlert?: string;
  notification: Notification;
}

export default function NotificationListItem({
  messageAlert,
  notification,
}: NotificationListItemProps) {
  return (
    <CSS.Container>
      <CSS.SampleImage
        source={require("@/assets/images/home-gym.webp")}
        resizeMode="cover"
      />
      <CSS.MessageText>{messageAlert}</CSS.MessageText>
      <CSS.TimeText>{formatDateTime(notification.createdAt)}</CSS.TimeText>
      <CSS.TimeText>{formatGetTimeAgo(notification.createdAt)}</CSS.TimeText>
    </CSS.Container>
  );
}
