import { Class } from "@/app/contexts/ClassesContext";
import BeWellIcons from "@/assets/icons/icons";
import * as CSS from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { formattedStartDate } from "@/app/utils/helper-functions/format-time-and-dates";

export const ClassesCard = ({ item }: { item: Class }) => {
  return (
    <CSS.Container key={item.id}>
      <CSS.Card>
        <CSS.CardIcon>
          <BeWellIcons name="myIcon" width={50} height={50} />
        </CSS.CardIcon>
        <CSS.CardInfo>
          <CSS.CardText isTitle>{item.name}</CSS.CardText>
          <CSS.CardText>
            <MaterialIcons name="calendar-month" size={14} color="grey" />
            <CSS.CardTitle>{formattedStartDate(item.startDate)}</CSS.CardTitle>
          </CSS.CardText>
          {/* 
          <CSS.CardText>
            <CSS.CardTitle>Description:</CSS.CardTitle> {item.description}
          </CSS.CardText> */}
          <CSS.CardText>
            <MaterialIcons name="timer" size={14} color="grey" />
            <CSS.CardTitle>{item.duration} minutes</CSS.CardTitle>
          </CSS.CardText>
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
