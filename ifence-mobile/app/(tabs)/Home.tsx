import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Header from "@/components/Header";
import { Link } from "expo-router";
import HeaderHomeUser from "@/components/HeaderHomeUser";

const Home = () => {
  return (
    <>
      <HeaderHomeUser />
      <View style={styles.container}>
        <View style={styles.boxButtons}>
          <Link href={"/Screens/AddCerca"} asChild>
            <TouchableOpacity style={styles.btnBoxButtons}>
              <Ionicons name="map-outline" size={32} color="#fff" style={styles.iconBtn} />
              <Text style={styles.textBtnBoxButtons}>Adicionar Cerca</Text>
            </TouchableOpacity>
          </Link>

          <Link href={"/(tabs)/AdicionarPulseiraScreen"} asChild>
            <TouchableOpacity style={styles.btnBoxButtons}>
              <Ionicons name="watch-outline" size={32} color="#fff" style={styles.iconBtn} />
              <Text style={styles.textBtnBoxButtons}>Adicionar Pulseira</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  boxButtons: {
    flexDirection: "row",
    marginTop: 60,
    justifyContent: "center",
    gap: 10,
  },
  textBtnBoxButtons: {
    color: "#FFFFFF",
    fontSize: 17,
    textAlign: "center",
  },
  btnBoxButtons: {
    backgroundColor: "#003F88",
    padding: 10,
    borderRadius: 3,
    alignItems: "center",
    width: 140,
  },
  iconBtn: {
    marginBottom: 4,
  },
});

export default Home;
