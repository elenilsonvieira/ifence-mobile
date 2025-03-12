import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const ListarLocalizacoesPulseira = () => {
  const { pulseiraId, cercaId } = useLocalSearchParams();
  const [localizacoes, setLocalizacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega as localizações salvas
  useEffect(() => {
    const carregarLocalizacoes = async () => {
      try {
        const chave = `localizacoes_${cercaId}`;
        const localizacoesSalvas = await AsyncStorage.getItem(chave);
        if (localizacoesSalvas) {
          setLocalizacoes(JSON.parse(localizacoesSalvas));
        }
      } catch (error) {
        console.error("Erro ao carregar localizações:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarLocalizacoes();
  }, [cercaId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#004A99" />
      </View>
    );
  }

  if (localizacoes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Nenhuma localização encontrada.</Text>
      </View>
    );
  }

  // Calcula a região inicial do mapa com base nas localizações
  const coordenadasIniciais = {
    latitude: localizacoes[0].latitude,
    longitude: localizacoes[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={coordenadasIniciais}
        mapType="hybrid"
      >
        {/* Desenha a rota percorrida */}
        <Polyline
          coordinates={localizacoes}
          strokeColor="#FF0000" 
          strokeWidth={3} 
        />

        {/* Marca o ponto inicial */}
        <Marker
          coordinate={{
            latitude: localizacoes[0].latitude,
            longitude: localizacoes[0].longitude,
          }}
          title="Início"
          pinColor="green"
        />

        {/* Marca o ponto final */}
        <Marker
          coordinate={{
            latitude: localizacoes[localizacoes.length - 1].latitude,
            longitude: localizacoes[localizacoes.length - 1].longitude,
          }}
          title="Fim"
          pinColor="red"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#004A99",
  },
});

export default ListarLocalizacoesPulseira;