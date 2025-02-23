import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
  SwitchComponent,
} from "react-native";
import {
  obterCercas,
  removerCercaStorage,
  salvarCerca,
} from "../../components/Cercas/storage/cercaStoragae";

import Header from "@/components/Header";
import { Link, useFocusEffect } from "expo-router";
import EditarCerca from "@/components/Cercas/EditarCerca";

const ListaCercas = () => {
  const [cercas, setCercas] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregarCercas();
    }, [])
  );


  const handleEditar = async (cercaEditada) => {
    await salvarCerca(cercaEditada);
    setCercas((prevCercas) =>
      prevCercas.map((cerca) =>
        cerca.id === cercaEditada.id ? cercaEditada : cerca
      )
    ); // Salva no armazenamento
  };

  const carregarCercas = async () => {
    const cercasSalvas = await obterCercas();
    setCercas(cercasSalvas || []);
  };

  const removerCerca = async (id: string) => {
    if (!id) {
      console.error("Erro: ID da cerca é indefinido!");
      return;
    }

    console.log("Removendo cerca com ID:", id);
    setCercas((prevCercas) => prevCercas.filter((cerca) => cerca.id !== id));

    await removerCercaStorage(id);
  };

  return (
    <>
      <Header />
      {/* <SwitchComponent></SwitchComponent> */}
      <View style={styles.container}>
        <Link href={"/(tabs)"} asChild>
          <TouchableOpacity style={styles.btnBackPage}>
            <Image source={require("@/assets/images/ArrowBack.png")} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.titulo}>Cercas Salvas</Text>
        
        <FlatList
          data={cercas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <EditarCerca
              cerca={item}
              onEditar={handleEditar}
              onExcluir={removerCerca}
            />
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
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 28,
    color: "#003F88",
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
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 5,
  },
  textInfoCerca: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#c1121f",
  },
  switch: {
    alignSelf: "flex-start",
  },
  btnBackPage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    // padding: 3,
    marginLeft: 0,
  },
});

export default ListaCercas;
