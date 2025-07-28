import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { useRouter} from "expo-router";
import MapView, { Marker, Circle } from "react-native-maps";
import { obterCercas } from "../../storage/cercaStorage";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Função utilitária para buscar todas pulseiras ativas associadas à cerca
const obterPulseirasAtivasPorCerca = async (cercaId: string | number) => {
  const pulseirasStr = await AsyncStorage.getItem("pulseiras");
  if (!pulseirasStr) return [];
  try {
    const pulseiras = JSON.parse(pulseirasStr);
    return pulseiras.filter((p: any) => p.cercaId == cercaId && p.ativa);
  } catch {
    return [];
  }
};

interface Cerca {
  id: string | number;
  nome: string;
  latitude: number;
  longitude: number;
  raio: number;
  horarioInicio?: string;
  horarioFim?: string;
}

const Alarme = () => {
  const [cercas, setCercas] = useState<Cerca[]>([]);
  const [cercaSelecionada, setCercaSelecionada] = useState<Cerca | null>(null);
  const [point2, setPoint2] = useState<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCercas = async () => {
    try {
      setLoading(true);
      const cercasObtidas = await obterCercas();
      setCercas(
        cercasObtidas.map((cerca: any) => ({
          ...cerca,
          latitude: parseFloat(cerca.latitude),
          longitude: parseFloat(cerca.longitude),
          raio: parseFloat(cerca.raio),
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Erro ao obter cercas:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCercas();
    }, [])
  );

  // Expo Router não tem 'query', então removendo esse uso
  // Se precisar selecionar uma cerca por id, use outro método

  // Salva localização para uma pulseira específica
  const salvarLocalizacaoPulseira = async (pulseiraId: string, novaLocalizacao: { latitude: number; longitude: number; timestamp: string }) => {
    if (!cercaSelecionada) return;
    const chave = `localizacoes_${pulseiraId}_${cercaSelecionada.id}`;
    const localizacoesSalvas = await AsyncStorage.getItem(chave);
    const localizacoesArray = localizacoesSalvas ? JSON.parse(localizacoesSalvas) : [];
    const novasLocalizacoes = [...localizacoesArray, novaLocalizacao];
    await AsyncStorage.setItem(chave, JSON.stringify(novasLocalizacoes));
  };

  useEffect(() => {
    if (!cercaSelecionada) return;
    let lastPoints: { [pulseiraId: string]: { latitude: number; longitude: number } } = {};
    const interval = setInterval(async () => {
      // Busca todas pulseiras ativas associadas à cerca
      const pulseirasAtivas = await obterPulseirasAtivasPorCerca(cercaSelecionada.id);
      if (!pulseirasAtivas.length) return;

      for (const pulseira of pulseirasAtivas) {
        // Cada pulseira simula seu próprio ponto
        const prev = lastPoints[pulseira.id] || { latitude: cercaSelecionada.latitude, longitude: cercaSelecionada.longitude };
        const maxDistance = 0.005;
        const newLat = prev.latitude + (Math.random() - 0.5) * maxDistance;
        const newLon = prev.longitude + (Math.random() - 0.5) * maxDistance;
        const novaLocalizacao = {
          latitude: newLat,
          longitude: newLon,
          timestamp: new Date().toISOString(),
        };
        lastPoints[pulseira.id] = { latitude: newLat, longitude: newLon };
        setPoint2(novaLocalizacao); // Exibe último ponto simulado (pode ser ajustado para exibir todos)
        await salvarLocalizacaoPulseira(pulseira.id, novaLocalizacao);
        const distance = getDistance(
          cercaSelecionada.latitude,
          cercaSelecionada.longitude,
          newLat,
          newLon
        );
        if (distance > cercaSelecionada.raio) {
          exibirToast(cercaSelecionada, false);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [cercaSelecionada]);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const exibirToast = (cerca: Cerca, ativa: boolean) => {
    Toast.show({
      type: "error",
      text1: ativa ? "Cerca Ativada" : "Criança fora da cerca!",
      text2: ativa
        ? `A cerca "${cerca.nome}" está ativa.`
        : `A criança saiu do raio da cerca "${cerca.nome}"!`,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!cercaSelecionada) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Tela de Alarme</Text>
        </View>
        <Text style={styles.textSelecionar}>
          Selecione uma cerca para visualizar.
        </Text>
        <View style={styles.cercasList}>
          {cercas.map((cerca) => (
            <Button
              key={cerca.id}
              title={cerca.nome}
              onPress={() => setCercaSelecionada(cerca)}
            />
          ))}
        </View>
        <Toast />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Tela de Alarme</Text>
      </View>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: cercaSelecionada.latitude,
          longitude: cercaSelecionada.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType="hybrid"
      >
        {cercas.map((cerca) => (
          <React.Fragment key={cerca.id}>
            <Circle
              center={{
                latitude: cerca.latitude,
                longitude: cerca.longitude,
              }}
              radius={cerca.raio}
              strokeWidth={2}
              strokeColor="rgba(0, 0, 255, 0.5)"
              fillColor="rgba(0, 0, 255, 0.2)"
            />
            <Marker
              coordinate={{
                latitude: cerca.latitude,
                longitude: cerca.longitude,
              }}
              title={cerca.nome}
            />
          </React.Fragment>
        ))}
        <Marker
          coordinate={{
            latitude: point2.latitude,
            longitude: point2.longitude,
          }}
          title="Criança"
          pinColor="blue"
        />
      </MapView>
      <View style={styles.info}>
        <Text style={styles.text}>Latitude: {point2.latitude.toFixed(5)}</Text>
        <Text style={styles.text}>
          Longitude: {point2.longitude.toFixed(5)}
        </Text>
        <Button title="Voltar" onPress={() => setCercaSelecionada(null)} />
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#003F88",
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  textSelecionar: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#003F88",
  },
  cercasList: {
    padding: 100,
    bottom: -50,
    flex: 1,
    gap: 30,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  info: {
    position: "absolute",
    bottom: 20,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderRadius: 8,
  },
});

export default Alarme;
