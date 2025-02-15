import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

const AddCerca = () => {
  const [fontsloaded] = useFonts({
    // Inter_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    // Inter_700Bold,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>
          <MaterialIcons name="escalator-warning" size={24} color={"#FFFFFF"} />
          <Text style={styles.textHeader}>IFence</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.btnBackPage}>
        <Image source={require("@/assets/images/ArrowBack.png")} />
      </TouchableOpacity>

      <Text style={styles.textAddCerca}>Adicionar Cerca</Text>

      <View style={styles.containerFormAddCerca}>
        <Text style={styles.labelsInfo}>Nome da cerca: </Text>
        <TextInput style={styles.input} placeholder="Informe o nome" />

        <Text style={styles.labelsInfo}>Longitude: </Text>
        <TextInput style={styles.input} placeholder="Informe o nome" />

        <Text style={styles.labelsInfo}>Latitude: </Text>
        <TextInput style={styles.input} placeholder="Informe o nome" />

        <Text style={styles.labelsInfo}>Raio: </Text>
        <TextInput style={styles.input} placeholder="Informe o nome" />

        <Text style={styles.labelsInfo}>Adicionar localização: </Text>
        <TouchableOpacity style={styles.btnAbrirMapa}>
          <Text style={styles.textBtnMap}>Abrir mapa</Text>
        </TouchableOpacity>

        {/* <View style={styles.boxButton}> */}
          {/* <TouchableOpacity style={styles.BtnAddCerca}>
            <Text style={styles.textBtnAddCerca}>Adicionar</Text>
          </TouchableOpacity> */}
        {/* </View> */}
        <TouchableOpacity style={styles.BtnAddCerca}>
            <Text style={styles.textBtnAddCerca}>Adicionar</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.BtnAddCerca}>
            <Text style={styles.textBtnAddCerca}>Adicionar cerca</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#003F88",
    width: "100%",
    padding: 10,
  },
  textHeader: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    textAlign: "center",
  },
  btnBackPage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 3,
    marginLeft: 15,
    marginTop: 15,
  },
  textAddCerca: {
    fontFamily: "Inter_500Medium",
    fontSize: 28,
    color: "#003F88",
    // alignSelf: "center",
    marginRight: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  containerFormAddCerca: {
    borderWidth: 1,
    borderColor: "rgba(0, 63, 136, 0.5)",
    borderRadius: 3,
    padding: 20,
  },
  labelsInfo: {
    color: "#003F88",
  },
  input: {
    borderColor: "#495057",
    borderWidth: 1,
    borderRadius: 3,
    padding: 8,
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
    marginTop: 5
  },
  BtnAddCerca: {
    backgroundColor: "#1A759F",
    width: 100,
    padding: 5,
    marginTop: 13,
    borderRadius: 3,
    alignSelf: 'center'
  },
  textBtnAddCerca: {
    color: "#FFFFFF",
    fontSize: 17,
    textAlign: 'center',
    fontFamily: "Inter_400Regular",
  }
});

export default AddCerca;
