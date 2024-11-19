import React from "react";
import { Modal } from "react-native";
import { BeWellClassCardConfirmation } from "./be-well-class-card-confirmation";
import * as CSS from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../button/button";

interface BeWellClassCardConfirmationModalProps {
  visible: boolean;
  onRequestClose: () => void;
  confirmation?: boolean;
  onConfirm: () => void;
  title: string;
  description: string;
  instructor: string;
  address: string;
  date: string;
  duration: string;
}

export const BeWellClassCardConfirmationModal = ({
  visible,
  onRequestClose,
  confirmation,
  onConfirm,
  title,
  description,
  instructor,
  address,
  date,
  duration,
}: BeWellClassCardConfirmationModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <CSS.ModalBackground>
        <CSS.ModalContainer>
          <CSS.ModalCloseIcon onPress={onRequestClose}>
            <MaterialIcons name="close" size={24} color="black" />
          </CSS.ModalCloseIcon>
          <CSS.TitleContainer>
            <CSS.Title>{title}</CSS.Title>
          </CSS.TitleContainer>
          <BeWellClassCardConfirmation
            title={title}
            description={description}
            address={address}
            date={date}
            duration={duration}
            instructor={instructor}
            confirmation={confirmation}
          />
          <CSS.ButtonContainer>
            <Button
              title={confirmation ? "Close" : "Confirm"}
              onPress={confirmation ? onRequestClose : onConfirm}
            />
          </CSS.ButtonContainer>
        </CSS.ModalContainer>
      </CSS.ModalBackground>
    </Modal>
  );
};
