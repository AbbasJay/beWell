import React, { useState } from "react";
import { TouchableOpacity, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { getInitials } from "../../utils/helper-functions/get-initials";
import { ActionSheet } from "../action-sheet/action-sheet";
import * as CSS from "./styles";

interface ProfileImageProps {
  userName: string;
  imageUri?: string;
  onImageChange: (uri: string | null) => void;
  size?: number;
  isLoading?: boolean;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  userName,
  imageUri,
  onImageChange,
  size = 128,
  isLoading = false,
}) => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return false;
      }
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to make this work!"
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    if (isLoading) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    if (isLoading) return;

    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const showImageOptions = () => {
    setShowActionSheet(true);
  };

  const actionSheetOptions = [
    {
      title: "Take Photo",
      icon: "camera-alt",
      onPress: takePhoto,
    },
    {
      title: "Choose from Library",
      icon: "photo-library",
      onPress: pickImage,
    },
    ...(imageUri
      ? [
          {
            title: "Remove Photo",
            icon: "delete",
            onPress: () => onImageChange(null),
            destructive: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <TouchableOpacity
        onPress={showImageOptions}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <CSS.ProfileImageWrapper size={size}>
          <CSS.ProfileImageContainer size={size}>
            {imageUri ? (
              <CSS.ProfileImageStyled source={{ uri: imageUri }} size={size} />
            ) : (
              <CSS.InitialsText size={size}>
                {getInitials(userName)}
              </CSS.InitialsText>
            )}
            {isLoading && (
              <CSS.LoadingOverlay size={size}>
                <MaterialIcons name="cloud-upload" size={24} color="white" />
              </CSS.LoadingOverlay>
            )}
          </CSS.ProfileImageContainer>
          <CSS.CameraButton onPress={showImageOptions} disabled={isLoading}>
            <MaterialIcons name="camera-alt" size={16} color="white" />
          </CSS.CameraButton>
        </CSS.ProfileImageWrapper>
      </TouchableOpacity>

      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        options={actionSheetOptions}
        title="Profile Picture"
      />
    </>
  );
};
