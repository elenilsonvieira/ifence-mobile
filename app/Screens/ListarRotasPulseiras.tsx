import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { obterCercas, type Cerca as StorageCerca } from "@/storage/cercaStorage";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import HeaderBrand from "../../components/HeaderBrand";
import { spacing, moderateScale } from "../../utils/responsive";
import Constants from "expo-constants";

type Localizacao = {
  latitude: number;
  longitude: number;
  timestamp: string;
};

// Usa o tipo de Cerca do storage para evitar conflitos de tipos

const ListarRotasPulseiras = () => {
  const colors = useDaltonicColors();
  const { pulseiraId, cercaId, latitude, longitude, timestamp } = useLocalSearchParams();
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [cerca, setCerca] = useState<StorageCerca | null>(null);
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
          const cercaEncontrada = (cercasSalvas as StorageCerca[]).find((c: StorageCerca) => c.id === String(cercaId));
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

  // Se uma cerca foi carregada e for necessário exibir seu centro em algum momento,
  // convertemos latitude/longitude para número aqui (mantendo o storage como string)
  const cercaCoords = cerca
    ? {
        latitude: Number(cerca.latitude) || 0,
        longitude: Number(cerca.longitude) || 0,
      }
    : null;

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
        provider={(
          (Constants.expoConfig as any)?.android?.config?.googleMaps?.apiKey ||
          (Constants.expoConfig as any)?.ios?.config?.googleMapsApiKey
        ) ? PROVIDER_GOOGLE : undefined}
      >
        {!(
          (Constants.expoConfig as any)?.android?.config?.googleMaps?.apiKey ||
          (Constants.expoConfig as any)?.ios?.config?.googleMapsApiKey
        ) && (
          (() => {
            const mapTilerKey = (Constants.expoConfig as any)?.extra?.MAPTILER_KEY;
            const cfgUrl = (Constants.expoConfig as any)?.extra?.MAP_TILES_URL as string | undefined;
            const url = cfgUrl || (mapTilerKey ? `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.png?key=${mapTilerKey}` : undefined);
            return url ? (
              <UrlTile urlTemplate={url} maximumZ={22} zIndex={-1} flipY={false} />
            ) : null;
          })()
        )}
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
  fontSize: moderateScale(18),
    textAlign: "center",
  marginTop: spacing(2.5),
    // color: colors.title // agora controlado pelo hook
  },
});

export default ListarRotasPulseiras;
