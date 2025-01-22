import React from "react";
import * as CSS from "./styles";
import Button from "../button/button";
import { BeWellText, BeWellTextVariant } from "../be-well-text/be-well-text";

interface BeWellClassCardConfirmationProps {
  title: string;
  description: string;
  instructor?: string;
  address: string;
  date?: string;
  duration?: string;
}

export const BeWellClassCardConfirmation = ({
  title,
  description,
  instructor,
  address,
  date,
  duration,
}: BeWellClassCardConfirmationProps) => {
  return (
    <CSS.Container>
      <CSS.DetailTextWrapper>
        <BeWellText variant={BeWellTextVariant.Headline5}>
          You are about to join {title}
        </BeWellText>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <BeWellText variant={BeWellTextVariant.TextMediumBold}>
          Description:
        </BeWellText>
        <BeWellText variant={BeWellTextVariant.TextSmall}>
          {description}
        </BeWellText>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <BeWellText variant={BeWellTextVariant.TextMediumBold}>
          Instructor:
        </BeWellText>
        <BeWellText variant={BeWellTextVariant.TextSmall}>
          {instructor}
        </BeWellText>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <BeWellText variant={BeWellTextVariant.TextMediumBold}>
          Address:
        </BeWellText>
        <BeWellText variant={BeWellTextVariant.TextSmall}>{address}</BeWellText>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <BeWellText variant={BeWellTextVariant.TextMediumBold}>
          Date:
        </BeWellText>
        <BeWellText variant={BeWellTextVariant.TextSmall}>{date}</BeWellText>
      </CSS.DetailTextWrapper>

      <CSS.DetailTextWrapper>
        <BeWellText variant={BeWellTextVariant.TextMediumBold}>
          Duration:
        </BeWellText>
        <BeWellText variant={BeWellTextVariant.TextSmall}>
          {duration}
        </BeWellText>
      </CSS.DetailTextWrapper>
    </CSS.Container>
  );
};
