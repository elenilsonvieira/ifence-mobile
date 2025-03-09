import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter,useNavigation } from "expo-router";
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { salvarCerca } from "@/components/Cercas/storage/cercaStorage";

const AddCerca = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [raio, setRaio] = useState(0);
  const [nome, setNome] = useState("");
  const inputRefLatitude = useRef(null);
  const inputRefLongitude = useRef(null);
  const { latitude, longitude } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [fontsloaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleSaveCerca = async () => {
    if (!latitude || !longitude) {
      Alert.alert("Erro", "Por favor, selecione um local no mapa.");
      return;
    }
  
    const novaCerca = {
      nome,
      latitude,
      longitude,
      raio: raio,
    };
  
    try {
      const cercasAtualizadas = await salvarCerca(novaCerca); // Salva e retorna a lista atualizada
      console.log("Cercas atualizadas:", cercasAtualizadas); // Log para depuração
  
      setNome("");
      setRaio(0);
      inputRefLatitude.current.clear();
      inputRefLongitude.current.clear();
  
      Alert.alert("Sucesso", "Cerca salva com sucesso!");
  
      // Atualiza o estado das cercas (se necessário)
      // Se você estiver usando um contexto ou estado global, atualize-o aqui.
    } catch (error) {
      console.error("Erro ao salvar a cerca:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a cerca.");
    }
  };

  return (
    <>
      <Header />
      <SafeAreaView style={styles.container}>
        <Link href={"/(tabs)"} asChild>
          <TouchableOpacity style={styles.btnBackPage}>
            <Image source={require("@/assets/images/ArrowBack.png")} />
          </TouchableOpacity>
        </Link>

        <Text style={styles.textAddCerca}>Adicionar Cerca</Text>

        <View style={styles.containerFormAddCerca}>
          <Text style={styles.labelsInfo}>Nome da cerca: </Text>
          <TextInput
            style={styles.input}
            placeholder="Informe o nome"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.labelsInfo}>Latitude:</Text>
          <TextInput
            style={[styles.input, styles.disableInput]}
            editable={false}
            ref={inputRefLatitude}
            value={latitude}
          />

          <Text style={styles.labelsInfo}>Longitude: </Text>
          <TextInput
            style={[styles.input, styles.disableInput]}
            editable={false}
            ref={inputRefLongitude}
            value={longitude}
          />

          <Text style={styles.labelsInfo}>Raio:</Text>
          <TextInput
            style={[styles.input, styles.raioInput]}
            keyboardType="numeric"
            value={raio}
            onChangeText={setRaio}
          />

          <Text style={styles.labelsInfo}>Adicionar localização: </Text>

          <TouchableOpacity
            style={styles.btnAbrirMapa}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/Map",
                params: {
                  raio: raio.toString(),
                },
              })
            }
          >
            <Text style={styles.textBtnMap}>Abrir mapa</Text>
          </TouchableOpacity>

          <View style={styles.boxButtons}>
            <TouchableOpacity
              style={styles.BtnAddCerca}
              onPress={handleSaveCerca}
            >
              <Text style={styles.textBtnAddCerca}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BtnCancel}>
              <Text style={styles.textBtnAddCerca}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>

        <Link href={"/(tabs)/ListarCercas"} asChild>
          <TouchableOpacity style={styles.btnListCercas}>
            <Text style={styles.textBtnListarCerca}>Lista de cercas</Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingLeft: 15,
    paddingRight: 15,
  },
  btnBackPage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 3,
    marginLeft: 0,
  },
  textAddCerca: {
    fontFamily: "Inter_500Medium",
    fontSize: 28,
    color: "#003F88",
    marginTop: 5,
    marginRight: 10,
    marginLeft: 0,
  },
  containerFormAddCerca: {
    borderWidth: 1,
    borderColor: "rgba(0, 63, 136, 0.5)",
    borderRadius: 5,
    padding: 10,
  },
  labelsInfo: {
    color: "#003F88",
    fontSize: 16,
  },
  input: {
    borderColor: "#495057",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  btnAbrirMapa: {
    backgroundColor: "#003F88",
    width: 150,
    padding: 10,
    borderRadius: 3,
  },
  textBtnMap: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    fontSize: 17,
  },
  labelsInfo: {
    color: "#003F88",
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    marginTop: 7,
  },
  BtnAddCerca: {
    backgroundColor: "#1A759F",
    width: 100,
    padding: 10,
    marginTop: 13,
    borderRadius: 3,
    alignSelf: "center",
  },
  textBtnAddCerca: {
    color: "#FFFFFF",
    fontSize: 17,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  disableInput: {
    backgroundColor: "rgba(108, 117, 125, 0.5)",
  },
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
    backgroundColor: "#DA1E37",
    width: 100,
    padding: 10,
    marginTop: 13,
    borderRadius: 3,
  },
  btnListCercas: {
    backgroundColor: '#003F88',
    alignSelf: 'center',
    padding: 10,
    marginTop: 10,
    borderRadius: 4
  },
  textBtnListarCerca: {
    color: '#FFFFFF',
    fontSize: 17
  }
});

export default AddCerca;
