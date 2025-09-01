export const options = {
  headerShown: false,
};
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import { useResponsiveDimensions } from "../../hooks/useResponsiveDimensions";
import HeaderBrand from "../../components/HeaderBrand";
import { spacing, moderateScale } from "../../utils/responsive";
import { usePulseiras } from "@/components/Pulseiras/hooks/usePulseiras";
import { useLocalizacoes } from "@/components/Localizacoes/hooks/useLocalizacoes";
import { useFocusEffect } from "@react-navigation/native";

type Localizacao = {
  latitude: number;
  longitude: number;
  timestamp: string;
};
const ListarLocalizacoesPulseira = () => {
  const colors = useDaltonicColors();
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const { pulseiraId, cercaId } = useLocalSearchParams();
  const { pulseiras } = usePulseiras();
  const router = useRouter();

  const { width } = useResponsiveDimensions();
  const itemGap = Math.max(8, Math.min(20, Math.round(width * 0.03))); // 3% da largura, entre 8 e 20px
  const { fetchLocations } = useLocalizacoes();
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const REFRESH_MS = 15000; // 15s

  const carregarLocalizacoes = useCallback(async () => {
      // 1) Determina cerca efetiva: usa param; se ausente, tenta descobrir pela pulseira
      let efetivaCercaId: string | undefined = typeof cercaId === 'string' && cercaId.length > 0 ? String(cercaId) : undefined;
      if (!efetivaCercaId && typeof pulseiraId === 'string') {
        const alvo = pulseiras.find(p => String(p.id) === String(pulseiraId));
        efetivaCercaId = alvo?.cercas?.[0]?.id ? String(alvo.cercas[0].id) : undefined;
      }
      // 2) Tenta no backend primeiro
      let backendData: Localizacao[] = [];
      if (typeof pulseiraId === 'string' && pulseiraId.length > 0) {
        backendData = await fetchLocations({ pulseiraId, cercaId: efetivaCercaId, limit: 200 });
      }
      if (backendData.length > 0) {
        setLocalizacoes(backendData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        return;
      }
      // 3) Fallback: monta chaves possíveis (back-compat, dados locais)
      const keys: string[] = [];
      if (efetivaCercaId) keys.push(`localizacoes_${efetivaCercaId}`);
      if (typeof pulseiraId === 'string' && pulseiraId.length > 0) {
        keys.push(`localizacoes_${pulseiraId}`);
        if (efetivaCercaId) keys.push(`localizacoes_${efetivaCercaId}_${pulseiraId}`);
      }
      if (keys.length === 0) return;
      // 4) Lê e mescla sem duplicar
      const acumulado: Localizacao[] = [];
      for (const k of keys) {
        try {
          const raw = await AsyncStorage.getItem(k);
          if (raw) {
            const arr = JSON.parse(raw) as Localizacao[];
            acumulado.push(...arr);
          }
        } catch {}
      }
      // 5) Ordena por timestamp desc e remove duplicatas por timestamp
      const seen = new Set<string>();
      const ordenado = acumulado
        .filter(item => {
          const t = item.timestamp;
          if (seen.has(t)) return false;
          seen.add(t);
          return true;
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLocalizacoes(ordenado);
  }, [pulseiraId, cercaId, pulseiras, fetchLocations]);

  useEffect(() => {
    carregarLocalizacoes();
  }, [carregarLocalizacoes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await carregarLocalizacoes(); } finally { setRefreshing(false); }
  }, [carregarLocalizacoes]);

  useFocusEffect(
    useCallback(() => {
      // inicia auto-refresh quando a tela ganha foco
      if (!refreshTimer.current) {
        refreshTimer.current = setInterval(() => {
          carregarLocalizacoes();
        }, REFRESH_MS);
      }
      return () => {
        if (refreshTimer.current) {
          clearInterval(refreshTimer.current);
          refreshTimer.current = null;
        }
      };
    }, [carregarLocalizacoes])
  );

  const abrirMapaComLocalizacao = (localizacao: Localizacao) => {
    router.push({
      pathname: "/Screens/ListarRotasPulseiras",
      params: {
        latitude: localizacao.latitude,
        longitude: localizacao.longitude,
        timestamp: localizacao.timestamp,
        cercaId, // Adicionado para garantir que o cercaId seja passado
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderBrand />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.titulo, { color: colors.title }]}>Histórico de Localizações da Pulseira</Text>
          <TouchableOpacity onPress={onRefresh} style={[styles.refreshButton, { borderColor: colors.border }]} accessibilityRole="button" accessibilityLabel="Atualizar lista">
            <Text style={{ color: colors.title, fontSize: moderateScale(18) }}>↓</Text>
          </TouchableOpacity>
        </View>
        {localizacoes.length === 0 && (
          <Text style={{ color: colors.subtitle, marginBottom: spacing(1) }}>
            Nenhuma localização encontrada ainda. Abra a tela de Alarme para iniciar a simulação, ou volte e selecione outra cerca.
          </Text>
        )}
        <FlatList
          data={localizacoes}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.localizacaoItem, { backgroundColor: colors.button, borderColor: colors.border }]}
              onPress={() => abrirMapaComLocalizacao(item)}
            >
              <Text style={[styles.texto, { color: colors.buttonText }] }>
                Latitude: {item.latitude.toFixed(5)}
              </Text>
              <Text style={[styles.texto, { color: colors.buttonText }] }>
                Longitude: {item.longitude.toFixed(5)}
              </Text>
              <Text style={[styles.texto, { color: colors.buttonText }] }>
                Data: {new Date(item.timestamp).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: itemGap }} />}
          contentContainerStyle={{ paddingBottom: itemGap }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  padding: spacing(2),
    // backgroundColor: "#FFFFFF", // agora controlado pelo hook
  },
  titulo: {
  fontSize: moderateScale(22),
    // color: "#004A99", // agora controlado pelo hook
    fontWeight: "bold",
  marginBottom: spacing(1.5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(1),
  },
  refreshButton: {
    paddingVertical: spacing(0.5),
    paddingHorizontal: spacing(1),
    borderRadius: moderateScale(6),
    borderWidth: 1,
  },
  localizacaoItem: {
  padding: spacing(1.5),
  borderRadius: moderateScale(8),
    borderWidth: 1,
  },
  texto: {
  fontSize: moderateScale(14),
    // color: '#FFFFFF' // agora controlado pelo hook
  },
});

export default ListarLocalizacoesPulseira;
