import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

type Localizacao = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

const ListarLocalizacoesPulseira = () => {
  const navigation = useNavigation();
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const { pulseiraId, cercaId } = useLocalSearchParams();
  const router = useRouter();
  console.log("Recebido pulseiraId:", pulseiraId, "e cercaId:", cercaId);

  useEffect(() => {
    // Remove o header padrão e aplica customização
    navigation.setOptions && navigation.setOptions({
      headerTitle: '',
      headerStyle: { backgroundColor: '#003F88', shadowColor: 'transparent', elevation: 0 },
      headerTintColor: '#fff',
    });
    const carregarLocalizacoes = async () => {
      const chave = `localizacoes_${pulseiraId}_${cercaId}`;
      const localizacoesSalvas = await AsyncStorage.getItem(chave);
      console.log("Carregando localizações para pulseira:", pulseiraId);
      console.log("Localizações carregadas:", localizacoesSalvas);
      if (localizacoesSalvas) {
        setLocalizacoes(JSON.parse(localizacoesSalvas));
      } else {
        console.log(
          "Nenhuma localização encontrada para a pulseira:",
          pulseiraId
        );
      }
    };
    carregarLocalizacoes();
  }, [pulseiraId, cercaId]);

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: '#003F88', padding: 18, alignItems: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Histórico de Localizações</Text>
      </View>
      <View style={{ height: 0.04 * (typeof window !== 'undefined' ? window.innerHeight : 800), minHeight: 16 }} />
      <ScrollView>
        {localizacoes.map((loc: Localizacao, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.localizacaoItem}
            onPress={() => {
              router.push({
                pathname: "/Screens/ListarRotasPulseiras",
                params: {
                  pulseiraId,
                  cercaId,
                  timestamp: loc.timestamp,
                },
              });
            }}
          >
            <Text style={styles.texto}>
              Latitude: {loc.latitude.toFixed(5)}
            </Text>
            <Text style={styles.texto}>
              Longitude: {loc.longitude.toFixed(5)}
            </Text>
            <Text style={styles.texto}>
              Data: {new Date(loc.timestamp).toLocaleString()}
            </Text>
            <Text style={[styles.texto, { fontSize: 13, color: '#FFD700', marginTop: 4 }]}>Toque para ver rota a partir deste ponto</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 24,
    color: "#004A99",
    fontWeight: "bold",
    marginBottom: 20,
  },
  localizacaoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    backgroundColor: '#003F88',
    borderRadius: 4
  },
  texto: {
    fontSize: 16,
    color: '#FFFFFF'
  },
});

export default ListarLocalizacoesPulseira;
