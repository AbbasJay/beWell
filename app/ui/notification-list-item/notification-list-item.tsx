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
      <CSS.LeftSection>
        <CSS.SampleImage
          source={require("@/assets/images/home-gym.webp")}
          resizeMode="cover"
        />
      </CSS.LeftSection>

      <CSS.MiddleSection>
        <CSS.MessageText>{messageAlert}</CSS.MessageText>
        <CSS.DateTimeText>
          {formatDateTime(notification.createdAt)}
        </CSS.DateTimeText>
      </CSS.MiddleSection>

      <CSS.RightSection>
        <CSS.TimeText>{formatGetTimeAgo(notification.createdAt)}</CSS.TimeText>
      </CSS.RightSection>
    </CSS.Container>
  );
}
