import React from "react";
import { Business } from "@/app/contexts/BusinessContext";
import { Notification } from "@/app/utils/notification-types";
import {
  formatDateTime,
  formatGetTimeAgo,
} from "@/app/utils/helper-functions/format-time-and-dates";
import * as CSS from "./styles";

interface NotificationListItemProps {
  messageAlert?: string;
  notification: Notification;
  business?: Business;
}

export default function NotificationListItem({
  messageAlert,
  notification,
  business,
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
        <CSS.BusinessNameText>{business?.name}</CSS.BusinessNameText>
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
