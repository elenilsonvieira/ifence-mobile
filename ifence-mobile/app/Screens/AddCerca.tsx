// Componente funcional AddCerca
const AddCerca = () => {
  return (
    <View style={styles.container}>
      {/* TODO: Adicionar o conteúdo da tela aqui */}
      <Text style={styles.textAddCerca}>Adicionar Cerca</Text>
    </View>
  );
};
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter, useNavigation } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 15,
    paddingRight: 15,
  },
  btnBackPage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 3,
    marginLeft: 0,
  },
  textAddCerca: {
    fontFamily: 'Inter_500Medium',
    fontSize: 28,
    color: '#003F88',
    marginTop: 5,
    marginRight: 10,
    marginLeft: 0,
  },
  containerFormAddCerca: {
    borderWidth: 1,
    borderColor: 'rgba(0, 63, 136, 0.5)',
    borderRadius: 5,
    padding: 10,
  },
  labelsInfo: {
    color: '#003F88',
    fontSize: 17,
    fontFamily: 'Inter_500Medium',
    marginTop: 7,
  },
  input: {
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  btnAbrirMapa: {
    backgroundColor: '#003F88',
    width: 150,
    padding: 10,
    borderRadius: 3,
  },
  textBtnMap: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    fontSize: 17,
  },
  BtnAddCerca: {
    backgroundColor: '#1A759F',
    width: 100,
    padding: 10,
    marginTop: 13,
    borderRadius: 3,
    alignSelf: 'center',
  },
  textBtnAddCerca: {
    color: '#FFFFFF',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  disableInput: {
    backgroundColor: 'rgba(108, 117, 125, 0.5)',
  },
  raioInput: {
    width: 80,
  },
  boxButtons: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
    gap: 10,
  },
  BtnCancel: {
    backgroundColor: '#DA1E37',
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
    borderRadius: 4,
  },

  textBtnListarCerca: {
    color: '#FFFFFF',
    fontSize: 17,
  },
});

export default AddCerca;
