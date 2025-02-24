import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  obterCercas,
  removerCercaStorage,
  salvarCerca,
} from "../../components/Cercas/storage/cercaStorage";

import Header from "@/components/Header";
import { Link, useFocusEffect } from "expo-router";
import EditarCerca from "@/components/Cercas/EditarCerca";
import Toast from "react-native-toast-message";

const ListarCercas = () => {
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
    );
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

  const exibirToast = (cerca, ativa) => {
    Toast.show({
      type: "success", 
      text1: ativa ? "Cerca Ativada" : "Cerca Desativada", 
      text2: ativa
        ? `A cerca "${cerca.nome}" está ativa.`
        : `A cerca "${cerca.nome}" está desativada.`, 
      visibilityTime: 4000, 
      autoHide: true,
    });

  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Link href={"/(tabs)"} asChild>
          <TouchableOpacity style={styles.btnBackPage}>
            <Image source={require("@/assets/images/ArrowBack.png")} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.titulo}>Cercas Cadastradas</Text>

        <FlatList
          data={cercas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <EditarCerca
              cerca={item}
              onEditar={handleEditar}
              onExcluir={removerCerca}
              onAlternarSwitch={exibirToast}
            />
          )}
        />
      </View>
      <Toast />
    </>
  );
} 

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

export default ListarCercas;
