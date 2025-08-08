
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from "react-native";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import { useRouter, useNavigation, useLocalSearchParams, Link } from "expo-router";
import Header from "@/components/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { salvarCerca } from "@/storage/cercaStorage";

const AddCerca = () => {
  const colors = useDaltonicColors();
  const router = useRouter();
  const navigation = useNavigation();

  const [raio, setRaio] = useState<string>("");
  const [nome, setNome] = useState("");
  const [horarioInicio, setHorarioInicio] = useState(new Date());
  const [horarioFim, setHorarioFim] = useState(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFimPicker, setShowFimPicker] = useState(false);
  const inputRefLatitude = useRef<TextInput>(null);
  const inputRefLongitude = useRef<TextInput>(null);
  const { latitude = "", longitude = "" } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);



  const handleSaveCerca = async () => {
    if (!latitude || !longitude) {
      Alert.alert("Erro", "Por favor, selecione um local no mapa.");
      return;
    }
    const novaCerca = {
      nome,
      latitude: typeof latitude === "string" ? latitude : Array.isArray(latitude) ? latitude[0] : "",
      longitude: typeof longitude === "string" ? longitude : Array.isArray(longitude) ? longitude[0] : "",
      raio: Number(raio),
      horarioInicio: horarioInicio.toTimeString().slice(0, 5),
      horarioFim: horarioFim.toTimeString().slice(0, 5),
    };
    try {
      await salvarCerca(novaCerca);
      setNome("");
      setRaio("");
      if (inputRefLatitude.current) inputRefLatitude.current.clear();
      if (inputRefLongitude.current) inputRefLongitude.current.clear();
      setHorarioInicio(new Date());
      setHorarioFim(new Date());
      Alert.alert("Sucesso", "Cerca salva com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a cerca.");
    }
  };

  const onChangeInicio = (event: any, selectedDate: Date | undefined) => {
    setShowInicioPicker(false);
    if (selectedDate) setHorarioInicio(selectedDate);
  };
  const onChangeFim = (event: any, selectedDate: Date | undefined) => {
    setShowFimPicker(false);
    if (selectedDate) setHorarioFim(selectedDate);
  };

  return (
    <>
      <Header />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
        <ScrollView>
          <Link href="/(tabs)/Home" asChild>
            <TouchableOpacity style={styles.btnBackPage}>
              <Image source={require("@/assets/images/ArrowBack.png")} />
            </TouchableOpacity>
          </Link>
          <Text style={[styles.textAddCerca, { color: colors.title }]}>Adicionar Cerca</Text>
          <View style={[styles.containerFormAddCerca, { borderColor: colors.border }] }>
            <Text style={[styles.labelsInfo, { color: colors.title }]}>Nome da cerca: </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.infoBox, borderColor: colors.border }]}
              placeholder="Informe o nome"
              value={nome}
              onChangeText={setNome}
            />
            <Text style={[styles.labelsInfo, { color: colors.title }]}>Latitude:</Text>
            <TextInput
              style={[styles.input, styles.disableInput, { backgroundColor: colors.infoBox, borderColor: colors.border, color: colors.infoText }]}
              editable={false}
              ref={inputRefLatitude}
              value={typeof latitude === "string" ? latitude : Array.isArray(latitude) ? latitude[0] : ""}
            />
            <Text style={[styles.labelsInfo, { color: colors.title }]}>Longitude: </Text>
            <TextInput
              style={[styles.input, styles.disableInput, { backgroundColor: colors.infoBox, borderColor: colors.border, color: colors.infoText }]}
              editable={false}
              ref={inputRefLongitude}
              value={typeof longitude === "string" ? longitude : Array.isArray(longitude) ? longitude[0] : ""}
            />
            <Text style={[styles.labelsInfo, { color: colors.title }]}>Raio:</Text>
            <TextInput
              style={[styles.input, styles.raioInput, { backgroundColor: colors.infoBox, borderColor: colors.border, color: colors.infoText }]}
              keyboardType="numeric"
              value={raio}
              onChangeText={setRaio}
            />
            <Text style={[styles.labelsInfo, { color: colors.title }]}>Horário de início:</Text>
            <TouchableOpacity
              style={[styles.input, { backgroundColor: colors.infoBox, borderColor: colors.border }]}
              onPress={() => setShowInicioPicker(true)}
            >
              <Text>{horarioInicio.toLocaleTimeString()}</Text>
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
            <TouchableOpacity
              style={[styles.input, { backgroundColor: colors.infoBox, borderColor: colors.border }]}
              onPress={() => setShowFimPicker(true)}
            >
              <Text>{horarioFim.toLocaleTimeString()}</Text>
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
            <Text style={[styles.labelsInfo, { color: colors.title }]}>Adicionar localização: </Text>
            <TouchableOpacity
              style={[styles.btnAbrirMapa, { backgroundColor: colors.button }]}
              onPress={() =>
                router.push({
                  pathname: "/Screens/Map",
                  params: {
                    raio: raio.toString(),
                  },
                })
              }
            >
              <Text style={[styles.textBtnMap, { color: colors.buttonText }]}>Abrir mapa</Text>
            </TouchableOpacity>
            <View style={styles.boxButtons}>
              <TouchableOpacity
                style={[styles.BtnAddCerca, { backgroundColor: colors.button }]}
                onPress={handleSaveCerca}
              >
                <Text style={[styles.textBtnAddCerca, { color: colors.buttonText }]}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.BtnCancel, { backgroundColor: colors.infoBox }]}
                onPress={() => {
                  setNome("");
                  setRaio("");
                  setHorarioInicio(new Date());
                  setHorarioFim(new Date());
                }}
              >
                <Text style={[styles.textBtnAddCerca, { color: colors.title }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Link href="/(tabs)/ListarCercas" asChild>
            <TouchableOpacity style={[styles.btnListCercas, { backgroundColor: colors.button }] }>
              <Text style={[styles.textBtnListarCerca, { color: colors.buttonText }]}>Lista de cercas</Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  btnBackPage: {
    alignSelf: "flex-start",
    padding: 3,
    marginLeft: 0,
  },
  textAddCerca: {
    fontFamily: "Inter_500Medium",
    fontSize: 28,
    marginTop: 5,
    marginRight: 10,
    marginLeft: 0,
  },
  containerFormAddCerca: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  btnAbrirMapa: {
    width: 150,
    padding: 10,
    borderRadius: 3,
  },
  textBtnMap: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    fontSize: 17,
  },
  labelsInfo: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    marginTop: 7,
  },
  BtnAddCerca: {
    width: 100,
    padding: 10,
    marginTop: 13,
    borderRadius: 3,
    alignSelf: "center",
  },
  textBtnAddCerca: {
    fontSize: 17,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  disableInput: {},
  raioInput: {
    width: 80,
  },
  boxButtons: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "center",
    gap: 10,
  },
  BtnCancel: {
    width: 100,
    padding: 10,
    marginTop: 13,
    borderRadius: 3,
  },
  btnListCercas: {
    alignSelf: "center",
    padding: 10,
    marginTop: 10,
    borderRadius: 4,
  },
  textBtnListarCerca: {
    fontSize: 17,
  },
});

export default AddCerca;
