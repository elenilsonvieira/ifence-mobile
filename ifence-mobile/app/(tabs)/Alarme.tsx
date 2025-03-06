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
import { obterCercas } from "../../components/Cercas/storage/cercaStorage";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Alarme = () => {
  const [cercas, setCercas] = useState([]);
  const [cercaSelecionada, setCercaSelecionada] = useState(null);
  const [point2, setPoint2] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCercas = async () => {
    try {
      setLoading(true);
      const cercasObtidas = await obterCercas();
      setCercas(
        cercasObtidas.map((cerca) => ({
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

  useEffect(() => {
    if (cercas.length > 0) {
      const { cercaId } = router.query || {};
      const cerca = cercas.find((c) => c.id === cercaId);
      if (cerca) {
        setCercaSelecionada(cerca);
      }
    }
  }, [cercas, router.query]);

  const salvarLocalizacao = async (novaLocalizacao) => {
    if (!cercaSelecionada) return;
  
    const chave = `localizacoes_${cercaSelecionada.id}`;
    const localizacoesSalvas = await AsyncStorage.getItem(chave);
    const localizacoesArray = localizacoesSalvas ? JSON.parse(localizacoesSalvas) : [];
    const novasLocalizacoes = [...localizacoesArray, novaLocalizacao];
  
    console.log("Salvando localização:", novaLocalizacao);
    console.log("Chave usada:", chave);
    await AsyncStorage.setItem(chave, JSON.stringify(novasLocalizacoes));
  };

  useEffect(() => {
    if (!cercaSelecionada) return;

    const interval = setInterval(() => {
      const maxDistance = 0.0015;
      const newLat =
        cercaSelecionada.latitude + (Math.random() - 0.2) * maxDistance;
      const newLon =
        cercaSelecionada.longitude + (Math.random() - 0.2) * maxDistance;
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

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
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

  const exibirToast = async (cerca, ativa) => {
    const novoAlarme = {
      nomeCerca: cerca.nome,
      timestamp: new Date().toLocaleString(),
    };

    // 
    const historicoSalvo = await AsyncStorage.getItem("historico_alarmes");
    const historicoArray = historicoSalvo ? JSON.parse(historicoSalvo) : [];
    historicoArray.push(novoAlarme);
    await AsyncStorage.setItem("historico_alarmes", JSON.stringify(historicoArray));

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
