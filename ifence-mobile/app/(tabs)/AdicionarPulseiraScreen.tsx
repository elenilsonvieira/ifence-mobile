import React, { useCallback, useEffect, useState } from "react";
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
import { showToast } from "@/utils/toastUtils";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { obterCercas } from "@/components/Cercas/storage/cercaStorage";
import { useFocusEffect } from "@react-navigation/native";

type Pulseira = {
  id: string;
  nome: string;
  ativa: boolean;
  cercaId: string; // Associa a pulseira a uma cerca
};

type Cerca = {
  id: string;
  nome: string;
  latitude: string;
  longitude: string;
  raio: number;
};

const AdicionarPulseiraScreen = () => {
  const router = useRouter();
  const [nomePulseira, setNomePulseira] = useState("");
  const [pulseiras, setPulseiras] = useState<Pulseira[]>([]);
  const [cercas, setCercas] = useState<Cerca[]>([]); // Lista de cercas disponíveis
  const [cercaSelecionada, setCercaSelecionada] = useState<string>(""); // Cerca selecionada
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomePulseira, setNovoNomePulseira] = useState("");

  useFocusEffect(
    useCallback(() => {
      carregarPulseiras();
      carregarCercas();
    }, [])
  );

  const carregarPulseiras = async () => {
    const dados = await AsyncStorage.getItem("pulseiras");
    if (dados) {
      const pulseirasSalvas = JSON.parse(dados);
      const pulseirasComId = pulseirasSalvas.map((pulseira) => ({
        ...pulseira,
        id: pulseira.id || Date.now().toString(),
      }));
      setPulseiras(pulseirasComId);
    }
  };

  // Carregar cercas salvas
  const carregarCercas = async () => {
    // const dados = await AsyncStorage.getItem("cercas");
    const dados = await obterCercas();
    console.log("dados da cerca", dados);
    if (dados) {
      //   setCercas(JSON.parse(dados));
      setCercas(dados);
      console.log("Estado 'cercas' atualizado:", dados);
    }
  };

  // Adicionar uma nova pulseira
  const adicionarPulseira = async () => {
    if (nomePulseira.trim().length === 0 || !cercaSelecionada) {
      showToast(
        "error",
        "Erro",
        "Preencha o nome da pulseira e selecione uma cerca."
      );
      return;
    }

    const novaPulseira: Pulseira = {
      id: Date.now().toString(), // Gera um ID único
      nome: nomePulseira,
      ativa: false, // Estado inicial: desativada
      cercaId: cercaSelecionada, // Associa a pulseira à cerca selecionada
    };

    const novasPulseiras = [...pulseiras, novaPulseira];
    setPulseiras(novasPulseiras);
    await AsyncStorage.setItem("pulseiras", JSON.stringify(novasPulseiras));

    setNomePulseira("");
    setCercaSelecionada(""); // Limpa a seleção da cerca
    showToast("success", "Sucesso", "Pulseira adicionada com sucesso!");
  };

  // Editar uma pulseira existente
  const iniciarEdicao = (index: number) => {
    setEditandoIndex(index);
    setNovoNomePulseira(pulseiras[index].nome);
  };

  const salvarEdicao = async () => {
    if (editandoIndex === null || novoNomePulseira.trim().length === 0) return;

    const novasPulseiras = [...pulseiras];
    novasPulseiras[editandoIndex] = {
      ...novasPulseiras[editandoIndex],
      nome: novoNomePulseira,
    };
    setPulseiras(novasPulseiras);
    await AsyncStorage.setItem("pulseiras", JSON.stringify(novasPulseiras));

    setEditandoIndex(null);
    setNovoNomePulseira("");
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setNovoNomePulseira("");
  };

  // Deletar uma pulseira
  const deletarPulseira = async (index: number) => {
    const novasPulseiras = pulseiras.filter((_, i) => i !== index);
    setPulseiras(novasPulseiras);
    await AsyncStorage.setItem("pulseiras", JSON.stringify(novasPulseiras));
    setEditandoIndex(null);
  };

  // Alternar o estado da pulseira (ativa/inativa)
  const alternarSwitch = async (index: number, novoValor: boolean) => {
    const novasPulseiras = [...pulseiras];
    novasPulseiras[index] = { ...novasPulseiras[index], ativa: novoValor };
    setPulseiras(novasPulseiras);
    await AsyncStorage.setItem("pulseiras", JSON.stringify(novasPulseiras));

    showToast(
      "success",
      novoValor ? "Pulseira Ativada" : "Pulseira Desativada",
      novoValor
        ? `A pulseira "${novasPulseiras[index].nome}" está ativa.`
        : `A pulseira "${novasPulseiras[index].nome}" está desativada.`
    );
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
            <Text style={styles.label}>Selecione uma cerca:</Text>
            <Picker
              selectedValue={cercaSelecionada}
              onValueChange={(itemValue) => setCercaSelecionada(itemValue)}
            >
              <Picker.Item label="Selecione uma cerca" value="" />
              {cercas.map((cerca) => (
                <Picker.Item
                  key={cerca.id}
                  label={cerca.nome}
                  value={cerca.id}
                />
              ))}
            </Picker>
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
                </View>
              ) : (
                <TouchableOpacity onPress={() => iniciarEdicao(index)}>
                  <Text style={styles.item}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              <Switch
                value={item.ativa}
                onValueChange={(novoValor) => alternarSwitch(index, novoValor)}
                trackColor={{ false: "#767577", true: "#95d5b2" }}
                thumbColor={item.ativa ? "#52b788" : "#f4f3f4"}
              />
              <TouchableOpacity
                style={styles.botaoVerLocalizacoes}
                onPress={() => {
                  console.log(
                    "Navegando com pulseiraId:",
                    item.id,
                    "e cercaId:",
                    item.cercaId
                  );
                  //   router.push({
                  //     pathname: "/(tabs)/ListarLocalizacoesPulseira",
                  //     params: { pulseiraId: item.id, cercaId: item.cercaId },
                  //   });
                  router.push({
                        pathname: "/ListarLocalizacoesPulseira",
                        params: { pulseiraId: item.id, cercaId: item.cercaId },
                  });
                }}
              >
                <Text style={styles.textoBotaoVerLocalizacoes}>
                  Ver Localizações
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <Toast />
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
    backgroundColor: "#FFFFFF",
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
    borderRadius: 4,
  },
  botaoCancelar: {
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
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
    marginBottom: 10,
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
    textAlign: "center",
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
  },
  textoBotaoVerLocalizacoes: {
    color: "#004A99",
  },
});

export default AdicionarPulseiraScreen;
