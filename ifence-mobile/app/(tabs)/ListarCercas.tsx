import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { obterCercas } from "../../components/Cercas/storage/cercaStoragae";
// import { Header } from "react-native/Libraries/NewAppScreen";
import Header from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const ListaCercas = () => {
  const [cercas, setCercas] = useState<any[]>([]);

  useEffect(() => {
    carregarCercas();
  }, []);

  const carregarCercas = async () => {
    const cercasSalvas = await obterCercas();
    setCercas(cercasSalvas);
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text>Olá</Text>
        <Text style={styles.titulo}>Cercas Salvas</Text>

        <FlatList
          data={cercas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.textInfoCerca}>Latitude: {item.latitude}</Text>
              <Text style={styles.textInfoCerca}>Longitude: {item.longitude}</Text>
              <Text style={styles.textInfoCerca}>Raio: {item.raio} metros</Text>
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  item: {
    backgroundColor: "#003F88",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nome: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: "bold",
    marginBottom: 5,
  },
  textInfoCerca: {
    color: '#FFFFFF',
    fontSize: 16
  }
});

export default ListaCercas;
