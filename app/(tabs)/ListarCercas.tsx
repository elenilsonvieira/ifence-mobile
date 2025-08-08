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

  const handleSalvar = (dados: Partial<import("@/components/Cercas/hooks/useCercas").Cerca>) => {
    if (cercaEditando && cercaEditando.id) {
      updateCerca(cercaEditando.id, dados);
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
                params: { raio: raioVal },
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
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
              <CercaTable
                cercas={cercas.map((c) => ({
                  id: c.id,
                  nome: c.nome,
                  coordenadas: `${c.latitude}, ${c.longitude}`
                }))}
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
              onDelete={(id: string | number) => deleteCerca(id)}
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
    padding: 20,
  },
  formContainer: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  disableInput: {
  },
  labelsInfo: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
  },
  btnAbrirMapa: {
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnAbrirMapaText: {
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  btnBackPage: {
    alignSelf: "flex-start",
    marginLeft: 0,
  },
  button: {
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ListarCercas;
