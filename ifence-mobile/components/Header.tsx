import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  return (
    <SafeAreaView style={styles.header}>
      <Text>
        <MaterialIcons name="escalator-warning" size={24} color={"#FFFFFF"} />
        <Text style={styles.textHeader}>IFence</Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#003F88",
    width: "100%",
    padding: 10,
  },
  textHeader: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    textAlign: "center"
  },
});

export default Header;
