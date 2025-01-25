import { Class } from "@/app/contexts/ClassesContext";
import BeWellIcons from "@/assets/icons/icons";
import * as CSS from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import {
  formattedStartDate,
  formatDuration,
} from "@/app/utils/helper-functions/format-time-and-dates";
import { useState } from "react";
import { ErrorMessage } from "@/app/ui/error-message";

interface ClassesCardProps {
  item: Class;
  isFull?: boolean;
}

export const ClassesCard = ({ item, isFull = false }: ClassesCardProps) => {
  const [error, setError] = useState<Error | null>(null);

  if (!item) {
    setError(new Error("Class data is missing"));
    return <ErrorMessage error={error} />;
  }

  return (
    <CSS.Container key={item.id}>
      {error && <ErrorMessage error={error} />}
      <CSS.Card style={{ opacity: isFull ? 0.5 : 1 }}>
        <CSS.CardIcon>
          <BeWellIcons name="myIcon" width={50} height={50} />
        </CSS.CardIcon>
        <CSS.CardInfo>
          <CSS.CardText isTitle>{item.name}</CSS.CardText>
          <CSS.IconTextWrapper>
            <MaterialIcons name="calendar-month" size={14} color="grey" />
            <CSS.CardTitle>{formattedStartDate(item.startDate)}</CSS.CardTitle>
          </CSS.IconTextWrapper>
          {/* 
          <CSS.CardText>
            <CSS.CardTitle>Description:</CSS.CardTitle> {item.description}
          </CSS.CardText> */}
          <CSS.IconTextWrapper>
            <MaterialIcons name="timer" size={14} color="grey" />
            <CSS.CardTitle>{formatDuration(item.duration)}</CSS.CardTitle>
          </CSS.IconTextWrapper>
          <CSS.IconTextWrapper>
            <MaterialIcons name="person" size={14} color="grey" />
            <CSS.CardTitle>
              {isFull ? "Class Full" : `${item.slotsLeft} slots available`}
            </CSS.CardTitle>
          </CSS.IconTextWrapper>
          {/* <CSS.CardText>
            <CSS.CardTitle>Price:</CSS.CardTitle> {item.price}
          </CSS.CardText>
          <CSS.CardText>
            <CSS.CardTitle>Location:</CSS.CardTitle> {item.location}
          </CSS.CardText> */}
        </CSS.CardInfo>
      </CSS.Card>
    </CSS.Container>
  );
};
