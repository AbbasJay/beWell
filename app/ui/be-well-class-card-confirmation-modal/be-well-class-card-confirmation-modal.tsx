import React, { useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { BeWellClassCardConfirmation } from "./be-well-class-card-confirmation";
import * as CSS from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../button/button";
import { theme } from "@/constants/theme";
import { BeWellText, BeWellTextVariant } from "../be-well-text/be-well-text";

interface BeWellClassCardConfirmationModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => Promise<void>;
  confirmation: boolean;
  title: string;
  description: string;
  instructor: string;
  address: string;
  date: string;
  duration: string;
}

export const BeWellClassCardConfirmationModal: React.FC<
  BeWellClassCardConfirmationModalProps
> = ({
  visible,
  onRequestClose,
  onConfirm,
  confirmation,
  title,
  description,
  instructor,
  address,
  date,
  duration,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsLoading(false);
      onRequestClose();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <CSS.ModalContainer>
        <CSS.ModalContent>
          <CSS.ModalTopSection>
            <BeWellText variant={BeWellTextVariant.Headline3}>
              {title}
            </BeWellText>
            <TouchableOpacity hitSlop={10} onPress={onRequestClose}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </CSS.ModalTopSection>

          {!confirmation ? (
            <BeWellClassCardConfirmation
              title={title}
              description={description}
              address={address}
              date={date}
              duration={duration}
              instructor={instructor}
              confirmation={confirmation}
            />
          ) : (
            <CSS.ConfirmContainer>
              <MaterialIcons
                name="check-circle"
                size={100}
                color={theme.status.success}
              />
              <BeWellText variant={BeWellTextVariant.TextMediumBold} textCenter>
                Thank you for joining the class! Enjoy!
              </BeWellText>
            </CSS.ConfirmContainer>
          )}

          <CSS.ButtonContainer>
            <Button
              fullWidth
              variant="secondary"
              title={isLoading ? "Confirming..." : "Confirm"}
              onPress={handleConfirm}
              disabled={isLoading}
            />
          </CSS.ButtonContainer>
        </CSS.ModalContent>
      </CSS.ModalContainer>
    </Modal>
  );
};
