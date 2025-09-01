import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing, moderateScale } from "../utils/responsive";

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
  paddingHorizontal: spacing(2),
  paddingVertical: spacing(1.5),
  },
  logo: {
    width: moderateScale(28),
    height: moderateScale(28),
    resizeMode: "contain",
    marginRight: spacing(1.5 as any),
  },
  title: {
    color: "#FFFFFF",
  fontSize: moderateScale(20),
    fontWeight: "bold",
  },
});

export default HeaderBrand;
