import { useDaltonicColors } from "../hooks/useDaltonicColors";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert, ScrollView } from "react-native";
import Header from "@/components/Header";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useCercas } from "@/components/Cercas/hooks/useCercas";
import CercaTable from "@/components/Cercas/components/CercaTable";
import { CercaModal } from "@/components/Cercas/components/CercaModal";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { spacing, moderateScale } from "../../utils/responsive";

const ListarCercas = () => {
  const colors = useDaltonicColors();
  const { cercas, loading, addCerca, updateCerca, deleteCerca } = useCercas();
  const [modalVisible, setModalVisible] = useState(false);
  const [cercaEditando, setCercaEditando] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [raio, setRaio] = useState("");
  const params = useLocalSearchParams();

  // Preencher latitude/longitude se vierem do mapa (cadastro)
  React.useEffect(() => {
    if (params.latitude && params.longitude && !params.from) {
      setLatitude(params.latitude as string);
      setLongitude(params.longitude as string);
    }
  }, [params.latitude, params.longitude, params.from]);

  // Se vier do mapa para edição, reabrir modal e preencher coordenadas
  React.useEffect(() => {
    if (params.latitude && params.longitude && params.from === 'modal' && cercaEditando) {
      setCercaEditando((prev: any) => ({
        ...prev,
        latitude: params.latitude as string,
        longitude: params.longitude as string,
      }));
      setModalVisible(true);
    }
  }, [params.latitude, params.longitude, params.from]);
  const [horarioInicio, setHorarioInicio] = useState(new Date());
  const [horarioFim, setHorarioFim] = useState(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFimPicker, setShowFimPicker] = useState(false);
  const router = useRouter();

  const handleCriar = () => {
    if (!nome.trim() || !latitude.trim() || !longitude.trim() || !raio.trim()) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }
    addCerca({
      nome,
      latitude,
      longitude,
      raio,
      horarioInicio: horarioInicio.toTimeString().slice(0, 5),
      horarioFim: horarioFim.toTimeString().slice(0, 5),
    });
    setNome("");
    setLatitude("");
    setLongitude("");
    setRaio("");
    setHorarioInicio(new Date());
    setHorarioFim(new Date());
  };

  const handleSalvar = (dados: {
    nome: string;
    latitude: string;
    longitude: string;
    raio: string;
    horarioInicio: string;
    horarioFim: string;
  }) => {
    if (cercaEditando && cercaEditando.id) {
      updateCerca(cercaEditando.id, dados);
    } else {
      addCerca(dados);
    }
    setModalVisible(false);
    setCercaEditando(null);
  };

  const onChangeInicio = (_event: unknown, selectedDate?: Date) => {
    setShowInicioPicker(false);
    if (selectedDate) setHorarioInicio(selectedDate);
  };
  const onChangeFim = (_event: unknown, selectedDate?: Date) => {
    setShowFimPicker(false);
    if (selectedDate) setHorarioFim(selectedDate);
  };

  return (
    <>
      <Header />
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Link href={"/(tabs)/Home"} asChild>
          <TouchableOpacity style={styles.btnBackPage}>
            <Image source={require("@/assets/images/ArrowBack.png")} />
          </TouchableOpacity>
        </Link>
        <Text style={[styles.titulo, { color: colors.title }]}>Cadastrar Nova Cerca</Text>
        <View style={[styles.formContainer, { backgroundColor: colors.infoBox }] }>
          <Text style={[styles.labelsInfo, { color: colors.title }]}>Nome da cerca:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border }]}
            placeholder="Informe o nome"
            value={nome}
            onChangeText={setNome}
          />
          <Text style={[styles.labelsInfo, { color: colors.title }]}>Latitude:</Text>
          <TextInput
            style={[styles.input, styles.disableInput, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border }]}
            placeholder="Selecione no mapa"
            value={latitude}
            editable={false}
          />
          <Text style={[styles.labelsInfo, { color: colors.title }]}>Longitude:</Text>
          <TextInput
            style={[styles.input, styles.disableInput, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border }]}
            placeholder="Selecione no mapa"
            value={longitude}
            editable={false}
          />
          <TouchableOpacity
            style={[styles.btnAbrirMapa, { backgroundColor: colors.button }]}
            onPress={() => {
              // Garante que o raio seja passado e nunca vazio
              const raioVal = raio && !isNaN(Number(raio)) && Number(raio) > 0 ? raio : "100";
              router.push({
                pathname: "/Screens/Map",
                params: { raio: raioVal, returnTo: "/(tabs)/ListarCercas" },
              });
            }}
          >
            <Text style={[styles.btnAbrirMapaText, { color: colors.buttonText }]}>Selecionar Local no Mapa</Text>
          </TouchableOpacity>
          <Text style={[styles.labelsInfo, { color: colors.title }]}>Raio (metros):</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.infoBox, color: colors.infoText, borderColor: colors.border }]}
            keyboardType="numeric"
            placeholder="Informe o raio"
            value={raio}
            onChangeText={setRaio}
          />
          <Text style={[styles.labelsInfo, { color: colors.title }]}>Horário de início:</Text>
          <TouchableOpacity style={[styles.input, { backgroundColor: colors.infoBox, borderColor: colors.border }]} onPress={() => setShowInicioPicker(true)}>
            <Text>{horarioInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showInicioPicker && (
            <DateTimePicker
              value={horarioInicio}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeInicio}
            />
          )}
          <Text style={[styles.labelsInfo, { color: colors.title }]}>Horário de fim:</Text>
          <TouchableOpacity style={[styles.input, { backgroundColor: colors.infoBox, borderColor: colors.border }]} onPress={() => setShowFimPicker(true)}>
            <Text>{horarioFim.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showFimPicker && (
            <DateTimePicker
              value={horarioFim}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeFim}
            />
          )}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]} onPress={handleCriar}>
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.infoBox }]} onPress={() => router.push('/(tabs)/Home')}>
              <Text style={[styles.buttonText, { color: colors.infoText }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.titulo, { color: colors.title }]}>Cercas Cadastradas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ flexGrow: 0, backgroundColor: colors.infoBox }}>
          <View style={{ minWidth: 600, flex: 1 }}>
            {loading ? (
              <ActivityIndicator size="large" style={{ marginTop: spacing(2) }} />
            ) : (
              <CercaTable
                cercas={cercas as any}
              onEdit={(cerca: any) => {
                // Encontrar a cerca original pelo id para edição completa
                const original = cercas.find((c) => c.id === cerca.id);
                if (original) {
                  setCercaEditando({
                    id: original.id,
                    nome: original.nome,
                    latitude: original.latitude,
                    longitude: original.longitude,
                    raio: original.raio,
                    horarioInicio: original.horarioInicio,
                    horarioFim: original.horarioFim,
                  });
                } else {
                  setCercaEditando(null);
                }
                setModalVisible(true);
              }}
              onDelete={(id: string | number) => deleteCerca(String(id))}
              />
            )}
          </View>
        </ScrollView>
        </ScrollView>
        <CercaModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSalvar}
          cercaParaEditar={cercaEditando}
        />
      </View>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  padding: spacing(2),
  },
  formContainer: {
  marginBottom: spacing(2),
  padding: spacing(1.5),
  borderRadius: moderateScale(8),
  },
  input: {
    borderWidth: 1,
  borderRadius: moderateScale(4),
  padding: spacing(1),
  marginBottom: spacing(1),
  },
  disableInput: {
  },
  labelsInfo: {
    fontWeight: 'bold',
  marginBottom: spacing(0.5),
  marginTop: spacing(1),
  },
  btnAbrirMapa: {
  borderRadius: moderateScale(5),
  padding: spacing(1),
    alignItems: 'center',
  marginBottom: spacing(1),
  },
  btnAbrirMapaText: {
    fontWeight: 'bold',
  },
  titulo: {
  fontSize: moderateScale(24),
    fontWeight: "bold",
  marginBottom: spacing(1),
    textAlign: "center",
  },
  btnBackPage: {
    alignSelf: "flex-start",
    marginLeft: 0,
  },
  button: {
  borderRadius: moderateScale(5),
  padding: spacing(1.5),
    alignItems: "center",
  marginTop: spacing(1),
  },
  buttonText: {
  fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});

export default ListarCercas;
