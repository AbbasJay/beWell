import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

export type ReviewType = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  likedCount: number;
  dislikedCount: number;
};

type Props = {
  review: ReviewType;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
};

export function Review({ review, onEdit, onDelete, showActions }: Props) {
  return (
    <Container>
      <Header>
        <Avatar source={{ uri: review.userAvatar }} />
        <Info>
          <Name>{review.userName}</Name>
          <Date>{review.createdAt}</Date>
        </Info>
      </Header>
      <Stars>
        {Array.from({ length: 5 }, (_, i) => (
          <MaterialIcons
            key={i}
            name={i < review.rating ? "star" : "star-border"}
            size={20}
            color={i < review.rating ? "#111714" : "#bccdc3"}
          />
        ))}
      </Stars>
      <Text>{review.comment}</Text>
      <ActionsRow>
        <ActionButton>
          <MaterialIcons name="thumb-up" size={20} color="#648772" />
          <ActionText>{review.likedCount}</ActionText>
        </ActionButton>
        <ActionButton>
          <MaterialIcons name="thumb-down" size={20} color="#648772" />
          <ActionText>{review.dislikedCount}</ActionText>
        </ActionButton>
        {showActions && (
          <View style={{ flexDirection: "row" }}>
            <ActionButton onPress={onEdit}>
              <MaterialIcons name="edit" size={20} color="#648772" />
              <ActionText>Edit</ActionText>
            </ActionButton>
            <ActionButton onPress={onDelete}>
              <MaterialIcons name="delete" size={20} color="#648772" />
              <ActionText>Delete</ActionText>
            </ActionButton>
          </View>
        )}
      </ActionsRow>
    </Container>
  );
}

const Container = styled.View`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
`;
const Info = styled.View``;
const Name = styled.Text`
  font-weight: bold;
  font-size: 16px;
`;
const Date = styled.Text`
  color: #888;
  font-size: 12px;
`;
const Stars = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;
const Text = styled.Text`
  font-size: 15px;
  margin-bottom: 8px;
`;
const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;
const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;
const ActionText = styled.Text`
  margin-left: 4px;
  color: #648772;
  font-size: 14px;
`;
