import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { showToast } from "@/utils/toastUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { obterCercas } from "@/storage/cercaStorage";

type Localizacao = {
  latitude: number;
  longitude: number;
  timestamp: number;
};
type Cerca = {
  id: string;
  nome: string;
  latitude: string;
  longitude: string;
  raio: number;
};

const ListarRotasPulseiras = () => {
  const navigation = useNavigation();
  const { pulseiraId, cercaId, timestamp } = useLocalSearchParams();
  const [pulseiraNome, setPulseiraNome] = useState<string>("");
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [cerca, setCerca] = useState<Cerca | null>(null);

  // Carrega as localizações salvas e os dados da cerca
  useEffect(() => {
    // Remove o header padrão e aplica customização
    navigation.setOptions && navigation.setOptions({
      headerTitle: '',
      headerStyle: { backgroundColor: '#003F88', shadowColor: 'transparent', elevation: 0 },
      headerTintColor: '#fff',
    });
    const carregarDados = async () => {
      try {
        // Carrega as localizações da pulseira específica
        const chaveLocalizacoes = `localizacoes_${pulseiraId}_${cercaId}`;
        const localizacoesSalvas = await AsyncStorage.getItem(chaveLocalizacoes);
        if (localizacoesSalvas) {
          setLocalizacoes(JSON.parse(localizacoesSalvas));
        }

        const cercasSalvas = await obterCercas();
        if (cercasSalvas) {
          const cercaEncontrada = cercasSalvas.find((c: Cerca) => c.id === cercaId);
          if (cercaEncontrada) {
            setCerca(cercaEncontrada);
            console.log("Dados da cerca carregados:", cercaEncontrada); 
          } else {
            console.log("Cerca não encontrada para o ID:", cercaId);
          }
        }

        // Buscar nome da pulseira
        const pulseirasStr = await AsyncStorage.getItem("pulseiras");
        if (pulseirasStr) {
          const pulseiras = JSON.parse(pulseirasStr);
          const pulseira = pulseiras.find((p: any) => p.id === pulseiraId);
          if (pulseira) setPulseiraNome(pulseira.nome);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [cercaId, pulseiraId]);

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
  const exibirMensagem = (localizacao: Localizacao) => {

    if (!cerca) {
      console.log("Dados da cerca não disponíveis.");
      showToast("error", "Erro", "Dados da cerca não foram carregados.");
      return;
    }

    if (!localizacao.timestamp) {
      console.log("Horário não disponível.");
      showToast("error", "Erro", "Horário da localização não foi registrado.");
      return;
    }

    const hora = new Date(localizacao.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    Alert.alert(
      "Localização",
      `A pulseira "${pulseiraNome || '---'}" esteve aqui às ${hora}.`
    );
  };

  // Garante que timestamp seja number para comparação
  const timestampNumber = typeof timestamp === 'string' ? Number(timestamp) : Array.isArray(timestamp) ? Number(timestamp[0]) : undefined;

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: '#003F88', padding: 18, alignItems: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8, zIndex: 2 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Rota da Pulseira</Text>
      </View>
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
        {localizacoes.map((localizacao: Localizacao, index: number) => {
          let pinColor: "blue" | "green" | "gray" | "red" = "blue";
          const isSelecionado = timestampNumber !== undefined && localizacao.timestamp === timestampNumber;
          const isPrimeiro = index === 0;
          const isUltimo = index === localizacoes.length - 1;
          let markerTitle = undefined;
          if (isSelecionado) {
            pinColor = "green";
            markerTitle = "Ponto Selecionado";
          } else if (isUltimo) {
            pinColor = "red";
            markerTitle = `Cerca: ${cerca?.nome || ''}`;
          } else if (isPrimeiro) {
            pinColor = "gray";
          }
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: localizacao.latitude,
                longitude: localizacao.longitude,
              }}
              pinColor={pinColor}
              title={markerTitle}
              onPress={() => {
                exibirMensagem(localizacao);
              }}
            />
          );
        })}
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
