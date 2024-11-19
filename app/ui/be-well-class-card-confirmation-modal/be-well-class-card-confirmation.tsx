import React from "react";
import * as CSS from "./styles";
import Button from "../button/button";

interface BeWellClassCardConfirmationProps {
  title: string;
  description: string;
  instructor?: string;
  address: string;
  date?: string;
  duration?: string;
  confirmation?: boolean;
}

export const BeWellClassCardConfirmation = ({
  title,
  description,
  instructor,
  address,
  date,
  duration,
  confirmation,
}: BeWellClassCardConfirmationProps) => {
  return (
    <CSS.Container>
      <CSS.TitleContainer>
        <CSS.Title>{title}</CSS.Title>
      </CSS.TitleContainer>
      <CSS.DetailTextWrapper>
        <CSS.Subtitle>Description:</CSS.Subtitle>
        <CSS.TextInfo>{description}</CSS.TextInfo>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <CSS.Subtitle>Instructor:</CSS.Subtitle>
        <CSS.TextInfo>{instructor}</CSS.TextInfo>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <CSS.Subtitle>Address:</CSS.Subtitle>
        <CSS.TextInfo>{address}</CSS.TextInfo>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <CSS.Subtitle>Date:</CSS.Subtitle>
        <CSS.TextInfo>{date}</CSS.TextInfo>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <CSS.Subtitle>Duration:</CSS.Subtitle>
        <CSS.TextInfo>{duration}</CSS.TextInfo>
      </CSS.DetailTextWrapper>
    </CSS.Container>
  );
};
