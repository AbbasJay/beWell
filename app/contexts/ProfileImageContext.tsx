import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { API_URL } from "../../env";
import * as FileSystem from "expo-file-system";

interface ProfileImageContextType {
  profileImageUri: string | null;
  uploadProfileImage: (imageUri: string) => Promise<void>;
  isLoading: boolean;
}

const ProfileImageContext = createContext<ProfileImageContextType | undefined>(
  undefined
);

export const ProfileImageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profileImageUri, setProfileImageUriState] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { tokens } = useAuth();

  useEffect(() => {
    if (tokens?.accessToken) {
      fetchProfileImage();
    }
  }, [tokens?.accessToken]);

  const fetchProfileImage = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/mobile/profile/upload-photo`,
        {
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfileImageUriState(data.photoUrl);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const uploadProfileImage = async (uri: string) => {
    setIsLoading(true);
    try {
      if (!tokens?.accessToken) throw new Error("No access token");

      // Read file as base64 using expo-file-system
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send as JSON payload
      const jsonData = {
        photo: base64,
        filename: "profile-photo.jpg",
        contentType: "image/jpeg",
      };

      const uploadResponse = await fetch(
        `${API_URL}/api/mobile/profile/upload-photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(
          `Upload failed with status: ${uploadResponse.status} - ${errorText}`
        );
      }

      const result = await uploadResponse.json();
      setProfileImageUriState(result.photoUrl);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileImageContext.Provider
      value={{
        profileImageUri,
        uploadProfileImage,
        isLoading,
      }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};

export const useProfileImage = () => {
  const context = useContext(ProfileImageContext);
  if (context === undefined) {
    throw new Error(
      "useProfileImage must be used within a ProfileImageProvider"
    );
  }
  return context;
};
