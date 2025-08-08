import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { daltonicColors, defaultColors } from "../constants/DaltonicColors";
import { useRouter} from "expo-router";
import MapView, { Marker, Circle } from "react-native-maps";
import { obterCercas } from "../../storage/cercaStorage";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [daltonicMode, setDaltonicMode] = useState(false);
  const colors = daltonicMode ? daltonicColors : defaultColors;

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem('daltonicMode');
      if (value === 'true') setDaltonicMode(true);
    })();
  }, []);
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

  const salvarLocalizacao = async (novaLocalizacao: { latitude: number; longitude: number; timestamp: string }) => {
    if (!cercaSelecionada) return;
    const chave = `localizacoes_${cercaSelecionada.id}`;
    const localizacoesSalvas = await AsyncStorage.getItem(chave);
    const localizacoesArray = localizacoesSalvas ? JSON.parse(localizacoesSalvas) : [];
    const novasLocalizacoes = [...localizacoesArray, novaLocalizacao];
    await AsyncStorage.setItem(chave, JSON.stringify(novasLocalizacoes));
  };

  useEffect(() => {
    if (!cercaSelecionada) return;
    const interval = setInterval(() => {
      const maxDistance = 0.005;
      const newLat = cercaSelecionada.latitude + (Math.random() - 0.5) * maxDistance;
      const newLon = cercaSelecionada.longitude + (Math.random() - 0.5) * maxDistance;
      const novaLocalizacao = {
        latitude: newLat,
        longitude: newLon,
        timestamp: new Date().toISOString(),
      };
      setPoint2(novaLocalizacao);
      salvarLocalizacao(novaLocalizacao);
      const distance = getDistance(
        cercaSelecionada.latitude,
        cercaSelecionada.longitude,
        newLat,
        newLon
      );
      if (distance > cercaSelecionada.raio) {
        exibirToast(cercaSelecionada, false);
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
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <ActivityIndicator size="large" color={colors.button} />
      </View>
    );
  }

  if (!cercaSelecionada) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <View style={[styles.header, { backgroundColor: colors.header }] }>
          <Text style={[styles.textHeader, { color: colors.title }]}>Tela de Alarme</Text>
        </View>
        <Text style={[styles.textSelecionar, { color: colors.subtitle }] }>
          Selecione uma cerca para visualizar.
        </Text>
        <View style={styles.cercasList}>
          {cercas.map((cerca) => (
            <Button
              key={cerca.id}
              title={cerca.nome}
              color={colors.button}
              onPress={() => setCercaSelecionada(cerca)}
            />
          ))}
        </View>
        <Toast />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <View style={[styles.header, { backgroundColor: colors.header }] }>
        <Text style={[styles.textHeader, { color: colors.title }]}>Tela de Alarme</Text>
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
              strokeColor={colors.button}
              fillColor={colors.infoBox}
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
          pinColor={colors.button}
        />
      </MapView>
      <View style={[styles.info, { backgroundColor: colors.infoBox, borderColor: colors.border, borderWidth: 2 }] }>
        <Text style={[styles.text, { color: colors.infoText }]}>Latitude: {point2.latitude.toFixed(5)}</Text>
        <Text style={[styles.text, { color: colors.infoText }]}>Longitude: {point2.longitude.toFixed(5)}</Text>
        <Button title="Voltar" color={colors.button} onPress={() => setCercaSelecionada(null)} />
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  textSelecionar: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  cercasList: {
    padding: 100,
    bottom: -50,
    flex: 1,
    gap: 30,
  },
  text: {
    fontSize: 16,
  },
  info: {
    position: "absolute",
    bottom: 20,
    left: 10,
    padding: 10,
    borderRadius: 8,
  },
});

export default Alarme;
