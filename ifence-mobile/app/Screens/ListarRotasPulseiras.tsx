import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { obterCercas } from "@/storage/cercaStorage";

const ListarRotasPulseiras = () => {
  const { pulseiraId, cercaId } = useLocalSearchParams();
  const [localizacoes, setLocalizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cerca, setCerca] = useState(null);

  // Carrega as localizações salvas e os dados da cerca
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carrega as localizações
        const chaveLocalizacoes = `localizacoes_${cercaId}`;
        const localizacoesSalvas = await AsyncStorage.getItem(
          chaveLocalizacoes
        );
        if (localizacoesSalvas) {
          setLocalizacoes(JSON.parse(localizacoesSalvas));
        }

        const cercasSalvas = await obterCercas();
        if (cercasSalvas) {
          // const cercas = JSON.parse(cercasSalvas);
          const cercaEncontrada = cercasSalvas.find((c) => c.id === cercaId);
          if (cercaEncontrada) {
            setCerca(cercaEncontrada);
            console.log("Dados da cerca carregados:", cercaEncontrada); 
          } else {
            console.log("Cerca não encontrada para o ID:", cercaId);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
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

  // Função para exibir a mensagem ao clicar no marcador
  const exibirMensagem = (localizacao) => {

    if (!cerca) {
      console.log("Dados da cerca não disponíveis.");
      Alert.alert("Erro", "Dados da cerca não foram carregados.");
      return;
    }

    if (!localizacao.timestamp) {
      console.log("Horário não disponível.");
      Alert.alert("Erro", "Horário da localização não foi registrado.");
      return;
    }

    const hora = new Date(localizacao.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    Alert.alert(
      "Localização",
      `A criança "${cerca.nome}" esteve aqui às ${hora}.`
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={coordenadasIniciais}
        mapType="hybrid"
      >
        
        <Polyline
          coordinates={localizacoes}
          strokeColor="#FF0000" 
          strokeWidth={3} 
        />

        {/* Marcadores azuis para cada localização */}
        {localizacoes.map((localizacao, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: localizacao.latitude,
              longitude: localizacao.longitude,
            }}
            pinColor="blue"
            onPress={() => {
              exibirMensagem(localizacao);
            }}
            
          />
        ))}

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

export default ListarRotasPulseiras;
