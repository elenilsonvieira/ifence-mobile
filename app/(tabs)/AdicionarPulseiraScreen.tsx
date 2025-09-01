import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import Header from "@/components/Header";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { useCercas } from "../../components/Cercas/hooks/useCercas";
import { usePulseiras } from "@/components/Pulseiras/hooks/usePulseiras";
import api, { authApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { spacing, moderateScale } from "../../utils/responsive";

// Lista e operações de pulseiras agora vêm do backend via hook usePulseiras

const AdicionarPulseiraScreen: React.FC = () => {
  const router = useRouter();
  const colors = useDaltonicColors();
  const [nomePulseira, setNomePulseira] = useState("");
  const { pulseiras: pulseirasApi, addPulseira: addPulseiraApi, updatePulseira: updatePulseiraApi, deletePulseira: deletePulseiraApi, refresh: refreshPulseiras } = usePulseiras();
  const [cercaSelecionada, setCercaSelecionada] = useState<string>("");
  // Buscar cercas reais do sistema
  const { cercas } = useCercas();
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomePulseira, setNovoNomePulseira] = useState("");
  const [cercaEdicaoSelecionada, setCercaEdicaoSelecionada] = useState<string>("");

  // Funções de manipulação
  const adicionarPulseira = async () => {
    if (!nomePulseira || !cercaSelecionada) {
      Toast.show({ type: "error", text1: "Preencha todos os campos!" });
      return;
    }
    try {
      // 1) Cria a pulseira no backend
      const criada = await addPulseiraApi({ nome: nomePulseira });
      if (!criada) throw new Error("Falha ao criar pulseira");
      // 2) Vincula à cerca
      try {
        await api.post(`/fences/registerBracelet`, null, { params: { fence: Number(cercaSelecionada), bracelet: criada.id } });
      } catch (err: any) {
        if (err?.response?.status === 404) {
          await authApi.post(`/fences/registerBracelet`, null, { params: { fence: Number(cercaSelecionada), bracelet: criada.id } });
        } else {
          throw err;
        }
      }
  // Refaz listagem para refletir vínculo
  await refreshPulseiras();
  setNomePulseira("");
  setCercaSelecionada("");
      Toast.show({ type: "success", text1: "Pulseira adicionada e vinculada!" });
    } catch (e: any) {
      const msg = e?.response?.data ? String(e.response.data) : e?.message;
      Toast.show({ type: "error", text1: msg || "Erro ao adicionar pulseira" });
    }
  };

  const iniciarEdicao = (index: number) => {
    setEditandoIndex(index);
    setNovoNomePulseira(pulseirasApi[index]?.nome ?? "");
  // Seleciona a primeira cerca vinculada, se houver, para edição
  const fenceId = pulseirasApi[index]?.cercas?.[0]?.id;
  setCercaEdicaoSelecionada(fenceId ? String(fenceId) : "");
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setNovoNomePulseira("");
    setCercaSelecionada(""); // Limpar seleção de cerca ao cancelar edição
  };

  const salvarEdicao = async () => {
    if (editandoIndex === null) return;
    try {
      const alvo = pulseirasApi[editandoIndex];
      if (!alvo) return;
      // 1) Atualiza nome
      if (novoNomePulseira && novoNomePulseira !== alvo.nome) {
        await updatePulseiraApi(alvo.id, { nome: novoNomePulseira });
      }
      // 2) Atualiza vínculo de cerca (se mudou)
      const atualFenceId = alvo.cercas?.[0]?.id ? String(alvo.cercas![0].id) : "";
  if (cercaEdicaoSelecionada !== atualFenceId) {
        // Se havia uma cerca antes e foi escolhida outra/deselecionada, remove vínculo anterior
        if (atualFenceId) {
          try {
            await api.delete(`/fences/removeBracelet`, { params: { fence: Number(atualFenceId), bracelet: alvo.id } });
          } catch (err: any) {
            if (err?.response?.status === 404) {
              await authApi.delete(`/fences/removeBracelet`, { params: { fence: Number(atualFenceId), bracelet: alvo.id } });
            } else {
              throw err;
            }
          }
        }
        // Se selecionou uma nova cerca, registra novo vínculo
        if (cercaEdicaoSelecionada) {
          try {
            await api.post(`/fences/registerBracelet`, null, { params: { fence: Number(cercaEdicaoSelecionada), bracelet: alvo.id } });
          } catch (err: any) {
            if (err?.response?.status === 404) {
              await authApi.post(`/fences/registerBracelet`, null, { params: { fence: Number(cercaEdicaoSelecionada), bracelet: alvo.id } });
            } else {
              throw err;
            }
          }
        }
      }
      // Atualiza listagem após operações de vínculo
      await refreshPulseiras();
      cancelarEdicao();
      Toast.show({ type: "success", text1: "Pulseira atualizada!" });
    } catch (e: any) {
      const msg = e?.response?.data ? String(e.response.data) : e?.message;
      Toast.show({ type: "error", text1: msg || "Erro ao atualizar pulseira" });
    }
  };

  const deletarPulseira = async (index: number) => {
    try {
      const alvo = pulseirasApi[index];
      if (!alvo) return;
      await deletePulseiraApi(alvo.id);
      cancelarEdicao();
      Toast.show({ type: "info", text1: "Pulseira excluída!" });
    } catch (e: any) {
      const msg = e?.response?.data ? String(e.response.data) : e?.message;
      Toast.show({ type: "error", text1: msg || "Erro ao excluir pulseira" });
    }
  };

  // Removidos dados locais de AsyncStorage; fonte de verdade é o backend via hook

  // Observação: listagem abaixo exibe as pulseiras do backend (pulseirasApi)

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.titulo, { color: colors.title }]}>Adicionar pulseira</Text>
          <View style={[styles.card, { backgroundColor: colors.infoBox, borderColor: colors.border }] }>
            <Text style={[styles.label, { color: colors.title }]}>Nome da pulseira:</Text>
            <TextInput
              style={[styles.input, { color: colors.title, borderColor: colors.border, backgroundColor: colors.background }]}
              value={nomePulseira}
              onChangeText={setNomePulseira}
            />
            <Text style={[styles.label, { color: colors.title }]}>Selecione uma cerca:</Text>
            <Picker
              selectedValue={cercaSelecionada}
              onValueChange={(itemValue) => setCercaSelecionada(itemValue)}
            >
              <Picker.Item label="Selecione uma cerca" value="" />
              {cercas.map((cerca, idx) => (
                <Picker.Item
                  key={String(cerca.id)}
                  label={cerca.nome}
                  value={String(cerca.id)}
                />
              ))}
            </Picker>
            <View style={styles.botoes}>
              <TouchableOpacity
                style={[styles.botaoAdicionar, { backgroundColor: colors.button }]}
                onPress={adicionarPulseira}
              >
                <Text style={[styles.textoBotao, { color: colors.buttonText }]}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoCancelar, { backgroundColor: colors.button }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.textoBotao, { color: colors.buttonText }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.titulo, { color: colors.title }]}>Pulseiras Cadastradas:</Text>
          {pulseirasApi.map((item, index) => {
            return (
              <View key={String(item.id) || String(index)} style={[styles.card, { backgroundColor: colors.infoBox, borderColor: colors.border }] }>
                {editandoIndex === index ? (
                  <View style={[styles.cardEdicao, { backgroundColor: colors.infoBox, borderColor: colors.border }] }>
                    <TextInput
                      style={[styles.input, { color: colors.title, borderColor: colors.border, backgroundColor: colors.background }]}
                      value={novoNomePulseira}
                      onChangeText={setNovoNomePulseira}
                    />
                    <Picker
                      selectedValue={cercaEdicaoSelecionada}
                      onValueChange={(itemValue) => setCercaEdicaoSelecionada(String(itemValue))}
                    >
                      <Picker.Item label="Selecione uma cerca (opcional)" value="" />
                      {cercas.map((cerca) => (
                        <Picker.Item key={String(cerca.id)} label={cerca.nome} value={String(cerca.id)} />
                      ))}
                    </Picker>
                    <View style={styles.botoes}>
                      <TouchableOpacity
                        style={[styles.botaoadd, { backgroundColor: colors.button }]}
                        onPress={salvarEdicao}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Salvar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botaoCancell, { backgroundColor: colors.button }]}
                        onPress={cancelarEdicao}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botaoExcluir, { backgroundColor: colors.button }]} 
                        onPress={() => deletarPulseira(index)}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => iniciarEdicao(index)}>
                    <Text style={[styles.item, { color: colors.title }]}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
                {/* Status de vínculo de cerca */}
                <Text style={[styles.cercaInfo, { color: colors.title }]}>
                  {item.cercas && item.cercas.length > 0
                    ? `Vinculada à cerca: ${item.cercas.map(c => c.nome).join(", ")}`
                    : 'Sem cerca vinculada'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/Screens/ListarLocalizacoesPulseira",
                      params: {
                        pulseiraId: String(item.id),
                        cercaId: item.cercas && item.cercas.length > 0 ? String(item.cercas[0].id) : "",
                      },
                    });
                  }}
                >
                  <Text style={[styles.textoBotaoVerLocalizacoes, { color: colors.title }] }>
                    Ver Localizações
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  cardEdicao: {
  padding: spacing(1.5),
  margin: spacing(1.25),
    borderWidth: 2,
  borderRadius: moderateScale(8),
  },
  container: {
    flex: 1,
  padding: spacing(2.5),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
  padding: spacing(1.25),
  },
  label: {
  fontSize: moderateScale(20),
    fontWeight: "600",
  marginBottom: spacing(1),
  },
  input: {
    borderWidth: 1,
  padding: spacing(1),
  fontSize: moderateScale(18),
  borderRadius: moderateScale(5),
  marginBottom: spacing(2.5),
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
  gap: spacing(1.5),
  },
  botaoAdicionar: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(2.5),
  borderRadius: moderateScale(4),
  },
  botaoCancelar: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(2.5),
  borderRadius: moderateScale(4),
  },
  botaoadd: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(1.875),
  borderRadius: moderateScale(6),
    flex: 1,
  maxWidth: moderateScale(120),
    alignItems: "center",
  marginHorizontal: spacing(0.625),
  marginBottom: spacing(1.25),
  },
  botaoExcluir: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(1.875),
  borderRadius: moderateScale(6),
    flex: 1,
    alignItems: "center",
  marginHorizontal: spacing(0.625),
  marginBottom: spacing(1.25),
  },
  botaoCancell: {
  paddingVertical: spacing(1.25),
  paddingHorizontal: spacing(0.625),
  borderRadius: moderateScale(6),
    flex: 1,
  maxWidth: moderateScale(120),
  marginBottom: spacing(1.25),
  },
  textoBotao: {
  fontSize: moderateScale(18),
  },
  textoBotaoedit: {
    textAlign: "center",
  fontSize: moderateScale(11),
  },
  titulo: {
  fontSize: moderateScale(27),
    fontWeight: "600",
  marginVertical: spacing(1.25),
  },
  card: {
  padding: spacing(1.25),
  borderRadius: moderateScale(8),
    borderWidth: 1,
  marginBottom: spacing(2.5),
  },
  item: {
  fontSize: moderateScale(18),
  },
  textoBotaoVerLocalizacoes: {
  fontSize: moderateScale(17)
  },
  cercaInfo: {
  fontSize: moderateScale(14),
    color: "#555",
  },
});

export default AdicionarPulseiraScreen;
