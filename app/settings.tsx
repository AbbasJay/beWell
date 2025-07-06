import React from "react";
import { useAuth } from "./contexts/auth/AuthContext";
import { router } from "expo-router";
import { BeWellBackground } from "./ui/be-well-background/be-well-background";
import Button from "./ui/button/button";
import { BeWellText, BeWellTextVariant } from "./ui/be-well-text/be-well-text";
import { MaterialIcons } from "@expo/vector-icons";
import { Container, Section } from "./styles/settings";

export default function Settings() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/logIn");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleViewComponents = () => {
    router.push("/allComponents");
  };

  return (
    <BeWellBackground>
      <Container>
        <Section>
          <BeWellText variant={BeWellTextVariant.Headline3}>
            Settings
          </BeWellText>
        </Section>

        <Section>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            fullWidth
            iconLeft={<MaterialIcons name="logout" size={24} color="black" />}
          />
        </Section>

        <Section>
          <Button
            title="View Components"
            onPress={handleViewComponents}
            variant="tertiary"
            fullWidth
            iconLeft={<MaterialIcons name="palette" size={24} color="black" />}
          />
        </Section>
      </Container>
    </BeWellBackground>
  );
}
