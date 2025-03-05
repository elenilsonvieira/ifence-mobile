import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const ListarLocalizacoesPulseira = () => {
  const [localizacoes, setLocalizacoes] = useState([]);
  const { pulseiraId, cercaId } = useLocalSearchParams();
  console.log("Recebido pulseiraId:", pulseiraId, "e cercaId:", cercaId);

  useEffect(() => {
    const carregarLocalizacoes = async () => {
      const chave = `localizacoes_${cercaId}`; 
      const localizacoesSalvas = await AsyncStorage.getItem(chave);
      console.log("Carregando localizações para pulseira:", pulseiraId);
      console.log("Localizações carregadas:", localizacoesSalvas);
      if (localizacoesSalvas) {
        setLocalizacoes(JSON.parse(localizacoesSalvas));
      } else {
        console.log(
          "Nenhuma localização encontrada para a pulseira:",
          pulseiraId
        );
      }
    };
    carregarLocalizacoes();
  }, [pulseiraId, cercaId]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Localizações da Pulseira</Text>
      <ScrollView>
        {localizacoes.map((loc, index) => (
          <View key={index} style={styles.localizacaoItem}>
            <Text style={styles.texto}>
              Latitude: {loc.latitude.toFixed(5)}
            </Text>
            <Text style={styles.texto}>
              Longitude: {loc.longitude.toFixed(5)}
            </Text>
            <Text style={styles.texto}>
              Data: {new Date(loc.timestamp).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 24,
    color: "#004A99",
    fontWeight: "bold",
    marginBottom: 20,
  },
  localizacaoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    backgroundColor: '#003F88',
    borderRadius: 4
  },
  texto: {
    fontSize: 16,
    color: '#FFFFFF'
  },
});

export default ListarLocalizacoesPulseira;
