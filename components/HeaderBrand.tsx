import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HeaderBrand: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContent}>
        <Image
          source={require("../assets/images/pai-filho.png")}
          style={styles.logo}
          accessibilityLabel="Logo IFence pai e filho"
        />
        <Text style={styles.title}>IFence</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#003F88",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HeaderBrand;
