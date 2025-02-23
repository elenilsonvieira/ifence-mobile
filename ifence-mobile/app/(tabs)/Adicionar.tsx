import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/Header";

const AdicionarPulseiraScreen = () => {
  const router = useRouter();
  const [nomePulseira, setNomePulseira] = useState("");
  const [pulseiras, setPulseiras] = useState<string[]>([]);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomePulseira, setNovoNomePulseira] = useState("");

  useEffect(() => {
    carregarPulseiras();
  }, []);

  const carregarPulseiras = async () => {
    const dados = await AsyncStorage.getItem("pulseiras");
    if (dados) {
      setPulseiras(JSON.parse(dados));
    }
  };

  const adicionarPulseira = async () => {
    if (nomePulseira.trim().length === 0) return;

    const novasPulseiras = [...pulseiras, nomePulseira];
    setPulseiras(novasPulseiras);
    await AsyncStorage.setItem("pulseiras", JSON.stringify(novasPulseiras));

    setNomePulseira("");
  };

  const iniciarEdicao = (index: number) => {
    setEditandoIndex(index);
    setNovoNomePulseira(pulseiras[index]);
  };

  const salvarEdicao = async () => {
    if (editandoIndex === null || novoNomePulseira.trim().length === 0) return;

    const novasPulseiras = [...pulseiras];
    novasPulseiras[editandoIndex] = novoNomePulseira;
    setPulseiras(novasPulseiras);
    await AsyncStorage.setItem("pulseiras", JSON.stringify(novasPulseiras));

    setEditandoIndex(null);
    setNovoNomePulseira("");
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setNovoNomePulseira("");
  };

  const deletarPulseira = async (index: number) => {
    const novasPulseiras = pulseiras.filter((_, i) => i !== index);
    setPulseiras(novasPulseiras);
    await AsyncStorage.setItem("pulseiras", JSON.stringify(novasPulseiras));
    setEditandoIndex(null);
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={26} color="#004A99" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.titulo}>Adicionar pulseira</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Nome da pulseira:</Text>
            <TextInput
              style={styles.input}
              value={nomePulseira}
              onChangeText={setNomePulseira}
            />
            <View style={styles.botoes}>
              <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={adicionarPulseira}
              >
                <Text style={styles.textoBotao}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => router.back()}
              >
                <Text style={styles.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.titulo}>Pulseiras Cadastradas:</Text>
          {pulseiras.map((item, index) => (
            <View key={index} style={styles.card}>
              {editandoIndex === index ? (
                <View style={styles.cardEdicao}>
                  <TextInput
                    style={styles.input}
                    value={novoNomePulseira}
                    onChangeText={setNovoNomePulseira}
                  />
                  <View style={styles.botoes}>
                    <TouchableOpacity
                      style={styles.botaoadd}
                      onPress={salvarEdicao}
                    >
                      <Text style={styles.textoBotaoedit}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.botaoCancell}
                      onPress={cancelarEdicao}
                    >
                      <Text style={styles.textoBotaoedit}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.botaoExcluir}
                      onPress={() => deletarPulseira(index)}
                    >
                      <Text style={styles.textoBotaoedit}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <Switch /> */}
                </View>
              ) : (
                <TouchableOpacity onPress={() => iniciarEdicao(index)}>
                  <Text style={styles.item}>{item}</Text>
                </TouchableOpacity>
              )}
              <Switch />
            </View>
          ))}
        </ScrollView>
      </View>
    </>
   
  );
};

const styles = StyleSheet.create({
  cardEdicao: {
    padding: 15,
    margin: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#004A99",
    backgroundColor: "#E3F2FD",
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF", // Fundo branco
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
    padding: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#004A99",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 20,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  botaoAdicionar: {
    backgroundColor: "#0078AE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  botaoCancelar: {
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  botaoadd: {
    backgroundColor: "#0078AE",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    maxWidth: 120,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10, // Espaçamento inferior em telas pequenas
  },

  botaoExcluir: {
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 10,
  },

  botaoCancell: {
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 6,
    flex: 1,
    maxWidth: 120,
    marginBottom: 10,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
  },

  textoBotaoedit: {
    color: "#fff",
    textAlign: 'center',
    fontSize: 11,
  },

  titulo: {
    fontSize: 27,
    fontWeight: "600",
    color: "#004A99",
    marginVertical: 10,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    padding: 10,
    // borderBottomWidth: 1,
  },
});

export default AdicionarPulseiraScreen;
