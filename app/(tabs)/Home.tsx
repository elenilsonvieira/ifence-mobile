import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import Header from "@/components/Header";
import { Link } from "expo-router";
import HeaderHomeUser from "@/components/HeaderHomeUser";
import { useDaltonicColors } from "../hooks/useDaltonicColors";

const Home = () => {
  const colors = useDaltonicColors();
  return (
    <>
      <HeaderHomeUser />
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <View style={styles.boxButtons}>
          <Link href={"/(tabs)/ListarCercas"} asChild>
            <TouchableOpacity style={[styles.btnBoxButtons, { backgroundColor: "#003F88" }] }>
              <Ionicons name="map-outline" size={32} color="#FFFFFF" style={styles.iconBtn} />
              <Text style={[styles.textBtnBoxButtons, { color: "#FFFFFF" }]}>Adicionar Cerca</Text>
            </TouchableOpacity>
          </Link>

          <Link href={"/(tabs)/AdicionarPulseiraScreen"} asChild>
            <TouchableOpacity style={[styles.btnBoxButtons, { backgroundColor: "#003F88" }] }>
              <Ionicons name="watch-outline" size={32} color="#FFFFFF" style={styles.iconBtn} />
              <Text style={[styles.textBtnBoxButtons, { color: "#FFFFFF" }]}>Adicionar Pulseira</Text>
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
    // backgroundColor: "#FFFFFF", // agora controlado pelo hook
  },
  boxButtons: {
    flexDirection: "row",
    marginTop: 60,
    justifyContent: "center",
    gap: 10,
  },
  textBtnBoxButtons: {
    // color: "#FFFFFF", // agora controlado pelo hook
    fontSize: 17,
    textAlign: "center",
  },
  btnBoxButtons: {
    backgroundColor: "#003F88", // Alterado para azul
    padding: 10,
    borderRadius: 3,
    alignItems: "center",
    width: 140,
    justifyContent: "center", // Centralizar ícones
  },
  iconBtn: {
    marginBottom: 4,
    alignSelf: "center", // Centralizar ícones
  },
});

export default Home;
