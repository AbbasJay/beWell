import { Class } from "@/app/contexts/ClassesContext";
import * as CSS from "./styles";
import { BeWellIcons } from "@/assets/icons/icons";

export const ClassesCard = ({ item }: { item: Class }) => {
  const formattedStartDate = new Intl.DateTimeFormat("en-UK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(item.startDate));

  return (
    <CSS.Container key={item.id}>
      <CSS.Card>
        <CSS.CardIcon>
          <BeWellIcons name="gymIcon" />
        </CSS.CardIcon>
        <CSS.CardInfo>
          <CSS.CardText>
            <strong>Start Date:</strong> {formattedStartDate}
          </CSS.CardText>
          <CSS.CardText>
            <strong>Name:</strong> {item.name}
          </CSS.CardText>
          <CSS.CardText>
            <strong>Description:</strong> {item.description}
          </CSS.CardText>
          <CSS.CardText>
            <strong>Duration:</strong> {item.duration}
          </CSS.CardText>
          <CSS.CardText>
            <strong>Price:</strong> {item.price}
          </CSS.CardText>
          <CSS.CardText>
            <strong>Location:</strong> {item.location}
          </CSS.CardText>
        </CSS.CardInfo>
      </CSS.Card>
    </CSS.Container>
  );
};
