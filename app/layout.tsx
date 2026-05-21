import { Stack } from "expo-router";
import { Appearance } from "react-native";

export default function Layout() {
  Appearance.setColorScheme('light'); // fuera del useEffect, se ejecuta en cada render

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: 'white' }
    }} />
  );
}