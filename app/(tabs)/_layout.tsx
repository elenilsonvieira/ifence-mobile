import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // Esconde completamente a barra de abas
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            display: "none",
          },
          default: { display: "none" },
        }),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AdicionarPulseiraScreen"
        options={{
          title: "Pulseiras",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("@/assets/images/image.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ListarCercas"
        options={{
          title: "Cercas",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("@/assets/images/TablerFenceFilled.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Alarme"
        options={{
          title: "Monitorar cercas",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("@/assets/images/MaterialSymbolsEyeTrackingOutline.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
