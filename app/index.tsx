import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/themeContext";
import { Text, View, TouchableOpacity } from "react-native";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <Text style={{ color: textColor }}>
        Edit app/index.tsx to edit this screen.
      </Text>
      <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 20 }}>
        <Text style={{ color: textColor }}>
          Toggle Theme (Current: {theme})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
