export const options = {
  headerShown: false,
};
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import Header from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EditarUsuarioScreen() {
  const colors = useDaltonicColors();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("currentUser");
        const savedPassword = await AsyncStorage.getItem("currentUserPassword");
        setUsername(savedUsername !== null ? savedUsername : "");
        setPassword(savedPassword !== null ? savedPassword : "");
      } catch (e) {
        setUsername("");
        setPassword("");
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("currentUser", username ?? "");
    await AsyncStorage.setItem("currentUserPassword", password ?? "");
    // Força atualização do campo após salvar
    const checkPassword = await AsyncStorage.getItem("currentUserPassword");
    setPassword(checkPassword !== null ? checkPassword : "");
    if (checkPassword === password) {
      Alert.alert("Sucesso", "Credenciais atualizadas!");
    } else {
      Alert.alert("Erro", "Não foi possível salvar a senha. Tente novamente.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={[styles.title, { color: colors.title }]}>Editar Credenciais</Text>
        <Text style={[styles.label, { color: colors.title }]}>Novo nome de usuário</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.title, borderColor: colors.border }]}
          placeholder="Digite o novo nome de usuário"
          placeholderTextColor={colors.subtitle}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={[styles.label, { color: colors.title }]}>Nova senha</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.title, borderColor: colors.border }]}
          placeholder="Digite a nova senha"
          placeholderTextColor={colors.subtitle}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]} onPress={handleSave}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.border }]} onPress={() => router.replace("/(tabs)/Home") }>
          <Text style={[styles.buttonText, { color: colors.title }]}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.deleteButton, { backgroundColor: '#D7263D' }]} onPress={async () => {
          await AsyncStorage.removeItem("currentUser");
          await AsyncStorage.removeItem("currentUserPassword");
          router.replace("/");
        }}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>Excluir Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
});

export default EditarUsuarioScreen;
