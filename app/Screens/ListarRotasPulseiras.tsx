import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { obterCercas } from "@/storage/cercaStorage";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import HeaderBrand from "../../components/HeaderBrand";

type Localizacao = {
  latitude: number;
  longitude: number;
  timestamp: string;
};

interface Cerca {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  raio: number;
  horarioInicio?: string;
  horarioFim?: string;
}

const ListarRotasPulseiras = () => {
  const colors = useDaltonicColors();
  const { pulseiraId, cercaId, latitude, longitude, timestamp } = useLocalSearchParams();
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [cerca, setCerca] = useState<Cerca | null>(null);
  const [pulseiraNome, setPulseiraNome] = useState<string>("");

  // Carrega as localizações salvas e os dados da cerca
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const chaveLocalizacoes = `localizacoes_${cercaId}`;
        const localizacoesSalvas = await AsyncStorage.getItem(chaveLocalizacoes);
        if (localizacoesSalvas) {
          const arr = JSON.parse(localizacoesSalvas) as Localizacao[];
          setLocalizacoes(arr);
        }

        const cercasSalvas = await obterCercas();
        if (cercasSalvas) {
          const cercaEncontrada = (cercasSalvas as Cerca[]).find((c: Cerca) => c.id === cercaId);
          if (cercaEncontrada) {
            setCerca(cercaEncontrada);
          }
        }

        const pulseiraChave = `pulseira_${pulseiraId}`;
        const pulseiraSalva = await AsyncStorage.getItem(pulseiraChave);
        if (pulseiraSalva) {
          setPulseiraNome(pulseiraSalva);
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
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <ActivityIndicator size="large" color={colors.title} />
      </View>
    );
  }

  const coordenadasSelecionadas = latitude && longitude ? {
    latitude: parseFloat(latitude as string),
    longitude: parseFloat(longitude as string),
  } : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <HeaderBrand />
      <MapView
        style={{ flex: 1 }}
        initialRegion={coordenadasSelecionadas ? {
          ...coordenadasSelecionadas,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType="hybrid"
      >
        {localizacoes.map((localizacao, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: localizacao.latitude,
              longitude: localizacao.longitude,
            }}
            pinColor={colors.title}
            title={coordenadasSelecionadas && localizacao.latitude === coordenadasSelecionadas.latitude && localizacao.longitude === coordenadasSelecionadas.longitude ? "Ponto selecionado" : undefined}
            description={coordenadasSelecionadas && localizacao.latitude === coordenadasSelecionadas.latitude && localizacao.longitude === coordenadasSelecionadas.longitude ? `${pulseiraNome} esteve aqui às ${new Date(timestamp as string).toLocaleTimeString()}` : undefined}
          />
        ))}
        {coordenadasSelecionadas && (
          <Marker
            coordinate={coordenadasSelecionadas}
            pinColor={colors.button}
            title="Ponto selecionado"
            description={`${pulseiraNome} esteve aqui às ${new Date(timestamp as string).toLocaleTimeString()}`}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.background // agora controlado pelo hook
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    // color: colors.title // agora controlado pelo hook
  },
});

export default ListarRotasPulseiras;
