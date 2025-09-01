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
import MapView, { Marker, Circle, UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
// import { obterCercas } from "../../storage/cercaStorage"; // substituído por backend
import Toast from "react-native-toast-message";
import { addNotification } from "../../storage/notificationsStorage";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderBrand from "../../components/HeaderBrand";
import { spacing, moderateScale } from "../../utils/responsive";
import { useLocalizacoes } from "@/components/Localizacoes/hooks/useLocalizacoes";
import { usePulseiras } from "@/components/Pulseiras/hooks/usePulseiras";
import { useCercas as useCercasHook } from "@/components/Cercas/hooks/useCercas";
import Constants from "expo-constants";
import { Platform } from "react-native";

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
  // Backend: lista de cercas do servidor
  const { cercas: cercasBackend, loading: cercasLoading } = useCercasHook();
  const cercas: Cerca[] = (cercasBackend || []).map((c: any) => ({
    id: c.id,
    nome: c.nome,
    latitude: Number(c.latitude),
    longitude: Number(c.longitude),
    raio: Number(c.raio),
    horarioInicio: c.horarioInicio ?? undefined,
    horarioFim: c.horarioFim ?? undefined,
  })).filter(c => !Number.isNaN(c.latitude) && !Number.isNaN(c.longitude) && c.raio > 0);
  const [cercaSelecionada, setCercaSelecionada] = useState<Cerca | null>(null);
  const [point2, setPoint2] = useState<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { saveLocation } = useLocalizacoes();
  const { pulseiras } = usePulseiras();

  // Loading local acompanha o loading do hook de cercas
  useEffect(() => {
    setLoading(cercasLoading);
  }, [cercasLoading]);

  // Expo Router não tem 'query', então removendo esse uso
  // Se precisar selecionar uma cerca por id, use outro método

  const salvarLocalizacao = async (novaLocalizacao: { latitude: number; longitude: number; timestamp: string }) => {
    if (!cercaSelecionada) return;
    // Descobre pulseira vinculada à cerca (primeira que referencie esta cerca)
    const alvo = pulseiras.find(p => p.cercas?.some(c => String(c.id) === String(cercaSelecionada.id)));
    const pulseiraId = alvo?.id;
    // Tenta enviar ao backend; se falhar, mantém cache local como fallback
    const ok = pulseiraId ? await saveLocation({ pulseiraId, cercaId: cercaSelecionada.id, ...novaLocalizacao }) : false;
    if (!ok) {
      const chave = `localizacoes_${cercaSelecionada.id}`;
      const localizacoesSalvas = await AsyncStorage.getItem(chave);
      const localizacoesArray = localizacoesSalvas ? JSON.parse(localizacoesSalvas) : [];
      const novasLocalizacoes = [...localizacoesArray, novaLocalizacao];
      await AsyncStorage.setItem(chave, JSON.stringify(novasLocalizacoes));
    }
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
        // Salva notificação
        addNotification({
          id: `${cercaSelecionada.id}-${Date.now()}`,
          braceletName: 'Pulseira',
          fenceName: cercaSelecionada.nome,
          timestamp: new Date().toISOString(),
          message: `Pulseira "${cercaSelecionada.nome}" fora da cerca às ${new Date().toLocaleTimeString()}`,
          read: false,
        });
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <HeaderBrand />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.button} />
        </View>
      </View>
    );
  }

  if (!cercaSelecionada) {
    if (!loading && cercas.length === 0) {
      return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <HeaderBrand />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing(2) }}>
            <Text style={[styles.textSelecionar, { color: colors.subtitle }]}>Nenhuma cerca cadastrada no sistema.</Text>
            <View style={{ height: spacing(1.5) }} />
            <Button title="Cadastrar cerca" color={colors.button} onPress={() => router.push('/Screens/AddCerca')} />
          </View>
          <Toast />
        </View>
      );
    }
    return (
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <HeaderBrand />
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBrand />
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: cercaSelecionada.latitude,
          longitude: cercaSelecionada.longitude,
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
  textSelecionar: {
    marginTop: spacing(2),
    textAlign: "center",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  cercasList: {
    padding: spacing(2),
    flex: 1,
    gap: spacing(1.5),
  },
  text: {
    fontSize: moderateScale(14),
  },
  info: {
    position: "absolute",
    bottom: spacing(2),
    left: spacing(1.25),
    padding: spacing(1),
    borderRadius: moderateScale(8),
  },
});

export default Alarme;
