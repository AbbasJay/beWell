import { Class } from "@/app/contexts/ClassesContext";
import BeWellIcons from "@/assets/icons/icons";
import * as CSS from "./styles";

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
          <BeWellIcons name="myIcon" />
        </CSS.CardIcon>
        <CSS.CardInfo>
          <CSS.CardText>
            <CSS.CardTitle>Start Date:</CSS.CardTitle> {formattedStartDate}
          </CSS.CardText>
          <CSS.CardText>
            <CSS.CardTitle>Name:</CSS.CardTitle> {item.name}
          </CSS.CardText>
          <CSS.CardText>
            <CSS.CardTitle>Description:</CSS.CardTitle> {item.description}
          </CSS.CardText>
          <CSS.CardText>
            <CSS.CardTitle>Duration:</CSS.CardTitle> {item.duration}
          </CSS.CardText>
          <CSS.CardText>
            <CSS.CardTitle>Price:</CSS.CardTitle> {item.price}
          </CSS.CardText>
          <CSS.CardText>
            <CSS.CardTitle>Location:</CSS.CardTitle> {item.location}
          </CSS.CardText>
        </CSS.CardInfo>
      </CSS.Card>
    </CSS.Container>
  );
};
