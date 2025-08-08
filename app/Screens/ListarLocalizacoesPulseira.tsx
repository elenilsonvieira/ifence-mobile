export const options = {
  headerShown: false,
};
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import { useResponsiveDimensions } from "../../hooks/useResponsiveDimensions";
import HeaderBrand from "../../components/HeaderBrand";

type Localizacao = {
  latitude: number;
  longitude: number;
  timestamp: string;
};
const ListarLocalizacoesPulseira = () => {
  const colors = useDaltonicColors();
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const { pulseiraId, cercaId } = useLocalSearchParams();
  const router = useRouter();

  const { width } = useResponsiveDimensions();
  const itemGap = Math.max(8, Math.min(20, Math.round(width * 0.03))); // 3% da largura, entre 8 e 20px

  useEffect(() => {
    const carregarLocalizacoes = async () => {
      const chave = `localizacoes_${cercaId}`; 
      const localizacoesSalvas = await AsyncStorage.getItem(chave);
      if (localizacoesSalvas) {
        setLocalizacoes(JSON.parse(localizacoesSalvas) as Localizacao[]);
      }
    };
    carregarLocalizacoes();
  }, [pulseiraId, cercaId]);

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
        <Text style={[styles.titulo, { color: colors.title }]}>Histórico de Localizações da Pulseira</Text>
        <FlatList
          data={localizacoes}
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
    padding: 20,
    // backgroundColor: "#FFFFFF", // agora controlado pelo hook
  },
  titulo: {
    fontSize: 24,
    // color: "#004A99", // agora controlado pelo hook
    fontWeight: "bold",
    marginBottom: 20,
  },
  localizacaoItem: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  texto: {
    fontSize: 16,
    // color: '#FFFFFF' // agora controlado pelo hook
  },
});

export default ListarLocalizacoesPulseira;
