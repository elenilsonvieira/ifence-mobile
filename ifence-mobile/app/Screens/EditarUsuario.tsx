import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { saveUserCredentials } from "@/storage/userStorage";

const STORAGE_KEY = "userCredentialsList";

const EditarUsuario = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [originalUsuario, setOriginalUsuario] = useState("");
  const [originalSenha, setOriginalSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await AsyncStorage.getItem("currentUser");
      if (currentUser) {
        setUsuario(currentUser);
        setOriginalUsuario(currentUser);
        // Busca senha do usuário
        const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
        if (usersJson) {
          const users = JSON.parse(usersJson);
          const user = users.find((u: any) => u.username === currentUser);
          if (user) {
            setSenha(user.password);
            setOriginalSenha(user.password);
          }
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const handleSalvar = async () => {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    // Atualiza usuário na lista
    const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
    let users = usersJson ? JSON.parse(usersJson) : [];
    const idx = users.findIndex((u: any) => u.username === originalUsuario);
    if (idx !== -1) {
      users[idx] = { username: usuario, password: senha };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      await AsyncStorage.setItem("currentUser", usuario);
      Alert.alert("Sucesso", "Credenciais atualizadas com sucesso!");
      router.replace("/(tabs)/Home");
    }
  };

  const handleCancelar = () => {
    router.replace("/(tabs)/Home");
  };

  const handleExcluirConta = async () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            // Remove usuário da lista
            const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
            let users = usersJson ? JSON.parse(usersJson) : [];
            users = users.filter((u: any) => u.username !== originalUsuario);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            await AsyncStorage.removeItem("currentUser");
            Alert.alert("Conta excluída", "Sua conta foi removida.");
            router.replace("/auth/LoginScreen");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Credenciais</Text>
      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Senha</Text>
      <View style={styles.senhaContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity
          onPress={() => setMostrarSenha((v) => !v)}
          style={styles.olhinhoBtn}
        >
          <Feather name={mostrarSenha ? 'eye-off' : 'eye'} size={22} color="#003F88" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelar}>
          <Text style={styles.btnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleExcluirConta}>
        <Text style={styles.deleteText}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  olhinhoBtn: {
    marginLeft: 8,
    padding: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003F88',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#003F88',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#003F88',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 18,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditarUsuario;
