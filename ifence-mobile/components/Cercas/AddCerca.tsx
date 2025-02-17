import {
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
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import Header from "../Header";
import { useState } from "react";

const AddCerca = () => {
  const router = useRouter();

  const [raio, setRaio] = useState(0);

  const {latitude, longitude} = useLocalSearchParams();

  const [fontsloaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

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
          <TextInput style={styles.input} placeholder="Informe o nome" />


          <Text style={styles.labelsInfo}>Latitude:</Text>
          <TextInput
            style={[styles.input, styles.disableInput]}
            editable={false}
            value={latitude}
          />

          <Text style={styles.labelsInfo}>Longitude: </Text>
          <TextInput
            style={[styles.input, styles.disableInput]}
            editable={false}
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
          
          <TouchableOpacity style={styles.btnAbrirMapa} onPress={() => router.push({pathname: "/(tabs)/Map", params: {
            raio: raio.toString(),
          }})}>
              <Text style={styles.textBtnMap}>Abrir mapa</Text>
          </TouchableOpacity>
          
          <View style={styles.boxButtons}>
            <TouchableOpacity style={styles.BtnAddCerca}>
              <Text style={styles.textBtnAddCerca}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BtnCancel}>
              <Text style={styles.textBtnAddCerca}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingLeft: 15,
    paddingRight: 15
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
    width: 100,
    padding: 5,
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
    padding: 5,
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
    padding: 5,
    marginTop: 13,
    borderRadius: 3,
  },
});

export default AddCerca;
