import { Business } from "@/app/contexts/BusinessContext";
import * as CSS from "./styles";

export const BusinessCard = ({ item }: { item: Business }) => {
  return (
    <CSS.Container>
      <CSS.SampleImage/>
        <CSS.CardTitle>{item.name}</CSS.CardTitle>
        <CSS.CardText>{item.address}</CSS.CardText>
        <CSS.CardText>{item.description}</CSS.CardText>
        <CSS.CardText>{item.phoneNumber}</CSS.CardText>
    </CSS.Container>
  );
};
