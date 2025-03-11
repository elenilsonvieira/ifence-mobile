import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const Historico = () => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorico = async () => {
    try {
      const historicoSalvo = await AsyncStorage.getItem("historico_alarmes");
      const historicoArray = historicoSalvo ? JSON.parse(historicoSalvo) : [];
      const historicoUnico = historicoArray.reduce((acc, curr) => {
        if (!acc.find((item) => item.nomeCerca === curr.nomeCerca)) {
          acc.push(curr);
        }
        return acc;
      }, []);
      setHistorico(historicoUnico);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao obter histórico:", error);
      setLoading(false);
    }
  };

  const limparHistorico = async () => {
    try {
      await AsyncStorage.removeItem("historico_alarmes");
      setHistorico([]);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistorico();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#003F88" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Histórico de Alarmes</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={limparHistorico}>
        <Text style={styles.deleteButtonText}>Deletar histórico</Text>
      </TouchableOpacity>
      <View style={styles.history}>
        {historico.length === 0 ? (
          <Text style={styles.noHistory}>Nenhum alarme registrado ainda.</Text>
        ) : (
          historico.map((alarme, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.textmap}>
                Alarme: {alarme.nomeCerca} - {alarme.timestamp}
              </Text>
              {/* <TouchableOpacity
                style={styles.deleteButton}
                onPress={}
              >
                <Text style={styles.deleteButtonText}>Deletar</Text>
              </TouchableOpacity> */}
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 25,
    color: "#003F88",
  },
  textmap:{
    color:'white'
  },
  history: {
    marginTop: 20,
    
  },
  historyItem: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 30,
    backgroundColor: "#003F88",
    padding: 25,
    marginVertical: 8,
    borderRadius: 18,
    
  },
  noHistory: {
    textAlign: "center",
    color: "#003F88",
  },
  deleteButton: {
    backgroundColor: "red",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    width:62,
    height:60,
    borderRadius: 88,
    color: "white",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
    top:4
    
  },
});

export default Historico;
